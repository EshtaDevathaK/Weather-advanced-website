import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchWeatherData, getCurrentLocation } from "@/lib/weatherService2";
import { getWeatherIcon } from "@/lib/weatherIcons";
import { getTemperatureColor } from "@/lib/weatherUtils";
import { Plus, ChevronRight, Star, StarOff, MapPin, Trash2, Heart, Compass, Loader2 } from "lucide-react";
import { getWeatherPhoto, getRandomWeatherPhotos } from "@/lib/seasonalPhotos";
import { useToast } from "@/hooks/use-toast";

export default function Locations() {
  const [searchLocation, setSearchLocation] = useState("");
  const [savedLocations, setSavedLocations] = useState<string[]>([
    "Los Angeles",
    "New York",
    "London",
    "Tokyo",
    "Sydney"
  ]);
  const [favoriteLocations, setFavoriteLocations] = useState<string[]>([
    "Los Angeles",
    "Tokyo"
  ]);
  const [activeLocation, setActiveLocation] = useState<string | { lat: number; lon: number }>("Los Angeles");
  const [currentLocationName, setCurrentLocationName] = useState<string>("");
  const [fetchingCurrentLocation, setFetchingCurrentLocation] = useState<boolean>(false);
  const [locationPhotos, setLocationPhotos] = useState<any[]>([]);
  
  const { toast } = useToast();
  
  // Display name for active location (handling both string and coordinates)
  const getActiveLocationName = (): string => {
    if (typeof activeLocation === 'string') {
      return activeLocation;
    } else {
      return currentLocationName || "Current Location";
    }
  };

  // Fetch weather data for the active location
  const { data: weatherData, isLoading, error } = useQuery({
    queryKey: ['weatherData', typeof activeLocation === 'string' ? activeLocation : 'currentLocation'],
    queryFn: () => fetchWeatherData(activeLocation),
    enabled: !!activeLocation,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Generate location photos based on weather data
  useEffect(() => {
    if (weatherData) {
      const condition = weatherData.current.condition.text.toLowerCase();
      const temperature = weatherData.current.temp_c;
      
      // Get current weather photo
      const currentPhoto = getWeatherPhoto(condition, temperature);
      
      // Get random additional photos
      const randomPhotos = getRandomWeatherPhotos(5);
      
      // Combine and shuffle photos
      const allPhotos = [currentPhoto, ...randomPhotos];
      const shuffledPhotos = [...allPhotos].sort(() => 0.5 - Math.random());
      
      setLocationPhotos(shuffledPhotos);
    }
  }, [weatherData]);

  // Get user's current location
  const handleGetCurrentLocation = async () => {
    setFetchingCurrentLocation(true);
    
    try {
      const coords = await getCurrentLocation();
      setActiveLocation(coords);
      
      // Set name to "Current Location" initially, the actual location name will be updated
      // from the weather data response
      setCurrentLocationName("Current Location");
      
      toast({
        title: "Location detected",
        description: "Fetching weather for your current location",
      });
    } catch (error) {
      console.error('Error getting current location:', error);
      toast({
        title: "Location detection failed",
        description: "Please allow location access or search for a location manually",
        variant: "destructive",
      });
    } finally {
      setFetchingCurrentLocation(false);
    }
  };
  
  // Update location name for current location once weather data is loaded
  useEffect(() => {
    if (weatherData && typeof activeLocation !== 'string') {
      // If using current location and we get weather data,
      // update the current location name from the API response
      setCurrentLocationName(`${weatherData.location.name}, ${weatherData.location.country}`);
      
      // If this location isn't in saved locations, add it
      if (!savedLocations.includes(weatherData.location.name)) {
        setSavedLocations(prev => [...prev, weatherData.location.name]);
      }
    }
  }, [weatherData, activeLocation, savedLocations]);

  const handleSearch = (location: string) => {
    setSearchLocation(location);
  };

  const handleAddLocation = () => {
    if (searchLocation && !savedLocations.includes(searchLocation)) {
      setSavedLocations([...savedLocations, searchLocation]);
      setSearchLocation("");
    }
  };

  const handleRemoveLocation = (location: string) => {
    setSavedLocations(savedLocations.filter(loc => loc !== location));
    if (favoriteLocations.includes(location)) {
      setFavoriteLocations(favoriteLocations.filter(loc => loc !== location));
    }
    
    // If removing the active location, select the first available location
    if (typeof activeLocation === 'string' && activeLocation === location) {
      const nextLocation = savedLocations.find(loc => loc !== location);
      if (nextLocation) {
        setActiveLocation(nextLocation);
      }
    }
  };

  const handleToggleFavorite = (location: string) => {
    if (favoriteLocations.includes(location)) {
      setFavoriteLocations(favoriteLocations.filter(loc => loc !== location));
    } else {
      setFavoriteLocations([...favoriteLocations, location]);
    }
  };

  const handleSelectLocation = (location: string) => {
    setActiveLocation(location);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header Section */}
        <Header onSearch={handleSearch} />

        <h1 className="text-2xl font-bold mb-6 font-heading flex items-center text-white">
          <MapPin className="mr-2 h-6 w-6" />
          Saved Locations
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Locations List */}
          <div className="lg:col-span-1">
            <Card className="glass p-6 shadow-elevation">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold font-heading text-white">My Locations</h2>
                <div className="h-8 w-8 rounded-full bg-blue-600 bg-opacity-20 flex items-center justify-center text-blue-400">
                  {savedLocations.length}
                </div>
              </div>

              {/* Add Location Input */}
              <div className="flex items-center space-x-2 mb-2">
                <Input 
                  placeholder="Add new location" 
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="input-dark flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddLocation();
                  }}
                />
                <Button 
                  size="icon" 
                  onClick={handleAddLocation}
                  disabled={!searchLocation || savedLocations.includes(searchLocation)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Current Location Button */}
              <Button 
                variant="outline" 
                className="mb-6 w-full flex items-center justify-center"
                onClick={handleGetCurrentLocation}
                disabled={fetchingCurrentLocation}
              >
                {fetchingCurrentLocation ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Compass className="h-4 w-4 mr-2" />
                )}
                {fetchingCurrentLocation ? "Detecting location..." : "Use my current location"}
              </Button>

              {/* Location List */}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {savedLocations.map((location) => (
                  <div 
                    key={location}
                    className={`
                      flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                      ${typeof activeLocation === 'string' && activeLocation === location ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}
                    `}
                    onClick={() => handleSelectLocation(location)}
                  >
                    <div className="flex items-center">
                      {favoriteLocations.includes(location) && (
                        <Star className={`h-4 w-4 mr-2 ${typeof activeLocation === 'string' && activeLocation === location ? 'text-yellow-200' : 'text-yellow-500'}`} />
                      )}
                      <span className="font-medium">{location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button 
                        className={`p-1 rounded-full ${typeof activeLocation === 'string' && activeLocation === location ? 'hover:bg-primary-dark' : 'hover:bg-gray-300'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(location);
                        }}
                      >
                        {favoriteLocations.includes(location) ? (
                          <StarOff className={`h-4 w-4 ${typeof activeLocation === 'string' && activeLocation === location ? 'text-white' : 'text-gray-600'}`} />
                        ) : (
                          <Star className={`h-4 w-4 ${typeof activeLocation === 'string' && activeLocation === location ? 'text-white' : 'text-gray-600'}`} />
                        )}
                      </button>
                      <button 
                        className={`p-1 rounded-full ${typeof activeLocation === 'string' && activeLocation === location ? 'hover:bg-primary-dark' : 'hover:bg-gray-300'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveLocation(location);
                        }}
                      >
                        <Trash2 className={`h-4 w-4 ${typeof activeLocation === 'string' && activeLocation === location ? 'text-white' : 'text-gray-600'}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            {/* Favorite Locations */}
            <Card className="p-6 mt-6">
              <h2 className="text-xl font-semibold font-heading mb-4 flex items-center">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Favorite Locations
              </h2>
              
              {favoriteLocations.length > 0 ? (
                <div className="space-y-2">
                  {favoriteLocations.map((location) => (
                    <div 
                      key={location}
                      className="flex items-center justify-between p-3 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSelectLocation(location)}
                    >
                      <span className="font-medium">{location}</span>
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <p>No favorite locations yet</p>
                  <p className="text-sm mt-1">Star a location to add it here</p>
                </div>
              )}
            </Card>
          </div>

          {/* Weather Details */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <Card className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="text-4xl mb-4">🌤️</div>
                  <p className="text-navy font-medium">Loading weather data...</p>
                </div>
              </Card>
            ) : error ? (
              <Card className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="text-4xl mb-4">⚠️</div>
                  <p className="text-navy font-medium">Failed to load weather data</p>
                  <p className="text-gray-600 mt-2">Please try again later</p>
                </div>
              </Card>
            ) : weatherData ? (
              <>
                {/* Current Weather Card */}
                <Card className="p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold font-heading">
                      {weatherData.location.name}, {weatherData.location.country}
                    </h2>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        if (typeof activeLocation === 'string') {
                          handleToggleFavorite(activeLocation);
                        } else if (weatherData) {
                          // When using current location coordinates, use the location name from API
                          handleToggleFavorite(weatherData.location.name);
                        }
                      }}
                    >
                      {typeof activeLocation === 'string' && favoriteLocations.includes(activeLocation) || 
                       typeof activeLocation !== 'string' && weatherData && favoriteLocations.includes(weatherData.location.name) ? (
                        <Star className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <Star className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="mr-4">
                        {getWeatherIcon(weatherData.current.condition.text, "w-24 h-24")}
                      </div>
                      <div>
                        <p className="text-4xl font-bold" style={{ color: getTemperatureColor(weatherData.current.temp_c) }}>
                          {Math.round(weatherData.current.temp_c)}°C
                        </p>
                        <p className="text-gray-600 text-lg">
                          {weatherData.current.condition.text}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Feels like:</span>
                        <span className="font-medium">{Math.round(weatherData.current.feelslike_c)}°C</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Wind:</span>
                        <span className="font-medium">{weatherData.current.wind_kph} km/h</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Humidity:</span>
                        <span className="font-medium">{weatherData.current.humidity}%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 mr-2">UV Index:</span>
                        <span className="font-medium">{weatherData.current.uv}</span>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Forecast Card */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold font-heading mb-4">
                    3-Day Forecast
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {weatherData.forecast.forecastday.map((day: any) => (
                      <div key={day.date} className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium mb-2">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                        <div className="flex items-center mb-2">
                          {getWeatherIcon(day.day.condition.text, "w-10 h-10")}
                          <p className="ml-2">{day.day.condition.text}</p>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">High: {Math.round(day.day.maxtemp_c)}°C</span>
                          <span className="text-gray-600">Low: {Math.round(day.day.mintemp_c)}°C</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                
                {/* Location Details */}
                <Card className="p-6 mt-6">
                  <h2 className="text-xl font-semibold font-heading mb-4">
                    Location Details
                  </h2>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-sm">Local Time</p>
                      <p className="font-medium">{new Date(weatherData.location.localtime).toLocaleTimeString()}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-sm">Coordinates</p>
                      <p className="font-medium">{weatherData.location.lat.toFixed(2)}, {weatherData.location.lon.toFixed(2)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-sm">Timezone</p>
                      <p className="font-medium">{weatherData.location.tz_id}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-500 text-sm">Region</p>
                      <p className="font-medium">{weatherData.location.region || 'N/A'}</p>
                    </div>
                  </div>
                </Card>
                
                {/* Weather Photos Gallery */}
                <Card className="p-6 mt-6">
                  <h2 className="text-xl font-semibold font-heading mb-4">
                    Seasonal Weather Photos
                  </h2>
                  
                  {locationPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {locationPhotos.slice(0, 6).map((photo, index) => (
                        <div key={index} className="relative rounded-lg overflow-hidden h-48 group">
                          <img 
                            src={photo.url} 
                            alt={photo.alt}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                            <p className="text-white text-sm font-medium">{photo.alt}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Loading weather photos...</p>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-4">
                    Photos based on current weather conditions in {weatherData.location.name}
                  </p>
                </Card>
              </>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}