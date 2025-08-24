// Weather API integration using OpenWeather API
// Using environment variables for API key security

// API Configuration
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY; // Using environment variable for API key security
const API_URL = 'https://api.openweathermap.org/data/2.5';
const GEOCODING_API_URL = 'https://api.openweathermap.org/geo/1.0';

// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

// Get current date and next dates for forecast
const getCurrentAndNextDates = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  return [
    formatDate(today),
    formatDate(tomorrow),
    formatDate(dayAfterTomorrow)
  ];
};

// Map OpenWeather codes to weather conditions
const getWeatherCondition = (id: number, isDay: boolean = true) => {
  // Weather condition mapping based on OpenWeather API condition codes
  // https://openweathermap.org/weather-conditions
  
  // Thunderstorm
  if (id >= 200 && id < 300) {
    return {
      text: id < 210 ? 'Thunderstorm with Rain' : 'Thunderstorm',
      icon: `//cdn.weatherapi.com/weather/64x64/${isDay ? 'day' : 'night'}/386.png`,
      code: id
    };
  }
  
  // Drizzle
  if (id >= 300 && id < 400) {
    return {
      text: 'Drizzle',
      icon: `//cdn.weatherapi.com/weather/64x64/${isDay ? 'day' : 'night'}/266.png`,
      code: id
    };
  }
  
  // Rain
  if (id >= 500 && id < 600) {
    let intensity = 'Moderate';
    let iconCode = '296';
    
    if (id === 500 || id === 520) {
      intensity = 'Light';
      iconCode = '293';
    } else if (id === 502 || id === 522) {
      intensity = 'Heavy';
      iconCode = '308';
    } else if (id === 511) {
      intensity = 'Freezing';
      iconCode = '281';
    }
    
    return {
      text: `${intensity} Rain`,
      icon: `//cdn.weatherapi.com/weather/64x64/${isDay ? 'day' : 'night'}/${iconCode}.png`,
      code: id
    };
  }
  
  // Snow
  if (id >= 600 && id < 700) {
    let intensity = 'Moderate';
    let iconCode = '332';
    
    if (id === 600) {
      intensity = 'Light';
      iconCode = '326';
    } else if (id === 602) {
      intensity = 'Heavy';
      iconCode = '338';
    } else if (id === 611 || id === 612 || id === 613) {
      intensity = 'Sleet';
      iconCode = '317';
    }
    
    return {
      text: `${intensity} Snow`,
      icon: `//cdn.weatherapi.com/weather/64x64/${isDay ? 'day' : 'night'}/${iconCode}.png`,
      code: id
    };
  }
  
  // Atmosphere (fog, mist, etc.)
  if (id >= 700 && id < 800) {
    let condition = 'Mist';
    let iconCode = '143';
    
    if (id === 711) {
      condition = 'Smoke';
    } else if (id === 721) {
      condition = 'Haze';
    } else if (id === 731 || id === 761) {
      condition = 'Dust';
    } else if (id === 741) {
      condition = 'Fog';
      iconCode = '248';
    } else if (id === 751) {
      condition = 'Sand';
    } else if (id === 762) {
      condition = 'Volcanic Ash';
    } else if (id === 771) {
      condition = 'Squalls';
    } else if (id === 781) {
      condition = 'Tornado';
      iconCode = '389';
    }
    
    return {
      text: condition,
      icon: `//cdn.weatherapi.com/weather/64x64/${isDay ? 'day' : 'night'}/${iconCode}.png`,
      code: id
    };
  }
  
  // Clear
  if (id === 800) {
    return {
      text: 'Clear',
      icon: `//cdn.weatherapi.com/weather/64x64/${isDay ? 'day' : 'night'}/113.png`,
      code: id
    };
  }
  
  // Clouds
  if (id > 800 && id < 900) {
    let cloudiness = 'Partly';
    let iconCode = '116';
    
    if (id === 802) {
      cloudiness = 'Scattered';
      iconCode = '116';
    } else if (id === 803) {
      cloudiness = 'Broken';
      iconCode = '119';
    } else if (id === 804) {
      cloudiness = 'Overcast';
      iconCode = '122';
    }
    
    return {
      text: `${cloudiness} Cloudy`,
      icon: `//cdn.weatherapi.com/weather/64x64/${isDay ? 'day' : 'night'}/${iconCode}.png`,
      code: id
    };
  }
  
  // Default fallback
  return {
    text: 'Unknown',
    icon: `//cdn.weatherapi.com/weather/64x64/day/116.png`,
    code: id
  };
};

// Convert wind direction in degrees to compass direction
const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

// Check if it's daytime based on sunrise/sunset
const isDaytime = (dt: number, sunrise: number, sunset: number): boolean => {
  return dt >= sunrise && dt < sunset;
};

