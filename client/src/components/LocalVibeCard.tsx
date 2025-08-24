import { FC } from "react";
import { Utensils, MapPin, CalendarDays } from "lucide-react";

interface Recommendation {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface CityContent {
  city: string;
  emoji: string;
  title: string;
  description: string;
  recommendations: Recommendation[];
  image: string;
}

interface LocalVibeCardProps {
  weather: any;
}

const LocalVibeCard: FC<LocalVibeCardProps> = ({ weather }) => {
  const location = weather.location;
  const condition = weather.current.condition.text;
  const temperature = Math.round(weather.current.temp_c);
  
  // Generate location-specific content based on the city
  const getCitySpecificContent = () => {
    const city = location.name;
    
    // Object mapping cities to their specific content
    const cityContent: Record<string, CityContent> = {
      "Los Angeles": {
        city: "Los Angeles",
        emoji: "🌴",
        title: `${condition} in LA?`,
        description: "Perfect for a stroll down Santa Monica or grabbing coffee on Abbot Kinney!",
        recommendations: [
          { 
            icon: <Utensils className="text-primary-dark" />,
            title: "Local Recommendation",
            description: "Try outdoor dining at Grand Central Market today!"
          },
          { 
            icon: <MapPin className="text-primary-dark" />,
            title: "Popular Today",
            description: "Griffith Observatory - clear views expected this afternoon"
          },
          { 
            icon: <CalendarDays className="text-primary-dark" />,
            title: "Local Event",
            description: "Farmers Market at The Grove - open until 2pm"
          }
        ],
        image: "https://images.unsplash.com/photo-1556715371-bdb0d523c870?w=800&auto=format&fit=crop&q=80"
      },
      "New York": {
        city: "New York",
        emoji: "🗽",
        title: `${condition} in NYC?`,
        description: "Great day to explore Central Park or visit a museum!",
        recommendations: [
          { 
            icon: <Utensils className="text-primary-dark" />,
            title: "Local Recommendation",
            description: "Try the food vendors at Chelsea Market today!"
          },
          { 
            icon: <MapPin className="text-primary-dark" />,
            title: "Popular Today",
            description: "Top of the Rock - best time for photos is late afternoon"
          },
          { 
            icon: <CalendarDays className="text-primary-dark" />,
            title: "Local Event",
            description: "Art exhibition at MoMA - special hours until 8pm"
          }
        ],
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&auto=format&fit=crop&q=80"
      },
      "London": {
        city: "London",
        emoji: "☂️",
        title: `${condition} in London?`,
        description: "Perfect weather to visit museums or enjoy a proper English tea!",
        recommendations: [
          { 
            icon: <Utensils className="text-primary-dark" />,
            title: "Local Recommendation",
            description: "Borough Market has excellent food stalls open today"
          },
          { 
            icon: <MapPin className="text-primary-dark" />,
            title: "Popular Today",
            description: "The British Museum - free entry and less crowded mornings"
          },
          { 
            icon: <CalendarDays className="text-primary-dark" />,
            title: "Local Event",
            description: "Live music at Covent Garden this afternoon"
          }
        ],
        image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&auto=format&fit=crop&q=80"
      }
    };
    
    // Default content if city not found in our mapping
    const defaultContent: CityContent = {
      city: city,
      emoji: "🌍",
      title: `${condition} in ${city}?`,
      description: `Enjoy the ${temperature < 15 ? "cool" : "warm"} weather with local activities!`,
      recommendations: [
        { 
          icon: <Utensils className="text-primary-dark" />,
          title: "Local Recommendation",
          description: "Try visiting a local café or restaurant today"
        },
        { 
          icon: <MapPin className="text-primary-dark" />,
          title: "Popular Today",
          description: "Explore downtown areas and local attractions"
        },
        { 
          icon: <CalendarDays className="text-primary-dark" />,
          title: "Local Tip",
          description: "Check local event listings for activities today"
        }
      ],
      image: "https://images.unsplash.com/photo-1548263594-a71ea65a8598?w=800&auto=format&fit=crop&q=80"
    };
    
    return cityContent[city] || defaultContent;
  };
  
  const cityContent = getCitySpecificContent();
  
  return (
    <div className="glass rounded-xl shadow-elevation overflow-hidden h-full">
      <div className="relative h-48 overflow-hidden">
        {/* Background Image */}
        <img 
          src={cityContent.image} 
          alt={`${cityContent.city} vibe`}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        
        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-xl font-bold text-white mb-2">{cityContent.city}</h3>
          <p className="text-slate-200">Local insights for your day</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3">Today's Vibe</h4>
          <p className="text-slate-400">{cityContent.description}</p>
        </div>
        
        <div className="space-y-4">
          <h5 className="text-md font-medium text-white">Recommendations</h5>
          {cityContent.recommendations.map((rec, index) => (
            <div key={index} className="glass-dark rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{rec.icon}</div>
                <div>
                  <h6 className="font-medium text-white">{rec.title}</h6>
                  <p className="text-sm text-slate-400">{rec.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocalVibeCard;
