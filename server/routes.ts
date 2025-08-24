import type { Express } from "express";
import { createServer, type Server } from "http";

// Simple in-memory cache with TTL
type CacheEntry = { expiresAt: number; data: any };
const weatherCache = new Map<string, CacheEntry>();
const DEFAULT_TTL_MS = 2 * 60 * 1000; // 2 minutes

const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5";
const GEOCODING_API_URL = "https://api.openweathermap.org/geo/1.0";

function getCacheKey(params: Record<string, string | number | undefined>): string {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
}

function setCache(key: string, data: any, ttlMs = DEFAULT_TTL_MS) {
  weatherCache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

function getCache(key: string): any | null {
  const entry = weatherCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    weatherCache.delete(key);
    return null;
  }
  return entry.data;
}

async function geocodeCity(city: string, apiKey: string) {
  const url = `${GEOCODING_API_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) throw new Error("Location not found");
  return {
    latitude: data[0].lat,
    longitude: data[0].lon,
    name: data[0].name as string,
    region: (data[0].state as string) || "",
    country: data[0].country as string,
  };
}

async function reverseGeocode(lat: number, lon: number, apiKey: string) {
  const url = `${GEOCODING_API_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Reverse geocoding failed: ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    return { name: "Current Location", country: "", region: "" };
  }
  return {
    name: (data[0].name as string) || "Current Location",
    region: (data[0].state as string) || "",
    country: (data[0].country as string) || "",
  };
}

