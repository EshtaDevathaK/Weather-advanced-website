// Collection of weather-related photos for different conditions and seasons
// These URLs point to high-quality, royalty-free images that change based on weather conditions

interface WeatherPhoto {
  url: string;
  alt: string;
  credit?: string;
  temperature?: number; // Temperature threshold in Celsius
  condition?: string;   // Weather condition
  season?: 'winter' | 'spring' | 'summer' | 'fall'; // Season for gradient overlay
  gradientOverlay?: string; // CSS gradient overlay value
}

// Photos for sunny conditions
export const sunnyPhotos: WeatherPhoto[] = [
  {
    url: "https://images.unsplash.com/photo-1522536421511-14c9073df899",
    alt: "Sunny beach with palm trees",
    condition: "sunny",
  },
  {
    url: "https://images.unsplash.com/photo-1520454974749-611b7248ffdb",
    alt: "Sunny vineyard landscape",
    condition: "sunny",
  },
  {
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    alt: "Sunny beach with clear blue water",
    condition: "sunny",
  },
  {
    url: "https://images.unsplash.com/photo-1476673160081-cf065607f449",
    alt: "Sunny mountain landscape",
    condition: "sunny",
  },
  {
    url: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d",
    alt: "Sunny urban park scene",
    condition: "sunny",
  },
];

// Photos for rainy conditions
export const rainyPhotos: WeatherPhoto[] = [
  {
    url: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17",
    alt: "Rainy city street with reflections",
    condition: "rain",
  },
  {
    url: "https://images.unsplash.com/photo-1501999635878-71cb5379c2d8",
    alt: "Rain drops on window pane",
    condition: "rain",
  },
  {
    url: "https://images.unsplash.com/photo-1438449805896-28a666819a20",
    alt: "Person with umbrella in rain",
    condition: "rain",
  },
  {
    url: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0",
    alt: "Wet road during rainfall",
    condition: "rain",
  },
  {
    url: "https://images.unsplash.com/photo-1523772721666-22ad3c3b6f90",
    alt: "Lightning storm over city",
    condition: "thunderstorm",
  },
];

// Photos for cloudy conditions
export const cloudyPhotos: WeatherPhoto[] = [
  {
    url: "https://images.unsplash.com/photo-1534088568595-a066f410bcda",
    alt: "Cloudy mountain landscape",
    condition: "cloudy",
  },
  {
    url: "https://images.unsplash.com/photo-1499956827185-0d63ee78a910",
    alt: "Dramatic cloudy sky over ocean",
    condition: "cloudy",
  },
  {
    url: "https://images.unsplash.com/photo-1594156596782-656c93e4d504",
    alt: "Cloudy urban skyline",
    condition: "cloudy",
  },
  {
    url: "https://images.unsplash.com/photo-1505533542167-8c89838bb019",
    alt: "Cloudy countryside landscape",
    condition: "cloudy",
  },
  {
    url: "https://images.unsplash.com/photo-1513002749550-c59d786b8e6c",
    alt: "Moody cloudy forest scene",
    condition: "cloudy",
  },
];

// Photos for snowy conditions
export const snowyPhotos: WeatherPhoto[] = [
  {
    url: "https://images.unsplash.com/photo-1511131341542-3c20b2fbcde2",
    alt: "Snow-covered forest",
    condition: "snow",
  },
  {
    url: "https://images.unsplash.com/photo-1491002052546-bf38f186af56",
    alt: "Snowy mountain peak",
    condition: "snow",
  },
  {
    url: "https://images.unsplash.com/photo-1548777123-e216912df7d8",
    alt: "Snowy city street",
    condition: "snow",
  },
  {
    url: "https://images.unsplash.com/photo-1454942901704-3c44c11b2ad1",
    alt: "Cabin in snowy landscape",
    condition: "snow",
  },
  {
    url: "https://images.unsplash.com/photo-1612748732446-5361d1a0583c",
    alt: "Person walking in snow",
    condition: "snow",
  },
];

// Photos for foggy conditions
export const foggyPhotos: WeatherPhoto[] = [
  {
    url: "https://images.unsplash.com/photo-1487621167305-5d248087c724",
    alt: "Foggy forest path",
    condition: "fog",
  },
  {
    url: "https://images.unsplash.com/photo-1502472584811-0a2f2feb8968",
    alt: "Bridge in fog",
    condition: "mist",
  },
  {
    url: "https://images.unsplash.com/photo-1493815793585-d94ccbc86df8",
    alt: "Foggy city skyline",
    condition: "fog",
  },
  {
    url: "https://images.unsplash.com/photo-1513147159441-85173d52ade8",
    alt: "Misty mountain landscape",
    condition: "mist",
  },
  {
    url: "https://images.unsplash.com/photo-1522163723043-478ef79a5bb4",
    alt: "Foggy countryside road",
    condition: "fog",
  },
];

