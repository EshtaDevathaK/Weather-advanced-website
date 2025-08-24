import { FC } from "react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getWeatherIcon } from "@/lib/weatherIcons";

interface HourlyForecastProps {
  weather: any;
}

const HourlyForecast: FC<HourlyForecastProps> = ({ weather }) => {
  const [activeTab, setActiveTab] = useState<"today" | "week">("today");
  
  // Extract hourly forecast data
  const getHourlyData = () => {
    try {
      if (!weather?.forecast?.forecastday?.[0]?.hour) {
        return [];
      }

      return weather.forecast.forecastday[0].hour.map((hourData: any, hour: number) => {
        // Get temperature with fallback
        let temp = 0;
        if (hourData) {
          temp = hourData.temp_c !== undefined ? hourData.temp_c : 
                 hourData.temp !== undefined ? hourData.temp : 0;
        }
        
        // Check if this is the current hour
        const now = new Date();
        const currentHour = now.getHours();
        const isCurrentHour = hour === currentHour;
        
        return {
          time: hour === 0 ? "12 am" : hour === 12 ? "12 pm" : hour < 12 ? `${hour} am` : `${hour - 12} pm`,
          temp: Math.round(temp),
          isCurrentHour,
          condition: hourData?.condition?.text || "Clear",
          feelsLike: hourData?.feelslike_c || temp
        };
      });
    } catch (error) {
      console.error('Error processing hourly data:', error);
      return [];
    }
  };
  
  const hourlyData = getHourlyData();
  
  // Calculate the min and max temperature for scaling
  const tempValues = hourlyData.map((h: any) => h.temp);
  const minTemp = Math.min(...tempValues);
  const maxTemp = Math.max(...tempValues);
  const tempRange = maxTemp - minTemp;
  
  // Calculate y-position based on temperature
  const getYPosition = (temp: number) => {
    // Scale to 120px height (considering 30px as padding from top)
    // Reversed since SVG coordinates have y=0 at the top
    const heightScale = 90; // Max height in pixels
    const normalizedValue = tempRange > 0 ? (temp - minTemp) / tempRange : 0.5;
    return 120 - (normalizedValue * heightScale + 30);
  };
  
  // Generate SVG path for temperature curve
  const generatePath = () => {
    return hourlyData.map((hour: any, index: number) => {
      const x = 50 + index * 100; // 100px spacing between points
      const y = getYPosition(hour.temp);
      return `${index === 0 ? "M" : "L"} ${x},${y}`;
    }).join(" ");
  };
  
  return (
    <section className="glass rounded-xl shadow-elevation p-4 md:p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Hourly Forecast</h2>
        <div className="text-2xl">⏰</div>
      </div>

      <div className="space-y-4">
        {hourlyData.map((hour: any, index: number) => (
          <div 
            key={index}
            className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
              hour.isCurrentHour 
                ? "glass-dark border border-blue-500/30 shadow-glow" 
                : "glass-dark hover:shadow-soft"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="text-center min-w-[60px]">
                <div className="text-sm font-medium text-white">{hour.time}</div>
                <div className="text-xs text-slate-400">{hour.period}</div>
              </div>
              
              <div className="text-2xl">
                {getWeatherIcon(hour.condition)}
              </div>
              
              <div>
                <div className="text-sm text-slate-400">{hour.condition}</div>
                {hour.isCurrentHour && (
                  <div className="text-xs text-blue-400 font-medium">Current</div>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                {Math.round(hour.temp)}°C
              </div>
              <div className="text-sm text-slate-400">
                Feels like {Math.round(hour.feelsLike)}°C
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Time Legend */}
      <div className="grid grid-cols-7 gap-0 text-center text-sm text-slate-400 mt-4">
        <div>00:00</div>
        <div>04:00</div>
        <div>08:00</div>
        <div>12:00</div>
        <div>16:00</div>
        <div>20:00</div>
        <div>24:00</div>
      </div>
    </section>
  );
};

export default HourlyForecast;