function getWindDirection(degrees: number): string {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

function isDaytime(dt: number, sunrise: number, sunset: number): boolean {
  return dt >= sunrise && dt < sunset;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Weather proxy route
  app.get("/api/weather", async (req, res, next) => {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        res.status(500).json({ message: "Server misconfigured: OPENWEATHER_API_KEY missing" });
        return;
      }

      const loc = (req.query.loc as string) || "";
      const units = (req.query.units as string) || "metric";

      if (!loc) {
        res.status(400).json({ message: "Missing query parameter: loc" });
        return;
      }

      // Determine coordinates
      let latitude: number;
      let longitude: number;
      let locationName = "";
      let region = "";
      let country = "";

      const coordMatch = loc.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
      if (coordMatch) {
        latitude = parseFloat(coordMatch[1]);
        longitude = parseFloat(coordMatch[2]);
        const rev = await reverseGeocode(latitude, longitude, apiKey);
        locationName = rev.name;
        region = rev.region;
        country = rev.country;
      } else {
        const geo = await geocodeCity(loc, apiKey);
        latitude = geo.latitude;
        longitude = geo.longitude;
        locationName = geo.name;
        region = geo.region;
        country = geo.country;
      }

      const cacheKey = getCacheKey({ latitude, longitude, units });
      const cached = getCache(cacheKey);
      if (cached) {
        res.json(cached);
        return;
      }

      // Fetch current weather
      const currentUrl = `${OPENWEATHER_API_URL}/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
      const currentRes = await fetch(currentUrl);
      if (!currentRes.ok) throw new Error(`Current weather failed: ${currentRes.status}`);
      const current = await currentRes.json();

      // Fetch 5-day forecast (3-hourly)
      const forecastUrl = `${OPENWEATHER_API_URL}/forecast?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
      const forecastRes = await fetch(forecastUrl);
      if (!forecastRes.ok) throw new Error(`Forecast failed: ${forecastRes.status}`);
      const forecast = await forecastRes.json();

      const dayMap = new Map<string, any[]>();
      (forecast.list || []).forEach((item: any) => {
        const date = new Date(item.dt * 1000).toISOString().split("T")[0];
        if (!dayMap.has(date)) dayMap.set(date, []);
        dayMap.get(date)!.push(item);
      });

      const dailyForecasts: any[] = [];
      for (const [date, items] of Array.from(dayMap.entries())) {
        if (dailyForecasts.length >= 3) break; // limit to 3 days
        let minTemp = Infinity;
        let maxTemp = -Infinity;
        let totalTemp = 0;
        let maxPop = 0; // max probability of precipitation in %
        let maxWindKph = 0;
        let avgHumidity = 0;

        const hourlyData = items.map((it: any) => {
          const temp = it.main.temp as number;
          if (temp < minTemp) minTemp = temp;
          if (temp > maxTemp) maxTemp = temp;
          totalTemp += temp;
          const windKph = Math.round((it.wind.speed as number) * 3.6);
          if (windKph > maxWindKph) maxWindKph = windKph;
          avgHumidity += it.main.humidity as number;
          const popPct = Math.round(((it.pop as number) || 0) * 100);
          if (popPct > maxPop) maxPop = popPct;
          const isDay = isDaytime(it.dt, current.sys.sunrise, current.sys.sunset);
          return {
            time: new Date(it.dt * 1000).toISOString(),
            temp_c: Math.round(temp),
            temp_f: Math.round(temp * 9 / 5 + 32),
            wind_kph: windKph,
            wind_mph: Math.round((it.wind.speed as number) * 2.237),
            wind_dir: getWindDirection(it.wind.deg as number),
            humidity: it.main.humidity,
            feelslike_c: Math.round(it.main.feels_like),
            feelslike_f: Math.round(it.main.feels_like * 9 / 5 + 32),
            condition: { text: it.weather?.[0]?.main || "Unknown", code: it.weather?.[0]?.id },
            chance_of_rain: popPct,
          };
        });

        avgHumidity = Math.round(avgHumidity / items.length);

        // Choose a representative item around noon for condition
        const noonItem = items.find((it: any) => {
          const h = new Date(it.dt * 1000).getHours();
          return h >= 12 && h <= 14;
        }) || items[0];

        dailyForecasts.push({
          date,
          day: {
            maxtemp_c: Math.round(maxTemp),
            maxtemp_f: Math.round(maxTemp * 9 / 5 + 32),
            mintemp_c: Math.round(minTemp),
            mintemp_f: Math.round(minTemp * 9 / 5 + 32),
            avgtemp_c: Math.round(totalTemp / items.length),
            avgtemp_f: Math.round((totalTemp / items.length) * 9 / 5 + 32),
            condition: { text: noonItem.weather?.[0]?.main || "Unknown", code: noonItem.weather?.[0]?.id },
            uv: 5, // default unless supplemented
            daily_chance_of_rain: maxPop,
            totalprecip_mm: 0,
            maxwind_kph: maxWindKph,
            avghumidity: avgHumidity,
          },
          astro: {
            sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            moonrise: "Not available",
            moonset: "Not available",
            moon_phase: "Not available",
            moon_illumination: "Not available",
          },
          hour: hourlyData,
        });
      }

      if (dailyForecasts.length === 0) {
        dailyForecasts.push({
          date: new Date().toISOString().split("T")[0],
          day: {
            maxtemp_c: Math.round(current.main.temp_max),
            maxtemp_f: Math.round(current.main.temp_max * 9 / 5 + 32),
            mintemp_c: Math.round(current.main.temp_min),
            mintemp_f: Math.round(current.main.temp_min * 9 / 5 + 32),
            avgtemp_c: Math.round(current.main.temp),
            avgtemp_f: Math.round(current.main.temp * 9 / 5 + 32),
            condition: { text: current.weather?.[0]?.main || "Unknown", code: current.weather?.[0]?.id },
            uv: 5,
            daily_chance_of_rain: 0,
            totalprecip_mm: 0,
            maxwind_kph: Math.round(current.wind.speed * 3.6),
            avghumidity: current.main.humidity,
          },
          astro: {
            sunrise: new Date(current.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            sunset: new Date(current.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            moonrise: "Not available",
            moonset: "Not available",
            moon_phase: "Not available",
            moon_illumination: "Not available",
          },
          hour: [],
        });
      }

      const normalized = {
        location: {
          name: locationName,
          region,
          country,
          lat: latitude,
          lon: longitude,
          tz_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
          localtime: new Date().toISOString(),
        },
        current: {
          last_updated: new Date(current.dt * 1000).toISOString(),
          temp_c: Math.round(current.main.temp),
          temp_f: Math.round(current.main.temp * 9 / 5 + 32),
          is_day: isDaytime(current.dt, current.sys.sunrise, current.sys.sunset) ? 1 : 0,
          condition: { text: current.weather?.[0]?.main || "Unknown", code: current.weather?.[0]?.id },
          wind_mph: Math.round(current.wind.speed * 2.237),
          wind_kph: Math.round(current.wind.speed * 3.6),
          wind_degree: current.wind.deg,
          wind_dir: getWindDirection(current.wind.deg),
          pressure_mb: current.main.pressure,
          pressure_in: Math.round(current.main.pressure * 0.02953 * 100) / 100,
          precip_mm: current.rain ? current.rain["1h"] || 0 : 0,
          precip_in: current.rain ? Math.round(((current.rain["1h"] || 0) * 0.0393701) * 100) / 100 : 0,
          humidity: current.main.humidity,
          cloud: current.clouds ? current.clouds.all : 0,
          feelslike_c: Math.round(current.main.feels_like),
          feelslike_f: Math.round(current.main.feels_like * 9 / 5 + 32),
          vis_km: current.visibility / 1000,
          vis_miles: Math.round((current.visibility / 1609.34) * 10) / 10,
          uv: 5,
          gust_mph: current.wind.gust ? Math.round(current.wind.gust * 2.237) : undefined,
          gust_kph: current.wind.gust ? Math.round(current.wind.gust * 3.6) : undefined,
        },
        forecast: {
          forecastday: dailyForecasts,
        },
        raw: {
          current,
          forecast,
          list: forecast.list || [],
        },
      };

      setCache(cacheKey, normalized);
      res.json(normalized);
    } catch (err) {
      next(err);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