// Photos based on seasonal temperatures
export const seasonalPhotos: WeatherPhoto[] = [
  // Hot summer (above 28°C)
  {
    url: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a",
    alt: "Summer beach with people swimming",
    temperature: 28,
  },
  {
    url: "https://images.unsplash.com/photo-1437209484568-e63b90a34f8b",
    alt: "Summer park with people relaxing",
    temperature: 28,
  },
  {
    url: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae",
    alt: "People at summer pool party",
    temperature: 30,
  },
  {
    url: "https://images.unsplash.com/photo-1541417904950-b855846fe074",
    alt: "Summer outdoor café scene",
    temperature: 28,
  },
  
  // Spring/Fall moderate (15-25°C)
  {
    url: "https://images.unsplash.com/photo-1490750967868-88aa4486c946",
    alt: "Spring flowers blooming",
    temperature: 15,
  },
  {
    url: "https://images.unsplash.com/photo-1552083375-1447ce886485",
    alt: "Cherry blossoms in park",
    temperature: 18,
  },
  {
    url: "https://images.unsplash.com/photo-1507783548227-544c84716bda",
    alt: "Fall leaves on trees",
    temperature: 15,
  },
  {
    url: "https://images.unsplash.com/photo-1504788363733-507549153474",
    alt: "Autumn forest with colored leaves",
    temperature: 12,
  },
  
  // Cold winter (below 5°C)
  {
    url: "https://images.unsplash.com/photo-1455156218388-5e61b526818b",
    alt: "Winter landscape with frozen lake",
    temperature: 0,
  },
  {
    url: "https://images.unsplash.com/photo-1581303435722-cb4a7090fb1f",
    alt: "Icy tree branches in winter",
    temperature: -5,
  },
  {
    url: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d",
    alt: "Person bundled up in winter clothing",
    temperature: 2,
  },
  {
    url: "https://images.unsplash.com/photo-1491002052546-bf38f186af56",
    alt: "Snow-covered mountains",
    temperature: -10,
  },
];

