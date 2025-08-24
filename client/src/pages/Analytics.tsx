import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { fetchWeatherData, getCurrentLocation } from "@/lib/weatherService2";
import { BarChart2, Thermometer, Droplets, Wind, Sun, CloudRain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Analytics() {
  const [searchLocation, setSearchLocation] = useState<string | { lat: number; lon: number }>("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
  const [timeRange, setTimeRange] = useState("week");
  const [activeDataType, setActiveDataType] = useState("temperature");
  const { toast } = useToast();
  
  // Define data types for analytics
  const dataTypes = [
    { value: "temperature", label: "Temperature", icon: "🌡️" },
    { value: "precipitation", label: "Precipitation", icon: "🌧️" },
    { value: "wind", label: "Wind", icon: "💨" },
    { value: "humidity", label: "Humidity", icon: "💧" }
  ];
  
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
          description: "Showing analytics for your current location",
        });
      } catch (error) {
        console.error('Failed to detect location:', error);
        // Fallback to default location
        setSearchLocation("Los Angeles");
        toast({
          title: "⚠️ Location detection failed",
          description: "Showing analytics for Los Angeles. You can search for your location manually.",
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

  // Fetch weather data with error handling
  const { data: weatherData, isLoading, error, refetch } = useQuery({
    queryKey: ['analyticsData', searchLocation],
    queryFn: () => fetchWeatherData(searchLocation),
    enabled: !!searchLocation && !isDetectingLocation,
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    staleTime: 2 * 60 * 1000, // 2 minutes - more frequent updates for analytics
    refetchInterval: 3 * 60 * 1000, // Refetch every 3 minutes for live analytics
    retry: 2,
  });

  const handleSearch = (location: string) => {
    setSearchLocation(location);
  };

  // Generate temperature data from forecast
  const getTemperatureData = () => {
    if (!weatherData) {
      return [];
    }

    try {
      // Use raw OpenWeather API format if available
      if (weatherData.raw && weatherData.raw.list && Array.isArray(weatherData.raw.list)) {
        return weatherData.raw.list.slice(0, 24).map((item: any) => {
          const time = new Date(item.dt * 1000);
          return {
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: time.toLocaleDateString([], { month: 'short', day: 'numeric' }),
            temperature: item.main.temp,
            feelsLike: item.main.feels_like
          };
        });
      }
      
      // Use the formatted forecast data
      if (weatherData.forecast && weatherData.forecast.forecastday) {
        return weatherData.forecast.forecastday.flatMap((day: any) => {
          // Handle both data structures
          if (day.hour && Array.isArray(day.hour)) {
            return day.hour.map((hour: any) => {
              // Get time from hour object
              const timeString = hour.time || (hour.dt ? new Date(hour.dt * 1000).toISOString() : null);
              const time = timeString ? new Date(timeString) : new Date();
              
              return {
                time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: time.toLocaleDateString([], { month: 'short', day: 'numeric' }),
                temperature: hour.temp_c !== undefined ? hour.temp_c : hour.temp !== undefined ? hour.temp : 0,
                feelsLike: hour.feelslike_c !== undefined ? hour.feelslike_c : 
                            hour.feels_like !== undefined ? hour.feels_like : 0,
              };
            });
          } 
          return [];
        });
      }
      
      // If we get here, log the issue and return empty data
      console.error("Analytics: Unexpected weather data format:", weatherData);
      return [];
    } catch (error) {
      console.error("Error parsing temperature data:", error);
      return [];
    }
  };

  // Generate precipitation data
  const getPrecipitationData = () => {
    if (!weatherData) {
      return [];
    }

    try {
      // Use raw OpenWeather API data if available
      if (weatherData.raw && weatherData.raw.list && Array.isArray(weatherData.raw.list)) {
        return weatherData.raw.list
          .filter((_: any, index: number) => index % 4 === 0) // Take every 4th item for better visualization
          .slice(0, 7)
          .map((item: any) => {
            const date = new Date(item.dt * 1000);
            return {
              date: date.toLocaleDateString([], { weekday: 'short' }),
              rain: item.rain ? (item.rain['3h'] || 0) : 0,
              chance: item.pop ? Math.round(item.pop * 100) : 0
            };
          });
      }
      
      // Use formatted forecast data
      if (weatherData.forecast && weatherData.forecast.forecastday) {
        return weatherData.forecast.forecastday.map((day: any) => {
          const date = day.date || new Date().toISOString().split('T')[0];
          
          return {
            date: new Date(date).toLocaleDateString([], { weekday: 'short' }),
            rain: day.day?.totalprecip_mm !== undefined ? day.day.totalprecip_mm : 0,
            chance: day.day?.daily_chance_of_rain !== undefined ? day.day.daily_chance_of_rain : 0
          };
        });
      }
      
      return [];
    } catch (error) {
      console.error("Error parsing precipitation data:", error);
      return [];
    }
  };

  // Generate humidity data
  const getHumidityData = () => {
    if (!weatherData) {
      return [];
    }

    try {
      // Use raw OpenWeather API data if available
      if (weatherData.raw && weatherData.raw.list && Array.isArray(weatherData.raw.list)) {
        return weatherData.raw.list
          .filter((_: any, index: number) => index % 2 === 0) // Take every 2nd item
          .slice(0, 12)
          .map((item: any) => {
            const time = new Date(item.dt * 1000);
            return {
              time: time.toLocaleTimeString([], { hour: '2-digit' }),
              date: time.toLocaleDateString([], { month: 'short', day: 'numeric' }),
              humidity: item.main.humidity
            };
          });
      }
      
      // Use formatted forecast data
      if (weatherData.forecast && weatherData.forecast.forecastday) {
        return weatherData.forecast.forecastday.flatMap((day: any) => {
          if (!day.hour || !Array.isArray(day.hour)) return [];
          
          return day.hour
            .filter((_: any, index: number) => index % 3 === 0)
            .map((hour: any) => {
              const timeString = hour.time || new Date().toISOString();
              const time = new Date(timeString);
              
              return {
                time: time.toLocaleTimeString([], { hour: '2-digit' }),
                date: time.toLocaleDateString([], { month: 'short', day: 'numeric' }),
                humidity: hour.humidity !== undefined ? hour.humidity : 0
              };
            });
        });
      }
      
      return [];
    } catch (error) {
      console.error("Error parsing humidity data:", error);
      return [];
    }
  };

  // Generate wind data
  const getWindData = () => {
    if (!weatherData) {
      return [];
    }

    try {
      // Use raw OpenWeather API data if available
      if (weatherData.raw && weatherData.raw.list && Array.isArray(weatherData.raw.list)) {
        return weatherData.raw.list
          .filter((_: any, index: number) => index % 8 === 0) // One per day
          .slice(0, 5)
          .map((item: any) => {
            const date = new Date(item.dt * 1000);
            return {
              date: date.toLocaleDateString([], { weekday: 'short' }),
              speed: Math.round(item.wind.speed * 3.6), // Convert to km/h
              direction: item.wind.deg || 0
            };
          });
      }
      
      // Use formatted forecast data
      if (weatherData.forecast && weatherData.forecast.forecastday) {
        return weatherData.forecast.forecastday.map((day: any) => {
          const date = day.date || new Date().toISOString().split('T')[0];
          
          // Get speed from day data
          let speedValue = 0;
          if (day.day) {
            speedValue = day.day.maxwind_kph !== undefined ? day.day.maxwind_kph : 0;
          }
          
          return {
            date: new Date(date).toLocaleDateString([], { weekday: 'short' }),
            speed: speedValue,
            direction: day.hour?.[12]?.wind_dir || 'N/A'
          };
        });
      }
      
      return [];
    } catch (error) {
      console.error("Error parsing wind data:", error);
      return [];
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Loading state with skeleton UI
  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-secondary-light">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content */}
        <div className="space-y-6">
          {/* Weather Analytics Header */}
          <div className="glass rounded-xl shadow-elevation p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-heading text-white">Weather Analytics</h1>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-glow"></div>
                  <span className="text-green-400 font-medium">Live Updates</span>
                </div>
              </div>
              <Button 
                onClick={() => refetch()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            </div>
          </div>

          {/* Data Type Selection */}
          <div className="glass rounded-xl shadow-elevation p-6 mb-6">
            <div className="flex flex-wrap gap-3">
              {dataTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={activeDataType === type.value ? "default" : "outline"}
                  onClick={() => setActiveDataType(type.value)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    activeDataType === type.value 
                      ? "bg-blue-600 text-white" 
                      : "text-slate-400 border-slate-600 hover:bg-slate-700"
                  }`}
                >
                  {type.icon}
                  <span className="ml-2">{type.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2 rounded-xl glass shadow-elevation p-6 h-[400px] animate-pulse">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">📊</div>
                  <p className="text-slate-400">Chart loading...</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl glass shadow-elevation p-6 animate-pulse">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-4">📈</div>
                  <p className="text-slate-400">Stats loading...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="w-full rounded-xl glass shadow-elevation p-8 flex flex-col items-center justify-center text-center h-[70vh]">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-white mb-2">Unable to load analytics</h2>
              <p className="text-slate-400 mb-6 max-w-md">
                We're having trouble loading your weather analytics. This might be due to network issues or temporary service problems.
              </p>
              <Button 
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 border border-slate-600 text-white rounded-lg w-full md:w-auto"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Error state with retry button
  if (error) {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-secondary-light">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="w-full rounded-xl bg-white shadow-soft p-8 flex flex-col items-center justify-center text-center h-[70vh]">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-navy mb-2">Unable to Load Analytics Data</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              We're having trouble fetching the latest weather analytics. This could be due to connectivity issues or 
              API limitations.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => refetch()} 
                className="px-4 py-2 bg-primary text-white rounded-lg flex items-center justify-center w-full md:w-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retry Now
              </button>
              <button
                onClick={() => setSearchLocation("New York")} 
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg w-full md:w-auto"
              >
                Try Another Location
              </button>
            </div>
            {error instanceof Error && (
              <div className="mt-6 p-4 bg-red-50 rounded-lg text-left max-w-lg">
                <p className="text-sm font-medium text-red-800">Error Details:</p>
                <p className="text-xs text-red-700 mt-1 font-mono">
                  {error.message}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-secondary-light">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header Section */}
        <Header onSearch={handleSearch} />

        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold font-heading flex items-center">
              <BarChart2 className="mr-2 h-6 w-6" />
              Weather Analytics
            </h1>
            
            {/* Live Data Indicator */}
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">Live Updates</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => refetch()} 
            className="px-3 py-1 bg-primary text-white rounded-md text-sm flex items-center hover:bg-primary/90 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>
        
        {weatherData && weatherData.location && (
          <p className="text-gray-600 mb-6">
            Analyzing real-time weather data for {weatherData.location.name}
            {weatherData.location.region ? `, ${weatherData.location.region}` : ""}, 
            {weatherData.location.country}
          </p>
        )}

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-slate-300 font-medium">Time Range:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px] bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                <SelectValue placeholder="Select time range" className="text-white" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="day" className="text-white hover:bg-slate-700 focus:bg-slate-700 focus:text-white">
                  24 Hours
                </SelectItem>
                <SelectItem value="week" className="text-white hover:bg-slate-700 focus:bg-slate-700 focus:text-white">
                  This Week
                </SelectItem>
                <SelectItem value="month" className="text-white hover:bg-slate-700 focus:bg-slate-700 focus:text-white">
                  This Month
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="temperature">
          <TabsList className="mb-6">
            <TabsTrigger value="temperature" className="flex items-center">
              <Thermometer className="h-4 w-4 mr-2" />
              Temperature
            </TabsTrigger>
            <TabsTrigger value="precipitation" className="flex items-center">
              <CloudRain className="h-4 w-4 mr-2" />
              Precipitation
            </TabsTrigger>
            <TabsTrigger value="humidity" className="flex items-center">
              <Droplets className="h-4 w-4 mr-2" />
              Humidity
            </TabsTrigger>
            <TabsTrigger value="wind" className="flex items-center">
              <Wind className="h-4 w-4 mr-2" />
              Wind
            </TabsTrigger>
          </TabsList>
          
          {/* Temperature Tab */}
          <TabsContent value="temperature">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 font-heading">Temperature Trends</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getTemperatureData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }}
                        interval={6}
                      />
                      <YAxis 
                        label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="#8884d8" 
                        name="Actual Temp"
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="feelsLike" 
                        stroke="#82ca9d" 
                        name="Feels Like"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 font-heading">Temperature Stats</h3>
                
                {weatherData && weatherData.current && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Current Temperature</h4>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-primary">
                          {weatherData.current.temp_c}°C
                        </span>
                        <span className="ml-2 text-gray-600">
                          Feels like {weatherData.current.feelslike_c}°C
                        </span>
                      </div>
                    </div>
                    
                    {weatherData.forecast && weatherData.forecast.forecastday && weatherData.forecast.forecastday[0] && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-sm text-gray-500 mb-1">Min Temp (Today)</h4>
                          <p className="text-xl font-semibold text-blue-500">
                            {weatherData.forecast.forecastday[0].day.mintemp_c}°C
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-sm text-gray-500 mb-1">Max Temp (Today)</h4>
                          <p className="text-xl font-semibold text-red-500">
                            {weatherData.forecast.forecastday[0].day.maxtemp_c}°C
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {weatherData.forecast && weatherData.forecast.forecastday && weatherData.forecast.forecastday[0] && (
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Temperature Variation</h4>
                        <p className="font-medium">
                          {(weatherData.forecast.forecastday[0].day.maxtemp_c - weatherData.forecast.forecastday[0].day.mintemp_c).toFixed(1)}°C difference today
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
          
          {/* Precipitation Tab */}
          <TabsContent value="precipitation">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 font-heading">Precipitation & Chance of Rain</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getPrecipitationData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" label={{ value: 'Precipitation (mm)', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Chance of Rain (%)', angle: 90, position: 'insideRight' }} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="rain" fill="#8884d8" name="Precipitation (mm)" />
                      <Bar yAxisId="right" dataKey="chance" fill="#82ca9d" name="Chance of Rain (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 font-heading">Precipitation Stats</h3>
                
                {weatherData && weatherData.forecast && weatherData.forecast.forecastday && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Today's Precipitation</h4>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-blue-500">
                          {weatherData.forecast.forecastday[0].day.totalprecip_mm || 0} mm
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-500 mb-1">Chance of Rain</h4>
                        <p className="text-xl font-semibold">
                          {weatherData.forecast.forecastday[0].day.daily_chance_of_rain || 0}%
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm text-gray-500 mb-1">Humidity</h4>
                        <p className="text-xl font-semibold">
                          {weatherData.current.humidity || 0}%
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Current Condition</h4>
                      <p className="font-medium">
                        {weatherData.current.condition.text}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
          
          {/* Humidity Tab */}
          <TabsContent value="humidity">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 font-heading">Humidity Trends</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getHumidityData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis label={{ value: 'Humidity (%)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="humidity" 
                        stroke="#8884d8"
                        name="Humidity" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 font-heading">Humidity Info</h3>
                
                {weatherData && weatherData.current && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Current Humidity</h4>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-primary">
                          {weatherData.current.humidity}%
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Humidity Impact</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        High humidity can make it feel warmer, while low humidity can make it feel cooler.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Comfort Level</h4>
                      <p className="font-medium">
                        {weatherData.current.humidity < 30 
                          ? 'Dry - may cause skin irritation'
                          : weatherData.current.humidity > 70
                            ? 'Humid - may feel sticky'
                            : 'Comfortable'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
          
          {/* Wind Tab */}
          <TabsContent value="wind">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 font-heading">Wind Speed by Day</h3>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getWindData()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis label={{ value: 'Wind Speed (km/h)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip 
                        formatter={(value) => [`${value} km/h`, 'Max Wind Speed']}
                        labelFormatter={(label, payload) => 
                          `${label} - ${payload && payload.length > 0 ? 
                            (typeof payload[0].payload.direction === 'string' ? 
                              payload[0].payload.direction : 
                              `${payload[0].payload.direction}°`) : ''}`
                        }
                      />
                      <Legend />
                      <Bar dataKey="speed" fill="#8884d8" name="Wind Speed" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 font-heading">Wind Details</h3>
                
                {weatherData && weatherData.current && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Current Wind</h4>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-primary">
                          {weatherData.current.wind_kph} km/h
                        </span>
                        <span className="ml-2 text-gray-600">
                          {weatherData.current.wind_dir}
                        </span>
                      </div>
                    </div>
                    
                    {weatherData.current.gust_kph && (
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Gust Speed</h4>
                        <p className="font-medium">
                          {weatherData.current.gust_kph} km/h
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">Wind Category</h4>
                      <p className="font-medium">
                        {weatherData.current.wind_kph < 5 ? 'Calm' : 
                         weatherData.current.wind_kph < 20 ? 'Light Breeze' : 
                         weatherData.current.wind_kph < 40 ? 'Moderate Wind' : 
                         weatherData.current.wind_kph < 60 ? 'Strong Wind' : 'Gale Force Wind'}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}