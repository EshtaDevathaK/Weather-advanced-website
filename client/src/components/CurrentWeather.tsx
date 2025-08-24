import { FC, useMemo, useState, useEffect } from "react";
import { MapPin, Plus, RefreshCcw, Thermometer, Droplets, Wind } from "lucide-react";
import { getWeatherIcon } from "@/lib/weatherIcons";
import { formatDate } from "@/lib/weatherUtils";
import { getWeatherPhoto } from "@/lib/seasonalPhotos";
import { cn } from "@/lib/utils";

interface CurrentWeatherProps {
  weather: any;
}

const CurrentWeather: FC<CurrentWeatherProps> = ({ weather }) => {
  // Handle API data structure variations and check for valid data
  if (!weather || !weather.current || !weather.location) {
    console.error("CurrentWeather: Invalid weather data structure:", weather);
    return (
      <div className="glass rounded-2xl p-6 shadow-elevation text-center">
        <p className="text-lg font-semibold text-red-400">Weather data unavailable</p>
        <p className="text-white/70 mt-2">Please try refreshing or search for another location</p>
      </div>
    );
  }
  
  const currentWeather = weather.current;
  const location = weather.location;
  
  // Extract weather condition text with fallbacks for different API structures
  let weatherCondition = "Unknown";
  if (currentWeather.condition && currentWeather.condition.text) {
    weatherCondition = currentWeather.condition.text;
  } else if (currentWeather.weather && currentWeather.weather[0] && currentWeather.weather[0].main) {
    weatherCondition = currentWeather.weather[0].main;
  } else if (currentWeather.weather && currentWeather.weather[0] && currentWeather.weather[0].description) {
    weatherCondition = currentWeather.weather[0].description;
  }
  
  // Extract temperature with fallbacks for different API structures
  let temperature = 0;
  if (currentWeather.temp_c !== undefined) {
    temperature = Math.round(currentWeather.temp_c);
  } else if (currentWeather.temp !== undefined) {
    temperature = Math.round(currentWeather.temp);
  } else if (currentWeather.main && currentWeather.main.temp !== undefined) {
    temperature = Math.round(currentWeather.main.temp);
  }
  
  // Handle date with fallbacks
  let localTimeString = location.localtime;
  
  // If localtime is not available, try to get it from other properties
  if (!localTimeString) {
    if (location.dt) {
      // Convert UNIX timestamp to ISO string if available
      localTimeString = new Date(location.dt * 1000).toISOString();
    } else {
      // Use current date as last resort
      localTimeString = new Date().toISOString();
    }
  }
  
  const formattedDate = formatDate(localTimeString);
  
  // Generate mood suggestion based on weather condition
  const getMoodSuggestion = () => {
    const condition = weatherCondition.toLowerCase();
    
    if (condition.includes("sunny") || condition.includes("clear")) {
      return {
        emoji: "☀️🌿",
        title: "Sunny Vibes",
        message: "Perfect for outdoor activities and soaking up the sunshine!",
        gradient: "bg-gradient-warning"
      };
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
      return {
        emoji: "🌧️📚",
        title: "Rainy Day Mood",
        message: "Ideal for curling up with a good book and hot tea!",
        gradient: "bg-gradient-success"
      };
    } else if (condition.includes("cloud") || condition.includes("overcast")) {
      return {
        emoji: "🌤️📚",
        title: "Partly Cloudy Vibes",
        message: "Perfect for a peaceful walk in the park or enjoying a good book outdoors!",
        gradient: "bg-gradient-secondary"
      };
    } else if (condition.includes("snow") || condition.includes("blizzard")) {
      return {
        emoji: "❄️🧣",
        title: "Snow Day Feels",
        message: "Time to stay cozy indoors or build a snowman!",
        gradient: "bg-gradient-primary"
      };
    } else if (condition.includes("fog") || condition.includes("mist")) {
      return {
        emoji: "🌫️🍵",
        title: "Misty Moments",
        message: "A great day for reflection and mindfulness!",
        gradient: "bg-gradient-secondary"
      };
    } else {
      return {
        emoji: "🌈✨",
        title: "Weather Adventure",
        message: "Embrace the day whatever the weather brings!",
        gradient: "bg-gradient-warning"
      };
    }
  };
  
  const moodSuggestion = getMoodSuggestion();
  
  // Get background image based on weather condition and temperature
  const weatherPhoto = useMemo(() => {
    const condition = weatherCondition.toLowerCase();
    
    // Use the improved getWeatherPhoto function from seasonalPhotos.ts
    // This will randomize and select appropriate photos based on both condition and temperature
    return getWeatherPhoto(condition, temperature);
  }, [weatherCondition, temperature]);
  
  // State to handle manual image refresh
  const [currentPhoto, setCurrentPhoto] = useState(weatherPhoto);
  const [isChanging, setIsChanging] = useState(false);
  
  // Update current photo when weather photo changes (from props)
  useEffect(() => {
    setCurrentPhoto(weatherPhoto);
  }, [weatherPhoto]);
  
  // Handle manual image refresh on click
  const refreshImage = () => {
    setIsChanging(true);
    setTimeout(() => {
      const newPhoto = getWeatherPhoto(weatherCondition.toLowerCase(), temperature);
      setCurrentPhoto(newPhoto);
      setIsChanging(false);
    }, 300); // Wait for fade-out animation to complete
  };
  
  // Format the URL with optimization parameters
  const backgroundImage = `${currentPhoto.url}?w=800&auto=format&fit=crop&q=80`;
  
  return (
    <div className="glass rounded-2xl shadow-elevation overflow-hidden hover-lift">
      <div className="p-6">
        {/* Location Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h6 className="text-sm text-white/60 mb-2 font-medium">📍 Current Location</h6>
            <h3 className="text-2xl font-bold text-white flex items-center">
              {location.name || "Unknown"}
              {location.region ? `, ${location.region}` : ""}
              {location.country ? `, ${location.country}` : ""}
              <button className="ml-3 text-white/70 hover:text-yellow-300 transition-colors">
                <MapPin className="h-5 w-5" />
              </button>
            </h3>
          </div>
          
          {/* Date and Time */}
          <div className="text-right">
            <p className="text-white/80 text-sm">{formattedDate}</p>
            <p className="text-white/60 text-xs">Last updated</p>
          </div>
        </div>
        
        <div className="relative">
          {/* Weather Background Image with Seasonal Gradient Overlay */}
          <div 
            className="relative rounded-xl overflow-hidden h-72 md:h-80 cursor-pointer hover-glow" 
            onClick={refreshImage}
            title="Click to see more photos for this weather"
          >
            {/* Image with transition effect */}
            <div className="absolute inset-0 transition-opacity duration-300 ease-in-out">
              <img 
                src={backgroundImage} 
                alt={`${location.name || 'Location'} ${weatherCondition} Weather`} 
                className={cn(
                  "w-full h-full object-cover transition-opacity duration-300", 
                  isChanging ? "opacity-0" : "opacity-100"
                )}
              />
            </div>
            
            {/* Seasonal gradient overlay with transition */}
            {currentPhoto.gradientOverlay && (
              <div 
                className={cn(
                  "absolute inset-0 pointer-events-none transition-opacity duration-300", 
                  isChanging ? "opacity-0" : "opacity-100"
                )}
                style={{ 
                  background: currentPhoto.gradientOverlay,
                  mixBlendMode: 'overlay'
                }}
                aria-hidden="true"
              />
            )}
            
            {/* Refresh indicator */}
            <div className="absolute top-4 left-4 glass-dark text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover-lift transition-all">
              <RefreshCcw className="h-4 w-4" />
              <span>Change Photo</span>
            </div>
            
            {/* Season indicator */}
            {currentPhoto.season && (
              <div className="absolute top-4 right-4 glass-dark text-white px-3 py-1 rounded-full text-xs font-medium">
                {currentPhoto.season}
              </div>
            )}
            
            {/* Weather Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 glass-dark p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Weather Icon */}
                  <div className="weather-icon text-4xl">
                    {getWeatherIcon(weatherCondition)}
                  </div>
                  
                  {/* Temperature */}
                  <div>
                    <div className="text-4xl font-bold text-white">
                      {temperature}°C
                    </div>
                    <div className="text-white/80 text-sm">
                      {weatherCondition}
                    </div>
                  </div>
                </div>
                
                {/* Weather Details */}
                <div className="text-right space-y-1">
                  <div className="flex items-center space-x-2 text-white/80 text-sm">
                    <Thermometer className="h-4 w-4" />
                    <span>Feels like {Math.round(currentWeather.feelslike_c || temperature)}°C</span>
                  </div>
                  {currentWeather.humidity && (
                    <div className="flex items-center space-x-2 text-white/80 text-sm">
                      <Droplets className="h-4 w-4" />
                      <span>{currentWeather.humidity}% humidity</span>
                    </div>
                  )}
                  {currentWeather.wind_kph && (
                    <div className="flex items-center space-x-2 text-white/80 text-sm">
                      <Wind className="h-4 w-4" />
                      <span>{currentWeather.wind_kph} km/h</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mood Suggestion Card */}
        <div className={`mt-6 ${moodSuggestion.gradient} rounded-xl p-6 text-white shadow-elevation`}>
          <div className="flex items-start space-x-4">
            <div className="text-3xl weather-icon">
              {moodSuggestion.emoji}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-bold mb-2">{moodSuggestion.title}</h4>
              <p className="text-white/90 leading-relaxed">{moodSuggestion.message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