// Define reliable fallback images for each season/condition to ensure we always have images
export const FALLBACK_PHOTOS: Record<string, WeatherPhoto[]> = {
  summer: [
    {
      url: "https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg",
      alt: "Summer beach with palm trees",
      season: "summer",
      gradientOverlay: "linear-gradient(to bottom, rgba(255, 223, 100, 0.1), rgba(255, 168, 50, 0.2))"
    },
    {
      url: "https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg",
      alt: "Summer sunset over beach",
      season: "summer",
      gradientOverlay: "linear-gradient(to bottom, rgba(255, 223, 100, 0.1), rgba(255, 168, 50, 0.2))"
    },
    {
      url: "https://images.pexels.com/photos/33545/sunrise-phu-quoc-island-ocean.jpg",
      alt: "Tropical summer beach",
      season: "summer",
      gradientOverlay: "linear-gradient(to bottom, rgba(255, 223, 100, 0.1), rgba(255, 168, 50, 0.2))"
    },
    {
      url: "https://images.pexels.com/photos/2880507/pexels-photo-2880507.jpeg",
      alt: "Vibrant summer forest",
      season: "summer",
      gradientOverlay: "linear-gradient(to bottom, rgba(76, 187, 23, 0.1), rgba(255, 168, 50, 0.1))"
    }
  ],
  winter: [
    {
      url: "https://images.pexels.com/photos/688660/pexels-photo-688660.jpeg",
      alt: "Snowy winter landscape",
      season: "winter",
      gradientOverlay: "linear-gradient(to bottom, rgba(230, 240, 255, 0.2), rgba(116, 171, 255, 0.2))"
    },
    {
      url: "https://images.pexels.com/photos/730256/pexels-photo-730256.jpeg",
      alt: "Winter forest with snow",
      season: "winter",
      gradientOverlay: "linear-gradient(to bottom, rgba(230, 240, 255, 0.2), rgba(116, 171, 255, 0.2))"
    },
    {
      url: "https://images.pexels.com/photos/773594/pexels-photo-773594.jpeg",
      alt: "Winter mountain landscape",
      season: "winter",
      gradientOverlay: "linear-gradient(to bottom, rgba(230, 240, 255, 0.2), rgba(116, 171, 255, 0.2))"
    }
  ],
  spring: [
    {
      url: "https://images.pexels.com/photos/1028725/pexels-photo-1028725.jpeg",
      alt: "Spring cherry blossoms",
      season: "spring",
      gradientOverlay: "linear-gradient(to bottom, rgba(200, 255, 200, 0.15), rgba(140, 210, 110, 0.15))"
    },
    {
      url: "https://images.pexels.com/photos/36478/amazing-beautiful-beauty-blue.jpg",
      alt: "Spring meadow with flowers",
      season: "spring",
      gradientOverlay: "linear-gradient(to bottom, rgba(200, 255, 200, 0.15), rgba(140, 210, 110, 0.15))"
    },
    {
      url: "https://images.pexels.com/photos/3511546/pexels-photo-3511546.jpeg",
      alt: "Spring blossoms on tree",
      season: "spring",
      gradientOverlay: "linear-gradient(to bottom, rgba(255, 220, 230, 0.15), rgba(180, 210, 140, 0.15))"
    }
  ],
  fall: [
    {
      url: "https://images.pexels.com/photos/1252983/pexels-photo-1252983.jpeg",
      alt: "Fall forest with colored leaves",
      season: "fall",
      gradientOverlay: "linear-gradient(to bottom, rgba(255, 200, 120, 0.15), rgba(200, 120, 50, 0.15))"
    },
    {
      url: "https://images.pexels.com/photos/1172849/pexels-photo-1172849.jpeg",
      alt: "Fall pathway with leaves",
      season: "fall",
      gradientOverlay: "linear-gradient(to bottom, rgba(255, 200, 120, 0.15), rgba(200, 120, 50, 0.15))"
    },
    {
      url: "https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg",
      alt: "Fall red leaves",
      season: "fall",
      gradientOverlay: "linear-gradient(to bottom, rgba(255, 180, 100, 0.15), rgba(220, 110, 60, 0.15))"
    }
  ],
  rainy: [
    {
      url: "https://images.pexels.com/photos/110874/pexels-photo-110874.jpeg",
      alt: "Rain drops on window",
      condition: "rain",
      gradientOverlay: "linear-gradient(to bottom, rgba(100, 140, 180, 0.2), rgba(70, 90, 120, 0.2))"
    },
    {
      url: "https://images.pexels.com/photos/1463530/pexels-photo-1463530.jpeg",
      alt: "Person with umbrella in rain",
      condition: "rain",
      gradientOverlay: "linear-gradient(to bottom, rgba(100, 140, 180, 0.2), rgba(70, 90, 120, 0.2))"
    }
  ],
  cloudy: [
    {
      url: "https://images.pexels.com/photos/158163/clouds-cloudporn-weather-lookup-158163.jpeg",
      alt: "Cloudy sky",
      condition: "cloudy",
      gradientOverlay: "linear-gradient(to bottom, rgba(200, 200, 200, 0.15), rgba(150, 150, 150, 0.15))"
    },
    {
      url: "https://images.pexels.com/photos/531767/pexels-photo-531767.jpeg",
      alt: "Cloudy mountain landscape",
      condition: "cloudy",
      gradientOverlay: "linear-gradient(to bottom, rgba(200, 200, 200, 0.15), rgba(150, 150, 150, 0.15))"
    }
  ],
  sunny: [
    {
      url: "https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg",
      alt: "Sunny beach",
      condition: "sunny",
      gradientOverlay: "linear-gradient(to bottom, rgba(255, 240, 150, 0.15), rgba(255, 200, 120, 0.15))"
    },
    {
      url: "https://images.pexels.com/photos/355312/pexels-photo-355312.jpeg",
      alt: "Sunny sky with clouds",
      condition: "sunny",
      gradientOverlay: "linear-gradient(to bottom, rgba(255, 240, 150, 0.15), rgba(255, 200, 120, 0.15))"
    }
  ],
  default: [
    {
      url: "https://images.pexels.com/photos/1486994/pexels-photo-1486994.jpeg",
      alt: "Scenic landscape with river and mountains",
      gradientOverlay: "linear-gradient(to bottom, rgba(200, 220, 240, 0.15), rgba(180, 200, 220, 0.15))"
    },
    {
      url: "https://images.pexels.com/photos/33545/sunrise-phu-quoc-island-ocean.jpg",
      alt: "Ocean sunset scenic view",
      gradientOverlay: "linear-gradient(to bottom, rgba(255, 223, 100, 0.15), rgba(255, 168, 50, 0.15))"
    }
  ]
};

