// Weather API integration using OpenWeather API
// Using environment variables for API key security

// Client calls server proxy; API keys remain on the server
const PROXY_ENDPOINT = '/api/weather';

// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

// Get current date and next dates for forecast
const getCurrentAndNextDates = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  return [
    formatDate(today),
    formatDate(tomorrow),
    formatDate(dayAfterTomorrow)
  ];
};

// Map OpenWeather codes to weather conditions
const getWeatherCondition = (id: number, isDay: boolean = true) => {
  // Weather condition mapping based on OpenWeather API condition codes
  // https://openweathermap.org/weather-conditions
  
  // Thunderstorm
  if (id >= 200 && id < 300) {
    return {
      text: id < 210 ? 'Thunderstorm with Rain' : 'Thunderstorm',
      icon: `//cdn.weatherapi.com/weather/64x64/${isDay ? 'day' : 'night'}/386.png`,
      code: id
    };
  }
  
  // Drizzle
  if (id >= 300 && id < 400) {
    return {
      text: 'Drizzle',
      icon: `//cdn.weatherapi.com/weather/64x64/${isDay ? 'day' : 'night'}/266.png`,
      code: id
    };
  }
  
  // Rain
  if (id >= 500 && id < 600) {
    let intensity = 'Moderate';
    let iconCode = '296';
    
    if (id === 500 || id === 520) {
      intensity = 'Light';
      iconCode = '293';
    } else if (id === 502 || id === 522) {
      intensity = 'Heavy';
      iconCode = '308';
    } else if (id === 511) {
      intensity = 'Freezing';
      iconCode = '281';
    }
    
    return {
      text: `${intensity} Rain`,
      icon: `//cdn.weatherapi.com/weather/64x64/${isDay ? 'day' : 'night'}/${iconCode}.png`,
      code: id
    };
  }
  
  // Snow
  if (id >= 600 && id < 700) {
    let intensity = 'Moderate';
    let iconCode = '332';
    
    if (id === 600) {
      intensity = 'Light';
      iconCode = '326';
    } else if (id === 602) {
      intensity = 'Heavy';
      iconCode = '338';
    } else if (id === 611 || id === 612 || id === 613) {
      intensity = 'Sleet';
      iconCode = '317';
    }
    
    return {
      text: `${intensity} Snow`,
      icon: `//cdn.weatherapi.com/weather/64x64/${isDay ? 'day' : 'night'}/${iconCode}.png`,
      code: id
    };
  }
  
  // Atmosphere (fog, mist, etc.)
  if (id >= 700 && id < 800) {
    let condition = 'Mist';
    let iconCode = '143';
    
    if (id === 711) {
      condition = 'Smoke';
    } else if (id === 721) {
      condition = 'Haze';
    } else if (id === 731 || id === 761) {
      condition = 'Dust';
    } else if (id === 741) {
      condition = 'Fog';
      iconCode = '248';
    } else if (id === 751) {
      condition = 'Sand';
    } else if (id === 762) {
      condition = 'Volcanic Ash';
    } else if (id === 771) {
      condition = 'Squalls';
    } else if (id === 781) {
      condition = 'Tornado';
      iconCode = '389';
    }
    
    return {
      text: condition,
      icon: `//cdn.weatherapi.com/weather/64x64/${isDay ? 'day' : 'night'}/${iconCode}.png`,
      code: id
    };
  }
  
  // Clear
  if (id === 800) {
    return {
      text: 'Clear',
      icon: `//cdn.weatherapi.com/weather/64x64/${isDay ? 'day' : 'night'}/113.png`,
      code: id
    };
  }
  
  // Clouds
  if (id > 800 && id < 900) {
    let cloudiness = 'Partly';
    let iconCode = '116';
    
    if (id === 802) {
      cloudiness = 'Scattered';
      iconCode = '116';
    } else if (id === 803) {
      cloudiness = 'Broken';
      iconCode = '119';
    } else if (id === 804) {
      cloudiness = 'Overcast';
      iconCode = '122';
    }
    
    return {
      text: `${cloudiness} Cloudy`,
      icon: `//cdn.weatherapi.com/weather/64x64/${isDay ? 'day' : 'night'}/${iconCode}.png`,
      code: id
    };
  }
  
  // Default fallback
  return {
    text: 'Unknown',
    icon: `//cdn.weatherapi.com/weather/64x64/day/116.png`,
    code: id
  };
};

// Convert wind direction in degrees to compass direction
const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

// Check if it's daytime based on sunrise/sunset
const isDaytime = (dt: number, sunrise: number, sunset: number): boolean => {
  return dt >= sunrise && dt < sunset;
};

// Client no longer geocodes; server handles it

// Function to get user's current location using the browser's Geolocation API
export const getCurrentLocation = (): Promise<{ lat: number, lon: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        reject(error);
      },
      { timeout: 10000 }
    );
  });
};

// Function to fetch weather data by location name or coordinates
export const fetchWeatherData = async (cityOrCoords: string | { lat: number, lon: number }) => {
  try {
    const loc = typeof cityOrCoords === 'string' ? cityOrCoords : `${cityOrCoords.lat},${cityOrCoords.lon}`;
    const res = await fetch(`${PROXY_ENDPOINT}?loc=${encodeURIComponent(loc)}`, { credentials: 'include' });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status}: ${text || res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};