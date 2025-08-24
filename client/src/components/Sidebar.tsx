import { FC, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Cloud, 
  MapPin, 
  BarChart2, 
  CalendarDays, 
  Menu,
  X,
  Sun,
  Moon
} from "lucide-react";

const Sidebar: FC = () => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Check for mobile view on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { icon: Home, label: "Home", path: "/", description: "Current weather & mood" },
    { icon: Cloud, label: "Forecast", path: "/forecast", description: "Extended forecast" },
    { icon: MapPin, label: "Locations", path: "/locations", description: "Manage locations" },
    { icon: BarChart2, label: "Analytics", path: "/analytics", description: "Weather insights" },
    { icon: CalendarDays, label: "Calendar", path: "/calendar", description: "Weather calendar" },
  ];

  return (
    <>
      {/* Mobile Menu Toggle */}
      {isMobileView && (
        <button 
          className="fixed top-4 left-4 z-50 glass-dark p-3 rounded-full shadow-elevation text-white hover-lift transition-all" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      )}
      
      {/* Sidebar - Desktop version */}
      <aside 
        className={`
          glass-dark fixed md:static top-0 left-0 h-full z-40
          ${isMobileView ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          transition-transform duration-300 ease-in-out
          w-64 md:w-48 lg:w-60 md:min-h-screen py-6 md:py-8 px-4 md:px-6 flex flex-col
          border-r border-white/10
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center space-x-3 mb-10 mt-12 md:mt-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Cloud className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-heading font-bold text-xl">WeatherMood</h1>
            <p className="text-white/60 text-xs">Your weather companion</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col w-full space-y-2 flex-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`group flex items-center space-x-3 ${
                location === item.path 
                  ? "text-white bg-white/20 backdrop-blur-sm shadow-glow" 
                  : "text-white/70 hover:text-white hover:bg-white/10"
              } transition-all duration-300 rounded-xl px-4 py-3 w-full hover-lift`}
            >
              <div className={`p-2 rounded-lg ${
                location === item.path 
                  ? "bg-white/20" 
                  : "bg-white/10 group-hover:bg-white/20"
              } transition-all duration-300`}>
                <item.icon className="h-5 w-5 flex-shrink-0" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-semibold">{item.label}</span>
                <p className="text-xs text-white/50 hidden lg:block">{item.description}</p>
              </div>
            </Link>
          ))}
        </nav>
        
        {/* Bottom Section */}
        <div className="mt-auto space-y-4">
          {/* Current Location */}
          <div className="glass rounded-xl p-4">
            <div className="text-xs text-white/60 mb-2 font-medium">📍 Default location</div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-yellow-300" />
              <span className="text-white text-sm font-medium truncate">Your Location</span>
            </div>
          </div>
          
          {/* Theme Toggle */}
          <div className="glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60 font-medium">Theme</span>
              <div className="text-xs text-white/80 font-medium capitalize">
                Light
              </div>
            </div>
          </div>
          
          {/* App Version */}
          <div className="text-center">
            <p className="text-xs text-white/40">v2.0.0 • WeatherMood</p>
          </div>
        </div>
      </aside>
      
      {/* Mobile Overlay */}
      {isMobileView && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