// Get a weather photo based on current conditions and apply gradient overlay based on season
export function getWeatherPhoto(condition: string, temperature: number): WeatherPhoto {
  let photoCollection: WeatherPhoto[] = [];
  const conditionLower = condition.toLowerCase();
  const currentHour = new Date().getHours();
  const month = new Date().getMonth(); // 0-11
  const isDay = currentHour >= 6 && currentHour < 18; // Simple day/night detection
  
  // Determine season based on month (Northern Hemisphere with Tamil seasonal adjustment)
  // Tamil seasonal calendar roughly aligns with: 
  // Kaar (Rainy) - Aug-Oct, Kulir (Cool) - Nov-Jan, 
  // Munpani (Early Dew) - Feb-Mar, Pinpani (Late Dew) - Apr-May, 
  // Ilavenil (Early Summer) - Jun-Jul, Muduvenil (Late Summer) - Aug-Sep
  const season = 
    (month >= 11 || month <= 1) ? 'winter' :   // Kulir season
    (month >= 2 && month <= 3) ? 'spring' :    // Munpani season
    (month >= 4 && month <= 5) ? 'spring' :    // Pinpani season
    (month >= 6 && month <= 7) ? 'summer' :    // Ilavenil season
    (month >= 8 && month <= 9) ? 'summer' :    // Muduvenil season
    'fall';                                    // Kaar season (Oct)
  
  // Enhanced gradient overlays with regional touch (more vibrant for Tamil regions)
  const seasonalGradients = {
    winter: "linear-gradient(to bottom, rgba(220, 235, 255, 0.2), rgba(116, 171, 255, 0.25))",
    spring: "linear-gradient(to bottom, rgba(200, 255, 200, 0.15), rgba(140, 210, 110, 0.2))",
    summer: "linear-gradient(to bottom, rgba(255, 223, 100, 0.15), rgba(255, 168, 50, 0.25))",
    fall: "linear-gradient(to bottom, rgba(255, 200, 120, 0.15), rgba(200, 120, 50, 0.2))"
  };
  
  // More precise condition matching with temperature variations
  // This creates more nuanced photo selection based on multiple factors
  if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
    if (temperature > 30) {
      // Very hot sunny day
      photoCollection = [...sunnyPhotos.filter(p => p.temperature === undefined || p.temperature > 28)];
    } else if (temperature < 15) {
      // Cool sunny day
      photoCollection = [...sunnyPhotos.filter(p => p.temperature === undefined || p.temperature < 18)];
    } else {
      // Moderate sunny day
      photoCollection = [...sunnyPhotos];
    }
    // Add time-of-day specific photos
    if (!isDay) {
      // Night clear sky photos (if available)
      const nightPhotos = FALLBACK_PHOTOS.night?.filter(p => 
        p.condition?.includes('clear') || p.condition?.includes('night')) || [];
      photoCollection = [...photoCollection, ...nightPhotos];
    } else {
      photoCollection = [...photoCollection, ...FALLBACK_PHOTOS.sunny];
    }
  } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
    if (conditionLower.includes('heavy') || conditionLower.includes('thunder')) {
      // Heavy rain or thunderstorm
      photoCollection = [...rainyPhotos.filter(p => 
        p.alt.toLowerCase().includes('heavy') || 
        p.alt.toLowerCase().includes('thunder'))];
    } else if (conditionLower.includes('light') || conditionLower.includes('drizzle')) {
      // Light rain or drizzle
      photoCollection = [...rainyPhotos.filter(p => 
        p.alt.toLowerCase().includes('light') || 
        p.alt.toLowerCase().includes('drizzle'))];
    } else {
      // General rain
      photoCollection = [...rainyPhotos];
    }
    photoCollection = [...photoCollection, ...FALLBACK_PHOTOS.rainy];
  } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
    if (conditionLower.includes('part') || conditionLower.includes('scattered')) {
      // Partly cloudy
      photoCollection = [...cloudyPhotos.filter(p => 
        p.alt.toLowerCase().includes('part') || 
        p.alt.toLowerCase().includes('scattered'))];
    } else {
      // Mostly cloudy or overcast
      photoCollection = [...cloudyPhotos.filter(p => 
        p.alt.toLowerCase().includes('overcast') || 
        p.alt.toLowerCase().includes('heavy') ||
        !p.alt.toLowerCase().includes('part'))];
    }
    photoCollection = [...photoCollection, ...FALLBACK_PHOTOS.cloudy];
  } else if (conditionLower.includes('snow') || conditionLower.includes('sleet') || conditionLower.includes('ice')) {
    if (conditionLower.includes('heavy') || conditionLower.includes('blizzard')) {
      // Heavy snow
      photoCollection = [...snowyPhotos.filter(p => 
        p.alt.toLowerCase().includes('heavy') || 
        p.alt.toLowerCase().includes('blizzard'))];
    } else {
      // Light or moderate snow
      photoCollection = [...snowyPhotos];
    }
    photoCollection = [...photoCollection, ...FALLBACK_PHOTOS.winter.filter(p => p.url.includes('snow'))];
  } else if (conditionLower.includes('fog') || conditionLower.includes('mist') || conditionLower.includes('haze')) {
    photoCollection = [...foggyPhotos];
  } else {
    // Enhanced temperature-based selection with humidity consideration
    if (temperature >= 28) {
      // Very hot
      photoCollection = [...seasonalPhotos.filter(photo => photo.temperature && photo.temperature >= 25)];
      photoCollection = [...photoCollection, ...FALLBACK_PHOTOS.summer];
    } else if (temperature <= 5) {
      // Very cold
      photoCollection = [...seasonalPhotos.filter(photo => photo.temperature && photo.temperature <= 5)];
      photoCollection = [...photoCollection, ...FALLBACK_PHOTOS.winter];
    } else if (temperature > 5 && temperature < 15) {
      // Cool
      const isSpring = month >= 2 && month <= 4;
      if (isSpring) {
        photoCollection = [...seasonalPhotos.filter(photo => 
          (photo.temperature && photo.temperature > 5 && photo.temperature < 15) ||
          (photo.season === 'spring'))];
        photoCollection = [...photoCollection, ...FALLBACK_PHOTOS.spring];
      } else {
        photoCollection = [...seasonalPhotos.filter(photo => 
          (photo.temperature && photo.temperature > 5 && photo.temperature < 15) ||
          (photo.season === 'fall'))];
        photoCollection = [...photoCollection, ...FALLBACK_PHOTOS.fall];
      }
    } else if (temperature >= 15 && temperature < 28) {
      // Mild/Pleasant
      photoCollection = [...seasonalPhotos.filter(photo => 
        !photo.temperature || 
        (photo.temperature >= 15 && photo.temperature < 28))];
      photoCollection = [...photoCollection, ...FALLBACK_PHOTOS[season]];
    } else {
      photoCollection = [...FALLBACK_PHOTOS[season]];
    }
  }
  
  // If still no matches, use default photos
  if (photoCollection.length === 0) {
    photoCollection = [...FALLBACK_PHOTOS.default];
  }
  
  // Apply season tag and gradient overlay if not already present
  photoCollection = photoCollection.map(photo => {
    // Create a slighly random variation in the gradient for more visual interest
    const gradientAdjustment = Math.random() * 0.1;
    const seasonGradient = seasonalGradients[season as keyof typeof seasonalGradients];
    
    return {
      ...photo,
      season: photo.season || season,
      gradientOverlay: photo.gradientOverlay || seasonGradient,
      // Add a timestamp to ensure new images are loaded when conditions change
      url: photo.url.includes('?') ? photo.url : `${photo.url}?t=${Date.now()}`
    };
  });
  
  // Get a better random distribution using prime number based selection
  // This helps avoid repetitive patterns in the random selection
  const prime = 31;
  const secondsPastHour = new Date().getMinutes() * 60 + new Date().getSeconds();
  const adjustedIndex = (secondsPastHour * prime) % photoCollection.length;
  return photoCollection[adjustedIndex];
}

// All photos combined (useful for location gallery)
export const allWeatherPhotos: WeatherPhoto[] = [
  ...sunnyPhotos,
  ...rainyPhotos,
  ...cloudyPhotos,
  ...snowyPhotos,
  ...foggyPhotos,
  ...seasonalPhotos,
];

// Get random selection of weather photos
export function getRandomWeatherPhotos(count: number = 5): WeatherPhoto[] {
  const shuffled = [...allWeatherPhotos].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}