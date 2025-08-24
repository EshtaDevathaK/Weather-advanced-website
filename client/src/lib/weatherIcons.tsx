import { 
  Sun, 
  Cloud, 
  CloudSun, 
  CloudRain, 
  CloudDrizzle, 
  CloudSnow, 
  CloudFog, 
  CloudLightning, 
  Wind 
} from "lucide-react";

// Helper function to get appropriate icon based on weather condition text
export const getWeatherIcon = (condition: string, className?: string) => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes("sunny") || conditionLower.includes("clear")) {
    return className ? <Sun className={className} /> : "☀️";
  } else if (conditionLower.includes("partly cloudy")) {
    return className ? <CloudSun className={className} /> : "🌤️";
  } else if (conditionLower.includes("cloudy") || conditionLower.includes("overcast")) {
    return className ? <Cloud className={className} /> : "☁️";
  } else if (conditionLower.includes("mist") || conditionLower.includes("fog")) {
    return className ? <CloudFog className={className} /> : "🌫️";
  } else if (conditionLower.includes("drizzle")) {
    return className ? <CloudDrizzle className={className} /> : "🌦️";
  } else if (conditionLower.includes("thunderstorm") || conditionLower.includes("thunder")) {
    return className ? <CloudLightning className={className} /> : "⛈️";
  } else if (conditionLower.includes("snow") || conditionLower.includes("blizzard") || conditionLower.includes("ice")) {
    return className ? <CloudSnow className={className} /> : "❄️";
  } else if (conditionLower.includes("rain") || conditionLower.includes("shower")) {
    return className ? <CloudRain className={className} /> : "🌧️";
  } else if (conditionLower.includes("wind")) {
    return className ? <Wind className={className} /> : "💨";
  } else {
    // Default fallback
    return className ? <Cloud className={className} /> : "🌈";
  }
};
