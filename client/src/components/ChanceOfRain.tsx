import { FC, useEffect, useState } from "react";
import { MoreHorizontal, CloudRain, Sun, CloudLightning, Droplets } from "lucide-react";

interface ChanceOfRainProps {
  weather: any;
}

interface RainTimeSlot {
  time: string;
  chance: number;
  intensity: "none" | "low" | "medium" | "high";
  precipitation: number;
  isRealtime: boolean;
}

const ChanceOfRain: FC<ChanceOfRainProps> = ({ weather }) => {
  const [rainData, setRainData] = useState<RainTimeSlot[]>([]);
  
  useEffect(() => {
    if (weather && weather.forecast && weather.forecast.forecastday) {
      setRainData(generateRainChanceData());
    }
  }, [weather]);
  
  // Generate rain chance data from forecast with better real-time data handling
  const generateRainChanceData = (): RainTimeSlot[] => {
    try {
      const today = weather.forecast.forecastday[0];
      const hours = today.hour;
      const currentHour = new Date().getHours();
      
      // Get a subset of hours for display - prioritize upcoming hours
      const timeSlots = [
        { label: "09 am", hour: 9 },
        { label: "12 pm", hour: 12 },
        { label: "03 pm", hour: 15 },
        { label: "06 pm", hour: 18 },
        { label: "09 pm", hour: 21 },
        { label: "12 am", hour: 0 },
        { label: "03 am", hour: 3 }
      ];

      // Sort the slots to prioritize upcoming hours
      const sortedTimeSlots = [...timeSlots].sort((a, b) => {
        const hourDiffA = (a.hour - currentHour + 24) % 24;
        const hourDiffB = (b.hour - currentHour + 24) % 24;
        return hourDiffA - hourDiffB;
      });
      
      return sortedTimeSlots.map(slot => {
        // Find the forecast hour data
        const hourData = hours.find((h: any) => {
          const date = new Date(h.time);
          return date.getHours() === slot.hour;
        });
        
        // Different APIs use different property names - handle both formats
        let chance = 0;
        let precip = 0;
        
        if (hourData) {
          // Handle WeatherAPI.com format
          if (hourData.chance_of_rain !== undefined) {
            chance = hourData.chance_of_rain;
          } 
          // Handle OpenWeatherMap format 
          else if (hourData.pop !== undefined) {
            chance = Math.round(hourData.pop * 100);
          }
          
          // Get precipitation amount (in mm)
          if (hourData.precip_mm !== undefined) {
            precip = hourData.precip_mm;
          } else if (hourData.rain !== undefined && typeof hourData.rain === 'number') {
            precip = hourData.rain;
          } else if (hourData.rain && hourData.rain['3h'] !== undefined) {
            precip = hourData.rain['3h'];
          }
        }
        
        // If chance is very low but precipitation exists, adjust chance
        if (chance < 10 && precip > 0.2) {
          chance = Math.max(chance, 15);
        }
        
        // Determine intensity based on combination of chance and precipitation
        let intensity: "none" | "low" | "medium" | "high" = "none";
        
        if (chance > 0) {
          if (chance <= 20) {
            intensity = "none";
          } else if (chance <= 40) {
            intensity = "low";
          } else if (chance <= 70) {
            intensity = "medium";
          } else {
            intensity = "high";
          }
          
          // Adjust further based on precipitation amount
          if (precip > 5 && intensity !== "high") {
            intensity = "high";
          } else if (precip > 2 && intensity === "low") {
            intensity = "medium";
          }
        }
        
        // Is this the current hour? (or within 1 hour)
        const isRealtime = Math.abs((slot.hour - currentHour + 24) % 24) <= 1;
        
        return {
          time: slot.label,
          chance,
          intensity,
          precipitation: precip,
          isRealtime
        };
      });
    } catch (error) {
      console.error("Error generating rain chance data:", error);
      return [];
    }
  };
  
  // Get the correct CSS class and styles for the progress bar
  const getProgressBarStyles = (slot: RainTimeSlot) => {
    // Base styles
    let styles = {
      className: "",
      bgColor: "",
      width: `${Math.max(3, slot.chance)}%`,
      additionalClasses: slot.isRealtime ? "border-2 border-primary animate-pulse" : "",
      iconComponent: null as React.ReactNode
    };
    
    // Set intensity-based colors
    switch (slot.intensity) {
      case "high":
        styles.className = "bg-blue-600";
        styles.bgColor = "rgba(37, 99, 235, 0.9)";
        styles.iconComponent = <CloudLightning className="h-3 w-3 absolute right-1 top-1/2 transform -translate-y-1/2 text-white" />;
        break;
      case "medium":
        styles.className = "bg-blue-400";
        styles.bgColor = "rgba(96, 165, 250, 0.8)";
        styles.iconComponent = <CloudRain className="h-3 w-3 absolute right-1 top-1/2 transform -translate-y-1/2 text-white" />;
        break;
      case "low":
        styles.className = "bg-blue-300";
        styles.bgColor = "rgba(147, 197, 253, 0.7)";
        styles.iconComponent = <Droplets className="h-3 w-3 absolute right-1 top-1/2 transform -translate-y-1/2 text-blue-600" />;
        break;
      default:
        styles.className = "bg-yellow-100";
        styles.bgColor = "rgba(254, 240, 138, 0.5)";
        styles.iconComponent = <Sun className="h-3 w-3 absolute right-1 top-1/2 transform -translate-y-1/2 text-amber-500" />;
    }
    
    return styles;
  };
  
  return (
    <div className="glass rounded-xl shadow-elevation p-4 md:p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Chance of Rain</h3>
          <div className="text-xs text-slate-400 font-normal">Real-time forecast</div>
        </div>
        <div className="text-2xl">🌧️</div>
      </div>

      <div className="space-y-3">
        {rainData.map((slot, index) => {
          const styles = getProgressBarStyles(slot);
          
          return (
            <div key={index} className="flex items-center justify-between p-3 glass-dark rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium text-white">
                  {slot.time}
                </div>
                <div className="text-xs text-slate-400">
                  {slot.isRealtime ? 'Now' : ''}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`font-medium ${slot.chance > 0 ? 'text-blue-400' : 'text-slate-400'}`}>
                  {slot.chance}%
                </span>
                {slot.isRealtime && (
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Weather Condition Icons */}
      <div className="mt-6 p-4 glass-dark rounded-lg">
        <h4 className="text-sm font-medium text-white mb-3">Weather Conditions</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-2xl mb-1">☀️</div>
            <div className="text-slate-400 mb-1">Sunny</div>
            <div className="text-xs text-slate-500">Clear skies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🌦️</div>
            <div className="text-slate-400 mb-1">Light Rain</div>
            <div className="text-xs text-slate-500">Drizzle</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">⛈️</div>
            <div className="text-slate-400 mb-1">Heavy Rain</div>
            <div className="text-xs text-slate-500">Storm</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChanceOfRain;