// Function to get geocoding for a location
const getGeocode = async (city: string) => {
  try {
    const response = await fetch(
      `${GEOCODING_API_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to geocode location');
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      throw new Error('Location not found');
    }
    
    return {
      latitude: data[0].lat,
      longitude: data[0].lon,
      name: data[0].name,
      country: data[0].country,
      state: data[0].state || "",
      timezone: "auto" // OpenWeather API handles timezone conversion
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

// We already have these helper functions defined above

// Function to get user's current location using the browser's Geolocation API
export const getCurrentLocation = (): Promise<{ lat: number, lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        reject(error);
      },
      { timeout: 10000 }
    );
  });
};

// Function to fetch weather data by location name or coordinates
export const fetchWeatherData = async (cityOrCoords: string | { lat: number, lon: number }) => {
  try {
    let latitude: number;
    let longitude: number;
    let locationName: string;
    let country: string;
    
    // If cityOrCoords is a string, get coordinates via geocoding
    if (typeof cityOrCoords === 'string') {
      const geocode = await getGeocode(cityOrCoords);
      latitude = geocode.latitude;
      longitude = geocode.longitude;
      locationName = geocode.name;
      country = geocode.country;
    } else {
      // Use provided coordinates directly
      latitude = cityOrCoords.lat;
      longitude = cityOrCoords.lon;
      
      // Reverse geocoding to get location name
      try {
        const response = await fetch(
          `${GEOCODING_API_URL}/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${OPENWEATHER_API_KEY}`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          locationName = data[0].name;
          country = data[0].country;
        } else {
          locationName = "Unknown Location";
          country = "";
        }
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        locationName = "Current Location";
        country = "";
      }
    }
    
    // Fetch current weather data
    const currentWeatherUrl = `${API_URL}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const currentWeatherResponse = await fetch(currentWeatherUrl);
    
    if (!currentWeatherResponse.ok) {
      throw new Error('Failed to fetch current weather data');
    }
    
    const currentWeatherData = await currentWeatherResponse.json();
    
    // Fetch 5-day forecast data
    const forecastUrl = `${API_URL}/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch forecast data');
    }
    
    const forecastData = await forecastResponse.json();
    
    // Process current weather data
    const isDay = isDaytime(
      currentWeatherData.dt,
      currentWeatherData.sys.sunrise,
      currentWeatherData.sys.sunset
    );
    
    const weatherCondition = getWeatherCondition(currentWeatherData.weather[0].id, isDay);
    
    // Get daily forecasts
    const dailyForecasts: any[] = [];
    const forecastMap = new Map<string, any[]>();
    
    // Group forecast items by day
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      
      if (!forecastMap.has(date)) {
        forecastMap.set(date, []);
      }
      
      forecastMap.get(date)?.push(item);
    });
    
    // Process each day's forecast
    forecastMap.forEach((items, date) => {
      if (dailyForecasts.length < 3) { // Limit to 3 days for now
        // Find min/max temps for the day
        let minTemp = Infinity;
        let maxTemp = -Infinity;
        let totalTemp = 0;
        let rainProbability = 0;
        let sunrise = 0;
        let sunset = 0;
        let uvIndex = 0;
        
        // Hourly data for the day
        const hourlyData = items.map((item: any) => {
          const hour = new Date(item.dt * 1000).getHours();
          const isItemDay = isDaytime(
            item.dt,
            currentWeatherData.sys.sunrise,
            currentWeatherData.sys.sunset
          );
          const condition = getWeatherCondition(item.weather[0].id, isItemDay);
          
          // Update min/max temps
          if (item.main.temp < minTemp) minTemp = item.main.temp;
          if (item.main.temp > maxTemp) maxTemp = item.main.temp;
          totalTemp += item.main.temp;
          
          // Update rain probability
          if (item.pop > rainProbability) rainProbability = item.pop;
          
          return {
            time: new Date(item.dt * 1000).toISOString(),
            temp_c: Math.round(item.main.temp),
            temp_f: Math.round((item.main.temp * 9/5) + 32),
            wind_kph: Math.round(item.wind.speed * 3.6),
            wind_mph: Math.round(item.wind.speed * 2.237),
            wind_dir: getWindDirection(item.wind.deg),
            humidity: item.main.humidity,
            feelslike_c: Math.round(item.main.feels_like),
            feelslike_f: Math.round((item.main.feels_like * 9/5) + 32),
            condition,
            chance_of_rain: Math.round(item.pop * 100) // Convert from 0-1 to percentage
          };
        });
        
        // Use current day's sunrise/sunset for all days as a fallback
        sunrise = currentWeatherData.sys.sunrise;
        sunset = currentWeatherData.sys.sunset;
        
        // Get average UV Index (default to moderate if not available)
        uvIndex = 5;
        
        // Get the main weather condition for the day (use noon if available)
        const noonItem = items.find((item: any) => 
          new Date(item.dt * 1000).getHours() >= 12 && 
          new Date(item.dt * 1000).getHours() <= 14
        ) || items[0];
        
        const dayCondition = getWeatherCondition(
          noonItem.weather[0].id, 
          true // Always use day icons for day summary
        );
        
        // Add to daily forecasts
        dailyForecasts.push({
          date,
          day: {
            maxtemp_c: Math.round(maxTemp),
            maxtemp_f: Math.round((maxTemp * 9/5) + 32),
            mintemp_c: Math.round(minTemp),
            mintemp_f: Math.round((minTemp * 9/5) + 32),
            avgtemp_c: Math.round(totalTemp / items.length),
            avgtemp_f: Math.round((totalTemp / items.length * 9/5) + 32),
            condition: dayCondition,
            uv: uvIndex,
            daily_chance_of_rain: Math.round(rainProbability * 100),
            totalprecip_mm: 0, // Will be calculated from hourly data if needed
            maxwind_kph: Math.max(...items.map((item: any) => item.wind.speed * 3.6)),
            avghumidity: Math.round(items.reduce((sum: number, item: any) => sum + item.main.humidity, 0) / items.length)
          },
          astro: {
            sunrise: new Date(sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sunset: new Date(sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            moonrise: "Not available", // Not available from OpenWeather
            moonset: "Not available", // Not available from OpenWeather
            moon_phase: "Not available", // Not available from OpenWeather
            moon_illumination: "Not available" // Not available from OpenWeather
          },
          hour: hourlyData
        });
      }
    });
    
    // Ensure we have at least today's forecast
    if (dailyForecasts.length === 0) {
      const today = new Date().toISOString().split('T')[0];
      
      dailyForecasts.push({
        date: today,
        day: {
          maxtemp_c: Math.round(currentWeatherData.main.temp_max),
          maxtemp_f: Math.round((currentWeatherData.main.temp_max * 9/5) + 32),
          mintemp_c: Math.round(currentWeatherData.main.temp_min),
          mintemp_f: Math.round((currentWeatherData.main.temp_min * 9/5) + 32),
          avgtemp_c: Math.round(currentWeatherData.main.temp),
          avgtemp_f: Math.round((currentWeatherData.main.temp * 9/5) + 32),
          condition: weatherCondition,
          uv: 5, // Default moderate UV if not available
          daily_chance_of_rain: 0, // Default if not available
          totalprecip_mm: 0, // Default if not available
          maxwind_kph: Math.round(currentWeatherData.wind.speed * 3.6),
          avghumidity: currentWeatherData.main.humidity
        },
        astro: {
          sunrise: new Date(currentWeatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sunset: new Date(currentWeatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          moonrise: "Not available", // Not available from OpenWeather
          moonset: "Not available", // Not available from OpenWeather
          moon_phase: "Not available", // Not available from OpenWeather
          moon_illumination: "Not available" // Not available from OpenWeather
        },
        hour: [] // No hourly data for this fallback
      });
    }
    
    // Return formatted weather data compatible with our app
    return {
      location: {
        name: locationName,
        region: '',
        country: country,
        lat: latitude,
        lon: longitude,
        tz_id: Intl.DateTimeFormat().resolvedOptions().timeZone,
        localtime: new Date().toISOString(),
      },
      current: {
        last_updated: new Date(currentWeatherData.dt * 1000).toISOString(),
        temp_c: Math.round(currentWeatherData.main.temp),
        temp_f: Math.round((currentWeatherData.main.temp * 9/5) + 32),
        is_day: isDay ? 1 : 0,
        condition: weatherCondition,
        wind_mph: Math.round(currentWeatherData.wind.speed * 2.237),
        wind_kph: Math.round(currentWeatherData.wind.speed * 3.6),
        wind_degree: currentWeatherData.wind.deg,
        wind_dir: getWindDirection(currentWeatherData.wind.deg),
        pressure_mb: currentWeatherData.main.pressure,
        pressure_in: Math.round(currentWeatherData.main.pressure * 0.02953 * 100) / 100,
        precip_mm: currentWeatherData.rain ? currentWeatherData.rain['1h'] || 0 : 0,
        precip_in: currentWeatherData.rain ? Math.round((currentWeatherData.rain['1h'] || 0) * 0.0393701 * 100) / 100 : 0,
        humidity: currentWeatherData.main.humidity,
        cloud: currentWeatherData.clouds ? currentWeatherData.clouds.all : 0,
        feelslike_c: Math.round(currentWeatherData.main.feels_like),
        feelslike_f: Math.round((currentWeatherData.main.feels_like * 9/5) + 32),
        vis_km: currentWeatherData.visibility / 1000,
        vis_miles: Math.round(currentWeatherData.visibility / 1609.34 * 10) / 10,
        uv: 5, // Default value, OpenWeather doesn't provide UV index in the free tier
        gust_mph: currentWeatherData.wind.gust ? Math.round(currentWeatherData.wind.gust * 2.237) : undefined,
        gust_kph: currentWeatherData.wind.gust ? Math.round(currentWeatherData.wind.gust * 3.6) : undefined,
      },
      forecast: {
        forecastday: dailyForecasts
      }
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
