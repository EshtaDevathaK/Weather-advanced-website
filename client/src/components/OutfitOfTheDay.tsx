import { FC, useState, useEffect } from "react";
import { Info, Umbrella, Sun, Snowflake, Wind, Cloud, Moon, Flower, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface OutfitOfTheDayProps {
  weather: any;
}

interface OutfitRecommendation {
  top: string;
  bottom: string;
  outer: string;
  footwear: string;
  extras: string;
  seasonIcon: React.ReactNode;
  seasonName: string;
  colorScheme: string;
  traditionalWear?: string;
  seasonEmoji?: string;
  festivalNote?: string;
}

const OutfitOfTheDay: FC<OutfitOfTheDayProps> = ({ weather }) => {
  const [seasonalOutfit, setSeasonalOutfit] = useState<OutfitRecommendation | null>(null);
  
  // Define outfit items and weather tips
  const outfitItems = [
    { icon: "👕", name: "Top", description: seasonalOutfit?.top || "T-shirt" },
    { icon: "👖", name: "Bottom", description: seasonalOutfit?.bottom || "Jeans" },
    { icon: "🧥", name: "Outer", description: seasonalOutfit?.outer || "Jacket" },
    { icon: "👟", name: "Footwear", description: seasonalOutfit?.footwear || "Shoes" }
  ];
  
  const weatherTips = [
    { icon: "☀️", text: "Wear sunscreen if going outside" },
    { icon: "🌧️", text: "Bring an umbrella just in case" },
    { icon: "🌡️", text: "Layer up for changing temperatures" }
  ];
  
  useEffect(() => {
    if (!weather || !weather.current) return;
    
    const current = weather.current;
    const condition = current.condition.text;
    const temperature = Math.round(current.temp_c);
    const isDay = current.is_day === 1;
    const month = new Date().getMonth(); // 0-11, January is 0
    const humidity = current.humidity;
    
    // Set seasonal outfit based on current weather
    setSeasonalOutfit(getOutfitRecommendations(temperature, condition, isDay, month, humidity));
  }, [weather]);
  
  // Get outfit recommendations based on temperature, conditions, and time of year
  const getOutfitRecommendations = (
    temperature: number, 
    condition: string, 
    isDay: boolean,
    month: number,
    humidity: number
  ): OutfitRecommendation => {
    // Weather condition checks
    const isRainy = condition.toLowerCase().includes("rain") || 
                   condition.toLowerCase().includes("drizzle") || 
                   condition.toLowerCase().includes("shower");
    
    const isSnowy = condition.toLowerCase().includes("snow") || 
                   condition.toLowerCase().includes("sleet") || 
                   condition.toLowerCase().includes("blizzard");
    
    const isCloudy = condition.toLowerCase().includes("cloud") ||
                     condition.toLowerCase().includes("overcast");
    
    const isClear = condition.toLowerCase().includes("clear") ||
                    condition.toLowerCase().includes("sunny");
    
    const isWindy = weather.current.wind_kph > 30;
    const isHumid = humidity > 70;
    
    // Season determination (Northern Hemisphere)
    const isWinter = month === 11 || month <= 1;  // Dec-Feb
    const isSpring = month >= 2 && month <= 4;    // Mar-May
    const isSummer = month >= 5 && month <= 7;    // Jun-Aug
    const isFall = month >= 8 && month <= 10;     // Sep-Nov
    
    // Combined conditions for more specific outfit recommendations
    
    // Winter outfits
    if (isWinter || temperature < 5) {
      if (isSnowy) {
        return {
          top: "Thermal undershirt, heavy sweater",
          bottom: "Thermal leggings, snow pants",
          outer: "Insulated snow jacket, scarf, gloves, beanie",
          footwear: "Waterproof insulated snow boots",
          extras: "Hand warmers and thermal socks recommended",
          seasonIcon: <Snowflake className="h-5 w-5 text-blue-400" />,
          seasonName: "Winter Snow",
          colorScheme: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        };
      }
      
      if (isRainy) {
        return {
          top: "Wool or fleece sweater, thermal layer",
          bottom: "Waterproof pants or jeans with thermal lining",
          outer: "Waterproof winter coat, hat, gloves",
          footwear: "Waterproof insulated boots",
          extras: "Umbrella and water-resistant bag recommended",
          seasonIcon: <Umbrella className="h-5 w-5 text-blue-500" />,
          seasonName: "Winter Rain",
          colorScheme: "bg-gradient-to-br from-blue-50 to-indigo-100 border-indigo-200"
        };
      }
      
      if (isWindy) {
        return {
          top: "Turtleneck sweater, thermal undershirt",
          bottom: "Insulated pants or thick jeans",
          outer: "Windproof winter jacket, scarf wrapped to cover face",
          footwear: "Insulated boots with good traction",
          extras: "Wrap-around earmuffs and wind-resistant gloves",
          seasonIcon: <Wind className="h-5 w-5 text-slate-500" />,
          seasonName: "Winter Wind",
          colorScheme: "bg-gradient-to-br from-slate-50 to-slate-200 border-slate-300"
        };
      }
      
      // Default winter
      return {
        top: "Thermal or wool base layer, heavy sweater",
        bottom: "Thick jeans or wool pants",
        outer: "Insulated winter coat, scarf, gloves, hat",
        footwear: "Insulated winter boots",
        extras: "Consider layering for better temperature control",
        seasonIcon: <Snowflake className="h-5 w-5 text-blue-500" />,
        seasonName: "Tamil Winter",
        colorScheme: "bg-gradient-to-br from-blue-50 to-indigo-100 border-indigo-200",
        traditionalWear: "Woolen angavastram for men, thick silk sarees with shawls for women",
        seasonEmoji: "❄️",
        festivalNote: "Traditional Pongal and Margazhi season attire for celebrations"
      };
    }
    
    // Spring outfits
    if (isSpring || (temperature >= 5 && temperature < 20)) {
      if (isRainy) {
        return {
          top: "Light sweater or long-sleeve shirt",
          bottom: "Water-resistant pants or jeans",
          outer: "Waterproof rain jacket with hood",
          footwear: "Waterproof shoes or rain boots",
          extras: "Compact umbrella and waterproof bag",
          seasonIcon: <Umbrella className="h-5 w-5 text-emerald-500" />,
          seasonName: "Spring Shower",
          colorScheme: "bg-gradient-to-br from-emerald-50 to-green-100 border-green-200"
        };
      }
      
      if (isCloudy) {
        return {
          top: "Long-sleeve shirt or light sweater",
          bottom: "Chinos or light jeans",
          outer: "Light jacket or cardigan",
          footwear: "Comfortable sneakers or loafers",
          extras: "A light scarf can add warmth if needed",
          seasonIcon: <Cloud className="h-5 w-5 text-slate-400" />,
          seasonName: "Spring Clouds",
          colorScheme: "bg-gradient-to-br from-slate-50 to-emerald-100 border-emerald-200"
        };
      }
      
      if (isClear) {
        return {
          top: "T-shirt or light long-sleeve shirt",
          bottom: "Light pants, jeans, or skirt",
          outer: "Light jacket or cardigan for morning/evening",
          footwear: "Comfortable walking shoes or loafers",
          extras: "Sunglasses and light sunscreen recommended",
          seasonIcon: <Sun className="h-5 w-5 text-amber-400" />,
          seasonName: "Spring Sunshine",
          colorScheme: "bg-gradient-to-br from-amber-50 to-emerald-100 border-emerald-200"
        };
      }
      
      // Default spring
      return {
        top: "Light sweater or long-sleeve shirt",
        bottom: "Jeans or casual pants",
        outer: "Light jacket (for morning/evening)",
        footwear: "Casual sneakers or loafers",
        extras: "Layer clothes for changing temperatures throughout the day",
        seasonIcon: <Sun className="h-5 w-5 text-emerald-500" />,
        seasonName: "Tamil Spring",
        colorScheme: "bg-gradient-to-br from-emerald-50 to-green-100 border-green-200",
        traditionalWear: "Light silk veshti for men, pastel cotton-silk mix sarees for women",
        seasonEmoji: "🌿",
        festivalNote: "Perfect for Tamil New Year (Puthandu) celebrations with vibrant traditional attire"
      };
    }
    
    // Summer outfits
    if (isSummer || temperature >= 25) {
      if (isRainy) {
        return {
          top: "Lightweight, quick-dry t-shirt",
          bottom: "Quick-dry shorts or light pants",
          outer: "Lightweight waterproof jacket or compact rain poncho",
          footwear: "Water-resistant sandals or breathable shoes",
          extras: "Small umbrella and waterproof phone case",
          seasonIcon: <Umbrella className="h-5 w-5 text-sky-500" />,
          seasonName: "Summer Rain",
          colorScheme: "bg-gradient-to-br from-sky-50 to-cyan-100 border-cyan-200",
          traditionalWear: "Cotton saree or dhoti for comfort with rain protection",
          seasonEmoji: "☔",
          festivalNote: "Consider traditional Aadi month celebrations with comfortable clothing"
        };
      }
      
      if (isHumid && temperature > 28) {
        return {
          top: "Loose, breathable cotton or linen shirt",
          bottom: "Lightweight, loose-fitting shorts or skirt",
          outer: "None (or ultralight shawl for air conditioning)",
          footwear: "Open sandals or breathable footwear",
          extras: "Portable fan, cooling towel, and extra water bottle",
          seasonIcon: <Sun className="h-5 w-5 text-orange-500" />,
          seasonName: "Hot & Humid Summer",
          colorScheme: "bg-gradient-to-br from-orange-50 to-red-100 border-red-200",
          traditionalWear: "Light cotton veshti (dhoti) for men, cotton saree or pavadai for women",
          seasonEmoji: "☀️",
          festivalNote: "Perfect for Tamil summer festivals like Pongal with traditional attire"
        };
      }
      
      if (isClear && temperature > 30) {
        return {
          top: "Loose-fitting tank top or light t-shirt",
          bottom: "Light shorts or skirt, preferably in light colors",
          outer: "None (keep a light cover-up for shade)",
          footwear: "Sandals or breathable shoes",
          extras: "Wide-brimmed hat, high-SPF sunscreen, and sunglasses",
          seasonIcon: <Sun className="h-5 w-5 text-orange-500" />,
          seasonName: "Hot Summer Day",
          colorScheme: "bg-gradient-to-br from-orange-50 to-amber-100 border-amber-200",
          traditionalWear: "White cotton veshti and angavastram for men, cotton Chettinad saree for women",
          seasonEmoji: "🔆",
          festivalNote: "Consider light-colored traditional clothing for outdoor temple visits"
        };
      }
      
      // Default summer
      return {
        top: "T-shirt or short-sleeve shirt",
        bottom: "Shorts, light skirt, or lightweight pants",
        outer: "Light summer jacket or cardigan for evening",
        footwear: "Sandals, light sneakers, or breathable shoes",
        extras: "Sunglasses, hat, and sunscreen recommended",
        seasonIcon: <Sun className="h-5 w-5 text-amber-500" />,
        seasonName: "Tamil Summer",
        colorScheme: "bg-gradient-to-br from-amber-50 to-yellow-100 border-yellow-200",
        traditionalWear: "Light cotton veshti (dhoti) for men, cotton sarees or salwar for women",
        seasonEmoji: "☀️",
        festivalNote: "Perfect for summer festivals with bright, airy traditional clothing"
      };
    }
    
    // Fall outfits
    if (isFall || (temperature >= 10 && temperature < 25)) {
      if (isRainy) {
        return {
          top: "Long-sleeve shirt or light sweater",
          bottom: "Water-resistant pants or jeans",
          outer: "Waterproof jacket or trench coat",
          footwear: "Waterproof ankle boots or shoes",
          extras: "Umbrella and water-resistant bag recommended",
          seasonIcon: <Umbrella className="h-5 w-5 text-orange-500" />,
          seasonName: "Fall Rain",
          colorScheme: "bg-gradient-to-br from-orange-50 to-amber-100 border-amber-200"
        };
      }
      
      if (isWindy) {
        return {
          top: "Layered shirts or medium-weight sweater",
          bottom: "Jeans or medium-weight pants",
          outer: "Windproof jacket or coat, light scarf",
          footwear: "Closed shoes with good traction",
          extras: "Hat that won't blow away easily",
          seasonIcon: <Wind className="h-5 w-5 text-orange-400" />,
          seasonName: "Fall Wind",
          colorScheme: "bg-gradient-to-br from-orange-50 to-amber-100 border-amber-200"
        };
      }
      
      if (isClear && temperature < 15) {
        return {
          top: "Layered long-sleeve shirt and light sweater",
          bottom: "Jeans or medium-weight pants",
          outer: "Light fall jacket or medium coat",
          footwear: "Leather shoes or ankle boots",
          extras: "Light gloves for cooler mornings",
          seasonIcon: <Sun className="h-5 w-5 text-amber-400" />,
          seasonName: "Crisp Fall Day",
          colorScheme: "bg-gradient-to-br from-amber-50 to-orange-100 border-orange-200"
        };
      }
      
      // Default fall
      return {
        top: "Long-sleeve shirt or light sweater",
        bottom: "Jeans or medium-weight pants",
        outer: "Light jacket or medium coat",
        footwear: "Casual closed shoes or lightweight boots",
        extras: "Layer clothes to adjust for temperature changes",
        seasonIcon: <Cloud className="h-5 w-5 text-orange-400" />,
        seasonName: "Tamil Fall",
        colorScheme: "bg-gradient-to-br from-orange-50 to-amber-100 border-amber-200",
        traditionalWear: "Medium weight angavastram for men, silk-cotton blend sarees with light shawl for women",
        seasonEmoji: "🍂",
        festivalNote: "Ideal for Navarathri and other harvest festival celebrations"
      };
    }
    
    // Night-time adjustments - add an extra layer for evening
    if (!isDay && temperature < 20) {
      return {
        top: "Long-sleeve shirt or light sweater",
        bottom: "Jeans or casual pants",
        outer: "Medium jacket or coat depending on temperature",
        footwear: "Closed shoes or boots",
        extras: "Consider a scarf or light gloves if it's breezy",
        seasonIcon: <Moon className="h-5 w-5 text-indigo-400" />,
        seasonName: "Tamil Evening",
        colorScheme: "bg-gradient-to-br from-indigo-50 to-purple-100 border-purple-200",
        traditionalWear: "Light shawl with traditional clothing for temple visits or evening events",
        seasonEmoji: "🌙",
        festivalNote: "Perfect for evening cultural programs and musical events"
      };
    }
    
    // Default outfit if no specific conditions match
    return {
      top: "T-shirt or short-sleeve shirt",
      bottom: "Jeans, pants, or skirt based on temperature",
      outer: temperature < 20 ? "Light jacket or sweater" : "None needed",
      footwear: "Comfortable shoes appropriate for the weather",
      extras: "Check forecast for changing conditions",
      seasonIcon: <Sun className="h-5 w-5 text-amber-400" />,
      seasonName: "Tamil Everyday",
      colorScheme: "bg-gradient-to-br from-blue-50 to-indigo-100 border-indigo-200",
      traditionalWear: "Casual cotton veshti or lungi for men, lightweight cotton churidar or cotton saree for women",
      seasonEmoji: "✨",
      festivalNote: "Suitable for daily activities and casual cultural events"
    };
  };
  
  if (!seasonalOutfit) {
    return (
      <div className="bg-white rounded-xl shadow-soft p-4 md:p-6 h-full animate-pulse">
        <h2 className="font-heading text-xl font-semibold text-navy mb-4">Outfit of the Day</h2>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }
  
  return (
    <div className="glass rounded-xl shadow-elevation p-4 md:p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Outfit of the Day</h3>
        <div className="text-2xl">👕</div>
      </div>

      {/* Outfit Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {outfitItems.map((item, index) => (
          <div key={index} className="glass-dark rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="text-sm font-medium text-white">{item.name}</div>
            <div className="text-xs text-slate-400">{item.description}</div>
          </div>
        ))}
      </div>

      {/* Weather Tips */}
      <div className="glass-dark rounded-lg p-4 mb-6">
        <h5 className="text-sm font-medium text-white mb-3">Weather Tips</h5>
        <div className="space-y-2">
          {weatherTips.map((tip, index) => (
            <div key={index} className="flex items-center p-2 glass rounded-lg">
              <div className="text-sm text-slate-400 mt-auto">
                {tip.icon} {tip.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accessories */}
      <div className="glass-dark rounded-lg p-4">
        <h5 className="text-sm font-medium text-white mb-3">Accessories</h5>
        <div className="flex items-center p-2 glass rounded-lg mb-2">
          <div className="text-sm text-slate-400 mt-auto">
            🧢 Baseball cap for sun protection
          </div>
        </div>
        <div className="flex items-center p-2 glass rounded-lg mt-2 border border-blue-500/20">
          <div className="text-sm text-slate-400 mt-auto">
            🕶️ Sunglasses for bright conditions
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitOfTheDay;
