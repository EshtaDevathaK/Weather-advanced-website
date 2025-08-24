import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MultiDayForecast from "@/components/MultiDayForecast";
import HourlyForecast from "@/components/HourlyForecast";
import ChanceOfRain from "@/components/ChanceOfRain";
import { fetchWeatherData, getCurrentLocation } from "@/lib/weatherService2";
import { Cloud } from "lucide-react";
import OutfitOfTheDay from "@/components/OutfitOfTheDay";
import { useToast } from "@/hooks/use-toast";

export default function Forecast() {
  const [searchLocation, setSearchLocation] = useState<string | { lat: number; lon: number }>("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
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
          description: "Showing forecast for your current location",
        });
      } catch (error) {
        console.error('Failed to detect location:', error);
        // Fallback to default location
        setSearchLocation("Los Angeles");
        toast({
          title: "⚠️ Location detection failed",
          description: "Showing forecast for Los Angeles. You can search for your location manually.",
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
    queryFn: () => fetchWeatherData(searchLocation),
    enabled: !!searchLocation && !isDetectingLocation,
  });

  const handleSearch = (location: string) => {
    setSearchLocation(location);
    setTimeout(() => refetch(), 100);
  };

  if (isDetectingLocation) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Header onSearch={handleSearch} />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="text-6xl">📍</div>
              <h2 className="text-2xl font-bold text-white">Detecting Your Location</h2>
              <p className="text-white/80">Please allow location access to see forecast for your area...</p>
              <div className="loading-spinner mx-auto"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header Section */}
        <Header onSearch={handleSearch} />

        <h1 className="text-2xl font-bold mb-6 font-heading flex items-center text-white">
          <Cloud className="mr-2 h-6 w-6" />
          Detailed Forecast for {weatherData?.location.name || 'Your Location'}
        </h1>

        {isLoading ? (
          <div className="space-y-6">
            <div className="glass rounded-xl shadow-elevation p-6 mb-8">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-slate-600 rounded w-1/4"></div>
                <div className="h-4 bg-slate-600 rounded w-1/2"></div>
                <div className="h-4 bg-slate-600 rounded w-3/4"></div>
              </div>
            </div>
            <div className="glass rounded-xl shadow-elevation p-6 mb-8">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-slate-600 rounded w-1/3"></div>
                <div className="h-4 bg-slate-600 rounded w-1/2"></div>
                <div className="h-4 bg-slate-600 rounded w-2/3"></div>
              </div>
            </div>
            <div className="glass rounded-xl shadow-elevation p-6 mb-8">
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-slate-600 rounded w-1/2"></div>
                <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                <div className="h-4 bg-slate-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="glass rounded-xl shadow-elevation p-8 text-center">
            <div className="text-6xl mb-4">🌧️</div>
            <h2 className="text-xl font-semibold text-white mb-2">Unable to load forecast</h2>
            <p className="text-slate-400 mt-2">Please try again later</p>
          </div>
        ) : weatherData ? (
          <div className="space-y-6">
            {/* Hourly Forecast */}
            <HourlyForecast weather={weatherData} />
            
            {/* Multi-day Forecast */}
            <MultiDayForecast weather={weatherData} />
            
            {/* Additional Weather Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChanceOfRain weather={weatherData} />
              <OutfitOfTheDay weather={weatherData} />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}