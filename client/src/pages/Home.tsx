import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CurrentWeather from "@/components/CurrentWeather";
import ChanceOfRain from "@/components/ChanceOfRain";
import TodaysHighlights from "@/components/TodaysHighlights";
import HourlyForecast from "@/components/HourlyForecast";
import MultiDayForecast from "@/components/MultiDayForecast";
import OutfitOfTheDay from "@/components/OutfitOfTheDay";
import MusicVibes from "@/components/MusicVibes";
import LocalVibeCard from "@/components/LocalVibeCard";
import { fetchWeatherData, getCurrentLocation } from "@/lib/weatherService2";
import { getBackgroundColor } from "@/lib/weatherUtils";
import { useToast } from "@/hooks/use-toast";

// Get a greeting based on current time of day
function getGreetingByTime(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Good Morning in";
  } else if (hour >= 12 && hour < 18) {
    return "Good Afternoon in";
  } else {
    return "Good Evening in";
  }
}

export default function Home() {
  const [searchLocation, setSearchLocation] = useState<string | { lat: number; lon: number }>("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
  const [apiKeyError, setApiKeyError] = useState(false);
  const { toast } = useToast();
  
  // Auto-detect user's current location on component mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        setIsDetectingLocation(true);
        
        // Add a timeout to prevent hanging
        const locationPromise = getCurrentLocation();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Location detection timed out')), 15000)
        );
        
        const coords = await Promise.race([locationPromise, timeoutPromise]);
        setSearchLocation(coords);
        toast({
          title: "📍 Location detected!",
          description: "Showing weather for your current location",
        });
      } catch (error) {
        console.error('Failed to detect location:', error);
        // Fallback to default location
        setSearchLocation("Los Angeles");
        toast({
          title: "⚠️ Location detection failed",
          description: "Showing weather for Los Angeles. You can search for your location manually or try the 'My Location' button.",
          variant: "destructive",
        });
      } finally {
        setIsDetectingLocation(false);
      }
    };

    // Add a small delay to show the loading state
    const timer = setTimeout(detectLocation, 500);
    return () => clearTimeout(timer);
  }, [toast]);

  const { data: weatherData, isLoading, error, refetch } = useQuery({
    queryKey: ['weatherData', searchLocation],
    queryFn: async () => {
      try {
        return await fetchWeatherData(searchLocation);
      } catch (err: any) {
        // Check if error is related to API key
        if (err?.message?.includes('API key')) {
          setApiKeyError(true);
        }
        throw err;
      }
    },
    enabled: !!searchLocation && !isDetectingLocation,
    retry: 1, // Only retry once on error
    refetchInterval: 30 * 60 * 1000, // 30 minutes refresh rate
    refetchOnWindowFocus: true, // Refetch when user returns to the tab
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });

  // Set dynamic background based on weather condition
  useEffect(() => {
    if (weatherData) {
      const weatherCondition = weatherData.current.condition.text.toLowerCase();
      document.body.className = getBackgroundColor(weatherCondition);
    }
  }, [weatherData]);

  // Show toast on initial load
  useEffect(() => {
    if (weatherData) {
      // Mood functionality removed
    }
  }, [weatherData]);

  const handleSearch = (location: string) => {
    setSearchLocation(location);
    // Refetch with the new location
    setTimeout(() => refetch(), 100); // Small delay to ensure state update
  };

  if (isDetectingLocation) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center space-y-6 animate-in fade-in-up">
          {/* Location Detection Icon */}
          <div className="mx-auto text-8xl text-white mb-4">
            📍
          </div>
          
          {/* Loading Spinner */}
          <div className="loading-spinner mx-auto"></div>
          
          {/* Loading Text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Detecting Your Location</h2>
            <p className="text-white/80 text-lg">Please allow location access to see weather for your area...</p>
            <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
              <p className="text-sm text-white/90">
                💡 <strong>Tip:</strong> If location detection takes too long, you can:
              </p>
              <ul className="text-xs text-white/70 mt-2 space-y-1">
                <li>• Check your browser's location permissions</li>
                <li>• Try refreshing the page</li>
                <li>• Use the search bar to find your city manually</li>
              </ul>
              <button 
                onClick={() => {
                  setSearchLocation("Los Angeles");
                  setIsDetectingLocation(false);
                  toast({
                    title: "📍 Using default location",
                    description: "Showing weather for Los Angeles. You can search for your city anytime!",
                  });
                }}
                className="mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-all duration-200 hover:scale-105"
              >
                🚀 Skip & Use Default Location
              </button>
            </div>
          </div>
          
          {/* Animated Dots */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center space-y-6 animate-in fade-in-up">
          {/* Animated Weather Icon */}
          <div className="weather-icon float mx-auto text-8xl text-white mb-4">
            🌤️
          </div>
          
          {/* Loading Spinner */}
          <div className="loading-spinner mx-auto"></div>
          
          {/* Loading Text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Loading Weather Data</h2>
            <p className="text-white/80 text-lg">Fetching the latest forecast for you...</p>
          </div>
          
          {/* Animated Dots */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-secondary flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto animate-in bounce-in">
          <div className="glass rounded-2xl p-8 shadow-elevation">
            {/* Animated Error Icon */}
            <div className="text-6xl mb-6 animate-bounce">
              ⚡
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
            
            {apiKeyError ? (
              <div className="space-y-4">
                <p className="text-white/90 text-lg">
                  We can't access the weather data right now. This might be due to an API configuration issue.
                </p>
                
                <div className="glass-dark rounded-lg p-4 text-left">
                  <p className="font-semibold text-white mb-2">🔧 Quick Fix:</p>
                  <ul className="text-white/80 space-y-1 text-sm">
                    <li>• Check your OpenWeather API key</li>
                    <li>• Verify API permissions</li>
                    <li>• Try refreshing the page</li>
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-white/90 text-lg mb-6">
                We're having trouble connecting to the weather service. Please check your internet connection.
              </p>
            )}
            
            <button 
              onClick={() => {
                setApiKeyError(false);
                refetch();
              }}
              className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover-lift hover-glow transition-all duration-300"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto md:ml-0">
        {/* Header Section */}
        <Header onSearch={handleSearch} />

        {/* Greeting Section */}
        <div className="mb-8 animate-in fade-in-up">
          <div className="glass rounded-2xl p-6 shadow-elevation">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-heading text-white">
                  {getGreetingByTime()} 
                  <span className="ml-2 text-blue-300">
                    {weatherData?.location.name 
                      ? `${weatherData.location.name}, ${weatherData.location.country}`
                      : ''}
                  </span>
                </h1>
                <p className="text-slate-300 text-lg mt-2">
                  Here's your personalized weather forecast. Stay awesome! ✨
                </p>
              </div>
              
              {/* Live Data Indicator */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-glow"></div>
                  <span className="text-slate-300 font-medium">Live Data</span>
                </div>
                <button 
                  onClick={() => refetch()}
                  className="glass-dark px-4 py-2 text-white rounded-full text-sm hover-lift hover-glow transition-all duration-300"
                >
                  🔄 Refresh
                </button>
                <button 
                  onClick={async () => {
                    try {
                      setIsDetectingLocation(true);
                      
                      // Add timeout to prevent hanging
                      const locationPromise = getCurrentLocation();
                      const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Location detection timed out')), 15000)
                      );
                      
                      const coords = await Promise.race([locationPromise, timeoutPromise]);
                      setSearchLocation(coords);
                      toast({
                        title: "📍 Location updated!",
                        description: "Showing weather for your current location",
                      });
                    } catch (error) {
                      console.error('Location detection error:', error);
                      let errorMessage = "Please check your location permissions";
                      
                      if (error instanceof Error) {
                        if (error.message.includes('timeout')) {
                          errorMessage = "Location detection timed out. Please try again.";
                        } else if (error.message.includes('denied')) {
                          errorMessage = "Location access denied. Please enable location permissions in your browser.";
                        } else if (error.message.includes('unavailable')) {
                          errorMessage = "Location service unavailable. Please try again later.";
                        }
                      }
                      
                      toast({
                        title: "⚠️ Location detection failed",
                        description: errorMessage,
                        variant: "destructive",
                      });
                    } finally {
                      setIsDetectingLocation(false);
                    }
                  }}
                  className="glass-dark px-4 py-2 text-white rounded-full text-sm hover-lift hover-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDetectingLocation}
                >
                  📍 {isDetectingLocation ? 'Detecting...' : 'My Location'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Current Weather & Chance of Rain */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 animate-in slide-in-right" style={{animationDelay: '0.1s'}}>
            {weatherData && <CurrentWeather weather={weatherData} />}
          </div>
          <div className="animate-in slide-in-right" style={{animationDelay: '0.2s'}}>
            {weatherData && <ChanceOfRain weather={weatherData} />}
          </div>
        </div>

        {/* Today's Highlights */}
        <div className="animate-in fade-in-up" style={{animationDelay: '0.3s'}}>
          {weatherData && <TodaysHighlights weather={weatherData} />}
        </div>

        {/* Hourly Forecast Chart */}
        <div className="animate-in fade-in-up" style={{animationDelay: '0.4s'}}>
          {weatherData && <HourlyForecast weather={weatherData} />}
        </div>

        {/* 3-Day Forecast & Outfit of the Day */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-8">
          <div className="lg:col-span-4 animate-in slide-in-right" style={{animationDelay: '0.5s'}}>
            {weatherData && <MultiDayForecast weather={weatherData} />}
          </div>
          <div className="lg:col-span-3 animate-in slide-in-right" style={{animationDelay: '0.6s'}}>
            {weatherData && <OutfitOfTheDay weather={weatherData} />}
          </div>
        </div>

        {/* Music Vibes & Local Vibe */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="animate-in fade-in-up" style={{animationDelay: '0.7s'}}>
            {weatherData && <MusicVibes weather={weatherData} />}
          </div>
          <div className="animate-in fade-in-up" style={{animationDelay: '0.8s'}}>
            {weatherData && <LocalVibeCard weather={weatherData} />}
          </div>
        </div>
      </main>
    </div>
  );
}
