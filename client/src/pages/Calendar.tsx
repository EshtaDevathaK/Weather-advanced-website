import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { fetchWeatherData } from "@/lib/weatherService2";
import { getWeatherIcon } from "@/lib/weatherIcons";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

export default function Calendar() {
  const [searchLocation, setSearchLocation] = useState("Los Angeles");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const { data: weatherData, isLoading, error, refetch } = useQuery({
    queryKey: ['weatherData', searchLocation],
    queryFn: () => fetchWeatherData(searchLocation),
    enabled: !!searchLocation,
  });

  const handleSearch = (location: string) => {
    setSearchLocation(location);
    setTimeout(() => refetch(), 100);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  // Helper to format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-light">
        <div className="text-center">
          <div className="text-4xl mb-4">🌤️</div>
          <p className="text-navy font-medium">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary-light">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-navy font-medium">Failed to load weather data</p>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
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
          <CalendarDays className="mr-2 h-6 w-6" />
          Weather Calendar for {weatherData?.location.name || 'Your Location'}
        </h1>

        {isLoading ? (
          <div className="glass rounded-xl shadow-elevation p-8 text-center">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-slate-400 font-medium">Loading calendar...</p>
          </div>
        ) : error ? (
          <div className="glass rounded-xl shadow-elevation p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-white mb-2">Unable to load calendar</h2>
            <p className="text-slate-400 mt-2">Please try again later</p>
          </div>
        ) : weatherData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar Widget */}
            <div className="glass rounded-xl shadow-elevation p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Weather Calendar</h2>
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium text-white">August 2025</h3>
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-slate-400 p-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Dates */}
                {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                  <div 
                    key={date} 
                    className={`text-center p-2 text-sm cursor-pointer rounded-lg transition-colors ${
                      date === 23 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {date}
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-slate-500 text-center">
                Weather forecast data is typically available only for the next 3-5 days. Historical data and extended forecasts may require premium API access.
              </p>
            </div>

            {/* Weather Details */}
            <div className="space-y-6">
              {/* Selected Date Weather */}
              <div className="glass rounded-xl shadow-elevation p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Saturday, August 23, 2025</h3>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-4xl">
                    {getWeatherIcon(weatherData.current.condition.text)}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      High: {Math.round(weatherData.forecast.forecastday[0].day.maxtemp_c)}°C / 
                      Low: {Math.round(weatherData.forecast.forecastday[0].day.mintemp_c)}°C
                    </div>
                    <div className="text-slate-400">{weatherData.current.condition.text}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-slate-500 mb-1">Sunrise</div>
                    <div className="text-white font-medium">{weatherData.forecast.forecastday[0].astro.sunrise}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-500 mb-1">Sunset</div>
                    <div className="text-white font-medium">{weatherData.forecast.forecastday[0].astro.sunset}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-500 mb-1">UV Index</div>
                    <div className="text-white font-medium">{weatherData.forecast.forecastday[0].day.uv}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-500 mb-1">Moon Phase</div>
                    <div className="text-white font-medium">Not available</div>
                  </div>
                </div>
              </div>

              {/* Outfit Suggestion */}
              <div className="glass rounded-xl shadow-elevation p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Outfit Suggestion</h4>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">👕</div>
                  <div className="text-3xl">🧢</div>
                  <div className="text-slate-400">
                    Light clothing recommended for today's weather
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

// Helper functions
function isDateInForecast(date: Date, weatherData: any): boolean {
  const dateStr = date.toISOString().split('T')[0];
  return weatherData.forecast.forecastday.some((day: any) => day.date === dateStr);
}

function getForecastForDate(date: Date, weatherData: any): any {
  const dateStr = date.toISOString().split('T')[0];
  return weatherData.forecast.forecastday.find((day: any) => day.date === dateStr);
}

function getOutfitEmoji(condition: string): string {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return '🧥☂️';
  } else if (conditionLower.includes('snow')) {
    return '🧣🧤';
  } else if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
    return '👕🕶️';
  } else if (conditionLower.includes('cloud')) {
    return '👚🧢';
  } else if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
    return '🧥👖';
  } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return '🧥🌂';
  }
  
  return '👔👖';
}

function getOutfitSuggestion(condition: string, temp: number): string {
  const conditionLower = condition.toLowerCase();
  
  if (temp > 25) {
    return "It's hot today! Light clothing like t-shirts, shorts or skirts, and sunglasses are recommended. Don't forget sunscreen!";
  } else if (temp > 15) {
    return "Mild temperatures today. A light jacket or sweater might be useful, especially in the evening.";
  } else if (temp > 5) {
    return "Cool temperatures today. Dress in layers with a warm jacket or coat.";
  } else {
    return "It's cold! Bundle up with a heavy coat, scarf, gloves, and hat.";
  }
}