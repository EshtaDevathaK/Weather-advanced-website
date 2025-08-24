import { FC } from "react";
import { Droplets, Waves, Wind, Sun, Moon } from "lucide-react";

interface TodaysHighlightsProps {
  weather: any;
}

const TodaysHighlights: FC<TodaysHighlightsProps> = ({ weather }) => {
  const current = weather.current;
  const forecast = weather.forecast.forecastday[0].astro;
  
  // Use provided probability of precipitation if available; otherwise N/A
  const getPrecipitationPercentage = () => {
    try {
      // Try current hour PoP if available via forecast hour list
      const todayForecast = weather.forecast?.forecastday?.[0];
      const now = new Date();
      
      // Find the current hour data
      const hourEntry = todayForecast?.hour?.find((h: any) => {
        if (!h.time) return false;
        const t = new Date(h.time);
        return t.getHours() === now.getHours();
      });
      
      // Try multiple precipitation chance properties
      if (hourEntry) {
        if (typeof hourEntry.chance_of_rain === 'number') {
          return hourEntry.chance_of_rain;
        }
        if (typeof hourEntry.chance_of_precip === 'number') {
          return hourEntry.chance_of_precip;
        }
        if (typeof hourEntry.pop === 'number') {
          return Math.round(hourEntry.pop * 100);
        }
      }
      
      // Fallback to daily chance
      if (todayForecast?.day && typeof todayForecast.day.daily_chance_of_rain === 'number') {
        return todayForecast.day.daily_chance_of_rain;
      }
      
      return null; // N/A
    } catch (error) {
      console.error('Error getting precipitation percentage:', error);
      return null;
    }
  };
  
  // Get precipitation intensity description
  const getPrecipitationIntensity = (precip_mm: number) => {
    if (precip_mm < 0.5) return "Very Low";
    if (precip_mm < 2) return "Low";
    if (precip_mm < 4) return "Moderate";
    return "High";
  };
  
  // Get humidity description
  const getHumidityDescription = (humidity: number) => {
    if (humidity < 30) return "Low";
    if (humidity < 60) return "Moderate";
    return "High";
  };
  
  // Get wind description
  const getWindDescription = (wind_kph: number) => {
    if (wind_kph < 1) return "Calm";
    if (wind_kph < 20) return "Light";
    if (wind_kph < 40) return "Moderate";
    return "Strong";
  };
  
  const precipitation = getPrecipitationPercentage();
  
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-semibold text-navy">Today's Highlights</h2>
        <div className="flex items-center space-x-2 text-xs text-green-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Real-time</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Precipitation */}
          <div className="glass rounded-xl shadow-elevation p-4 text-center transition-transform hover:translate-y-[-5px] hover:shadow-card duration-300">
            <div className="text-2xl mb-2">💧</div>
            <h3 className="text-sm text-slate-300 font-medium mb-3">Precipitation</h3>
            <div className="text-2xl font-bold text-white mb-1">{weather.current.precip_mm}mm</div>
            <div className="inline-flex items-center text-xs text-slate-400">
              <Droplets className="h-3 w-3 mr-1" />
              Last 24h
            </div>
          </div>

          {/* Humidity */}
          <div className="glass rounded-xl shadow-elevation p-4 text-center transition-transform hover:translate-y-[-5px] hover:shadow-card duration-300">
            <div className="text-2xl mb-2">🌫️</div>
            <h3 className="text-sm text-slate-300 font-medium mb-3">Humidity</h3>
            <div className="text-2xl font-bold text-white mb-1">{weather.current.humidity}%</div>
            <div className="inline-flex items-center text-xs text-slate-400">
              <Droplets className="h-3 w-3 mr-1" />
              Current
            </div>
          </div>

          {/* Wind */}
          <div className="glass rounded-xl shadow-elevation p-4 text-center transition-transform hover:translate-y-[-5px] hover:shadow-card duration-300">
            <div className="text-2xl mb-2">💨</div>
            <h3 className="text-sm text-slate-300 font-medium mb-3">Wind</h3>
            <div className="text-2xl font-bold text-white mb-1">{weather.current.wind_kph} km/h</div>
            <div className="inline-flex items-center text-xs text-slate-400">
              <Wind className="h-3 w-3 mr-1 text-slate-400" />
              {weather.current.wind_dir}
            </div>
          </div>

          {/* Sunrise & Sunset */}
          <div className="glass rounded-xl shadow-elevation p-4 text-center transition-transform hover:translate-y-[-5px] hover:shadow-card duration-300">
            <div className="text-2xl mb-2">🌅</div>
            <h3 className="text-sm text-slate-300 font-medium mb-3">Sunrise & Sunset</h3>
            <div className="text-sm text-white mb-1">
              <Sun className="h-3 w-3 inline mr-1 text-yellow-400" />
              {weather.forecast.forecastday[0].astro.sunrise}
            </div>
            <div className="text-sm text-white">
              <Moon className="h-3 w-3 inline mr-1 text-slate-400" />
              {weather.forecast.forecastday[0].astro.sunset}
            </div>
          </div>
        </div>
    </section>
  );
};

export default TodaysHighlights;
