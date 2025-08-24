import { FC } from "react";
import { getWeatherIcon } from "@/lib/weatherIcons";
import { ArrowUp, ArrowDown } from "lucide-react";

interface MultiDayForecastProps {
  weather: any;
}

const MultiDayForecast: FC<MultiDayForecastProps> = ({ weather }) => {
  const forecastDays = weather.forecast.forecastday;
  
  // Get day name from date
  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };
  
  return (
    <div className="glass rounded-xl shadow-elevation p-4 md:p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">3 Days Forecast</h3>
        <div className="text-2xl">📅</div>
      </div>

      <div className="space-y-4">
        {forecastDays.map((day: any, index: number) => (
          <div 
            key={index}
            className="glass-dark rounded-lg p-4 transition-all duration-300 hover:shadow-glow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {getWeatherIcon(day.day.condition.text)}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{day.date}</h4>
                  <p className="text-sm text-slate-400">{day.day.condition.text}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  {Math.round(day.day.maxtemp_c)}°C
                </div>
                <div className="text-sm text-slate-400">
                  {Math.round(day.day.mintemp_c)}°C
                </div>
              </div>
            </div>
            
            {/* Additional weather details */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-600">
              <div className="text-center">
                <div className="text-xs text-slate-400 mb-1">Rain</div>
                <div className="text-sm font-medium text-white">{day.day.daily_chance_of_rain}%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400 mb-1">Humidity</div>
                <div className="text-sm font-medium text-white">{day.day.avghumidity}%</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-slate-400 mb-1">UV</div>
                <div className="text-sm font-medium text-white">{day.day.uv}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiDayForecast;
