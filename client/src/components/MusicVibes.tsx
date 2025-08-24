import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, ExternalLink, Play, ListMusic, Shuffle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface MusicVibesProps {
  weather: any;
}

export interface PlaylistTrack {
  title: string;
  artist: string;
  duration: string;
  spotifyUrl: string; // We'll keep the property name but use it for JioSaavn links
}

// Define Tamil playlists based on weather conditions with JioSaavn links
const TAMIL_WEATHER_PLAYLISTS: Record<string, {
  title: string;
  mood: string;
  spotifyId: string; // Kept for compatibility
  description: string;
  tracks: PlaylistTrack[];
}> = {
  'sunny': {
    title: 'Tamil Sunny Day Vibes',
    mood: 'Upbeat & Energetic',
    spotifyId: '37i9dQZF1DX3vqmcY7rbTP',
    description: 'Cheerful Tamil tracks perfect for a bright sunny day.',
    tracks: [
      { title: 'Mallipoo', artist: 'A.R. Rahman, Shweta Mohan', duration: '4:25', spotifyUrl: 'https://www.jiosaavn.com/song/mallipoo/RT8zfBh9eHw' },
      { title: 'Maruvaarthai', artist: 'Sid Sriram', duration: '4:47', spotifyUrl: 'https://www.jiosaavn.com/song/maruvaarthai/PV8GWBNpZmM' },
      { title: 'Kannaana Kanne', artist: 'D. Imman, Sid Sriram', duration: '5:35', spotifyUrl: 'https://www.jiosaavn.com/song/kannaana-kanne/Ow9pcCZIZGQ' }
    ]
  },
  'rain': {
    title: 'Tamil Rainy Day Melodies',
    mood: 'Mellow & Romantic',
    spotifyId: '37i9dQZF1DWYpC2SRwVMtZ',
    description: 'Soothing Tamil songs that pair perfectly with raindrops.',
    tracks: [
      { title: 'Mazhai Kuruvi', artist: 'A.R. Rahman, Shreya Ghoshal', duration: '5:42', spotifyUrl: 'https://www.jiosaavn.com/song/mazhai-kuruvi/Fi8zfz5TfVI' },
      { title: 'Nenjukkul Peidhidum', artist: 'Harris Jayaraj, Hariharan', duration: '5:02', spotifyUrl: 'https://www.jiosaavn.com/song/nenjukkul-peidhidum/KD8pfhJpfHo' },
      { title: 'Megamo Aval', artist: 'Govind Vasantha, Chinmayi', duration: '3:57', spotifyUrl: 'https://www.jiosaavn.com/song/megamo-aval/OCY-fERVdVE' }
    ]
  },
  'cloudy': {
    title: 'Tamil Cloudy Day Melodies',
    mood: 'Thoughtful & Calm',
    spotifyId: '37i9dQZF1DX4nA6pD5Wm1p',
    description: 'Soothing Tamil tracks for overcast, thoughtful days.',
    tracks: [
      { title: 'Uyire', artist: 'A.R. Rahman, Hariharan', duration: '5:15', spotifyUrl: 'https://www.jiosaavn.com/song/uyire/Kjs0dApDX3A' },
      { title: 'Unna Nenachu', artist: 'Govind Vasantha, Sid Sriram', duration: '3:48', spotifyUrl: 'https://www.jiosaavn.com/song/unna-nenachu/OCcLBQJ,fEk' },
      { title: 'Kaadhal En Kaviye', artist: 'Sid Sriram', duration: '4:05', spotifyUrl: 'https://www.jiosaavn.com/song/kaadhal-en-kaviye/LgQ5chN3bmw' }
    ]
  },
  'clear': {
    title: 'Tamil Clear Skies Music',
    mood: 'Fresh & Uplifting',
    spotifyId: '37i9dQZF1DXa2PjuCvZ7it',
    description: 'Uplifting Tamil tracks for days with crystal clear skies.',
    tracks: [
      { title: 'Rowdy Baby', artist: 'Dhanush, Dhee', duration: '3:42', spotifyUrl: 'https://www.jiosaavn.com/song/rowdy-baby/JV8Tf09Ud0U' },
      { title: 'Vaathi Coming', artist: 'Anirudh Ravichander', duration: '3:55', spotifyUrl: 'https://www.jiosaavn.com/song/vaathi-coming/KjQ6eQNoBHI' },
      { title: 'Aalaporan Thamizhan', artist: 'A.R. Rahman', duration: '5:01', spotifyUrl: 'https://www.jiosaavn.com/song/aalaporan-thamizhan/Bg8pcExHU0g' }
    ]
  },
  'thunderstorm': {
    title: 'Tamil Storm Intensity',
    mood: 'Dramatic & Powerful',
    spotifyId: '37i9dQZF1DX7T5WTGg8L5C',
    description: 'Powerful Tamil tracks that match the intensity of a storm.',
    tracks: [
      { title: 'Danga Danga', artist: 'Vijay, Anirudh Ravichander', duration: '3:32', spotifyUrl: 'https://www.jiosaavn.com/song/danga-danga/P1YGdERYVHA' },
      { title: 'Aaruyire', artist: 'Harris Jayaraj', duration: '5:46', spotifyUrl: 'https://www.jiosaavn.com/song/aaruyire/HQ8iR0NnUlQ' },
      { title: 'Adiye', artist: 'G.V. Prakash Kumar', duration: '4:19', spotifyUrl: 'https://www.jiosaavn.com/song/adiyae/OzsPeyRqVm4' }
    ]
  },
  'fog': {
    title: 'Tamil Misty Morning Tunes',
    mood: 'Mysterious & Ethereal',
    spotifyId: '37i9dQZF1DX5TLaQDnVaiH',
    description: 'Atmospheric Tamil music for foggy, misty days.',
    tracks: [
      { title: 'Nenjame', artist: 'Yuvan Shankar Raja', duration: '5:22', spotifyUrl: 'https://www.jiosaavn.com/song/nenjame/MT0wHix-fXw' },
      { title: 'Aagaya Vennilave', artist: 'Karthik', duration: '5:34', spotifyUrl: 'https://www.jiosaavn.com/song/aagaya-vennilavae/HSIfVRRoWnA' },
      { title: 'Thalli Pogathey', artist: 'A.R. Rahman, Sid Sriram', duration: '5:13', spotifyUrl: 'https://www.jiosaavn.com/song/thalli-pogathey/NCw9dkFaZ2Y' }
    ]
  },
  'hot': {
    title: 'Tamil Summer Heat Playlist',
    mood: 'Energetic & Vibrant',
    spotifyId: '37i9dQZF1DX6VdMW310pXC',
    description: 'High-energy Tamil tracks for hot summer days.',
    tracks: [
      { title: 'Udhungada Sangu', artist: 'Anirudh Ravichander', duration: '3:26', spotifyUrl: 'https://www.jiosaavn.com/song/udhungada-sangu/PRUcey5YW2g' },
      { title: 'Ethir Neechal', artist: 'Anirudh Ravichander, Hiphop Tamizha', duration: '3:42', spotifyUrl: 'https://www.jiosaavn.com/song/ethir-neechal/NCgiWwR6Z0c' },
      { title: 'Arabic Kuthu', artist: 'Anirudh Ravichander', duration: '4:14', spotifyUrl: 'https://www.jiosaavn.com/song/arabic-kuthu/OwN7fDl5dnY' }
    ]
  },
  'cold': {
    title: 'Tamil Cold Day Warmth',
    mood: 'Comforting & Warm',
    spotifyId: '37i9dQZF1DX7vqqgeLlrLh',
    description: 'Soothing Tamil melodies to warm you on a cold day.',
    tracks: [
      { title: 'Malargal Kaettaen', artist: 'A.R. Rahman', duration: '5:11', spotifyUrl: 'https://www.jiosaavn.com/song/malargal-kaettaen/NCoeXRh,azY' },
      { title: 'Un Paarvaiyil', artist: 'Yuvan Shankar Raja', duration: '5:43', spotifyUrl: 'https://www.jiosaavn.com/song/un-paarvaiyil/NBEfBkdaVmI' },
      { title: 'Achcham Enbadhu Madamaiyada', artist: 'A.R. Rahman', duration: '4:23', spotifyUrl: 'https://www.jiosaavn.com/song/achcham-enbadhu-madamaiyada/HAUAShsaAUA' }
    ]
  },
  'windy': {
    title: 'Tamil Windswept Melodies',
    mood: 'Free & Flowing',
    spotifyId: '37i9dQZF1DX2taNm2KsnLZ',
    description: 'Tamil songs that capture the feeling of the wind.',
    tracks: [
      { title: 'Venmegam', artist: 'Harris Jayaraj', duration: '5:32', spotifyUrl: 'https://www.jiosaavn.com/song/venmegam/NSEKVS5-RG4' },
      { title: 'Uyirin Uyire', artist: 'A.R. Rahman, Hariharan', duration: '5:55', spotifyUrl: 'https://www.jiosaavn.com/song/uyirin-uyire/RgQpcC1,fFg' },
      { title: 'Vaseegara', artist: 'Harris Jayaraj', duration: '6:23', spotifyUrl: 'https://www.jiosaavn.com/song/vaseegara/B10GcS99Z1c' }
    ]
  },
  'default': {
    title: 'Tamil Weather Mood Mix',
    mood: 'Balanced & Pleasant',
    spotifyId: '37i9dQZF1DX6XE7HRLM75P',
    description: 'A well-balanced mix of Tamil songs for any weather.',
    tracks: [
      { title: 'Munbe Vaa', artist: 'A.R. Rahman, Shreya Ghoshal', duration: '5:07', spotifyUrl: 'https://www.jiosaavn.com/song/munbe-vaa/N14iZS5CfXA' },
      { title: 'Nee Paartha Vizhigal', artist: 'Sid Sriram', duration: '4:48', spotifyUrl: 'https://www.jiosaavn.com/song/nee-paartha-vizhigal/PRw-fyZ,c3E' },
      { title: 'Kannana Kanne', artist: 'Sid Sriram', duration: '5:35', spotifyUrl: 'https://www.jiosaavn.com/song/kannaana-kanne/Ow9pcCZIZGQ' }
    ]
  }
};

// Define playlists based on weather conditions (backup/original)
const WEATHER_PLAYLISTS: Record<string, {
  title: string;
  mood: string;
  spotifyId: string;
  description: string;
  tracks: PlaylistTrack[];
}> = {
  'sunny': {
    title: 'Sunny Day Vibes',
    mood: 'Upbeat & Energetic',
    spotifyId: '37i9dQZF1DX6ALfRKlHn1t',
    description: 'Bright, cheerful tunes perfect for a sunny day outside.',
    tracks: [
      { title: 'Walking On Sunshine', artist: 'Katrina & The Waves', duration: '3:58', spotifyUrl: 'https://www.jiosaavn.com/song/walking-on-sunshine/A15jeUtHYVA' },
      { title: 'Good Vibrations', artist: 'The Beach Boys', duration: '3:39', spotifyUrl: 'https://www.jiosaavn.com/song/good-vibrations/KDwKSRhpGHo' },
      { title: 'Island In The Sun', artist: 'Weezer', duration: '3:20', spotifyUrl: 'https://www.jiosaavn.com/song/island-in-the-sun/Ow9pcE05YmA' },
      { title: 'Here Comes The Sun', artist: 'The Beatles', duration: '3:05', spotifyUrl: 'https://www.jiosaavn.com/song/here-comes-the-sun/JAYaRzFna3g' },
      { title: 'Good Day Sunshine', artist: 'The Beatles', duration: '2:10', spotifyUrl: 'https://www.jiosaavn.com/song/good-day-sunshine/FVoiYCh,VUE' }
    ]
  },
  'rain': {
    title: 'Rainy Day Playlist',
    mood: 'Mellow & Reflective',
    spotifyId: '37i9dQZF1DXbvABJXBIyiY',
    description: 'Calm, introspective songs that pair perfectly with raindrops.',
    tracks: [
      { title: 'Riders on the Storm', artist: 'The Doors', duration: '7:14', spotifyUrl: 'https://www.jiosaavn.com/song/riders-on-the-storm/HlUGfhV0dVk' },
      { title: 'Set Fire to the Rain', artist: 'Adele', duration: '4:01', spotifyUrl: 'https://www.jiosaavn.com/song/set-fire-to-the-rain/Kls9RxZVYWA' },
      { title: 'Rain', artist: 'The Beatles', duration: '3:02', spotifyUrl: 'https://www.jiosaavn.com/song/rain/IwszcSF5RHY' },
      { title: 'November Rain', artist: 'Guns N\' Roses', duration: '8:57', spotifyUrl: 'https://www.jiosaavn.com/song/november-rain/RT8zfCp-eks' },
      { title: 'Purple Rain', artist: 'Prince', duration: '8:41', spotifyUrl: 'https://www.jiosaavn.com/song/purple-rain/KDwKSUplcWo' }
    ]
  },
  // Keeping other conditions for fallback
  'default': {
    title: 'Weather Mood Mix',
    mood: 'Balanced & Pleasant',
    spotifyId: '37i9dQZF1DX6XE7HRLM75P',
    description: 'A well-balanced mix of songs for any weather.',
    tracks: [
      { title: 'Somewhere Over The Rainbow', artist: 'Israel Kamakawiwo\'ole', duration: '3:32', spotifyUrl: 'https://www.jiosaavn.com/song/somewhere-over-the-rainbow/My03ZzZiWHs' },
      { title: 'Sunny Afternoon', artist: 'The Kinks', duration: '3:36', spotifyUrl: 'https://www.jiosaavn.com/song/sunny-afternoon/FQ4HWTB2ank' },
      { title: 'Perfect Day', artist: 'Lou Reed', duration: '3:26', spotifyUrl: 'https://www.jiosaavn.com/song/perfect-day/GS8odUh9AGE' },
      { title: 'Feeling Good', artist: 'Nina Simone', duration: '2:54', spotifyUrl: 'https://www.jiosaavn.com/song/feeling-good/JggzVzZDY1o' },
      { title: 'Waterloo Sunset', artist: 'The Kinks', duration: '3:18', spotifyUrl: 'https://www.jiosaavn.com/song/waterloo-sunset/JQ4BXhJcAWo' }
    ]
  }
};

// Weather mood popup text
const MOOD_POPUP = {
  "Sunny": "Bring your cool shades 😎 — it's a sunglasses kinda day!",
  "Rain": "Sweater weather 🧣 — and maybe a warm cup of chai?",
  "Thunderstorm": "Stay in, curl up with a book 📚 — it's stormy out there.",
  "Clear": "Perfect time for a walk 🌿 — don't forget your playlist!",
  "Clouds": "A good day to relax 🧘🏽‍♀️ — maybe with some coffee and music?",
  "Snow": "Bundle up warm ❄️ — it's a winter wonderland outside!",
  "Mist": "Drive carefully 🚗 — visibility might be reduced.",
  "Fog": "Take it slow today 🐌 — the fog creates a mystical atmosphere.",
  "Haze": "Indoor activities might be best 🏠 — air quality isn't great.",
  "Dust": "Keep windows closed 🪟 — and maybe wear a mask outside.",
  "Smoke": "Stay indoors if possible 🏠 — air quality is poor.",
  "Hot": "Stay hydrated 💧 — it's a scorcher out there!",
  "Cold": "Layer up! 🧥 — it's chilly outside.",
  "Windy": "Hold onto your hat! 🌪️ — it's breezy out there.",
  "Tornado": "Seek shelter immediately! 🚨 — dangerous conditions outside.",
  "Drizzle": "Light rain jacket recommended ☔ — might get a little damp."
};

// Get weather condition in a normalized form
function normalizeWeatherCondition(weather: any): string {
  if (!weather || !weather.current || !weather.current.condition) {
    return 'default';
  }
  
  const condition = weather.current.condition.text.toLowerCase();
  const temp = weather.current.temp_c;
  
  // Map various weather conditions to our playlist keys
  if (condition.includes('sun') || condition.includes('clear') && temp > 25) return 'sunny';
  if (condition.includes('rain') || condition.includes('drizzle')) return 'rain';
  if (condition.includes('cloud')) return 'cloudy';
  if (condition.includes('clear')) return 'clear';
  if (condition.includes('thunder') || condition.includes('storm')) return 'thunderstorm';
  if (condition.includes('fog') || condition.includes('mist')) return 'fog';
  if (temp > 30) return 'hot';
  if (temp < 10) return 'cold';
  if (condition.includes('wind')) return 'windy';
  
  // Default fallback
  return 'default';
}

// Get playlist based on weather condition with mood-based shuffling
function getWeatherPlaylist(weather: any) {
  const condition = normalizeWeatherCondition(weather);
  
  // Always prefer the Tamil playlists
  let selectedPlaylist;
  if (TAMIL_WEATHER_PLAYLISTS[condition]) {
    selectedPlaylist = {...TAMIL_WEATHER_PLAYLISTS[condition]};
  } else {
    // Fallback to general playlists if no Tamil one is available
    selectedPlaylist = {...(WEATHER_PLAYLISTS[condition] || WEATHER_PLAYLISTS['default'])};
  }
  
  // Now shuffle tracks based on mood to ensure variety each time the weather changes
  selectedPlaylist.tracks = shuffleArray([...selectedPlaylist.tracks]);
  
  // If we have less than 5 tracks in the main playlist, add some tracks from other moods
  // that might still fit with the current weather condition
  if (selectedPlaylist.tracks.length < 5) {
    // Get tracks from other related mood playlists
    const relatedConditions = getRelatedWeatherConditions(condition);
    let additionalTracks: PlaylistTrack[] = [];
    
    relatedConditions.forEach(relatedCondition => {
      const relatedPlaylist = TAMIL_WEATHER_PLAYLISTS[relatedCondition] || WEATHER_PLAYLISTS[relatedCondition];
      if (relatedPlaylist && relatedPlaylist.tracks.length > 0) {
        additionalTracks = [...additionalTracks, ...relatedPlaylist.tracks];
      }
    });
    
    // Add some additional tracks and re-shuffle
    if (additionalTracks.length > 0) {
      const totalNeeded = Math.min(5 - selectedPlaylist.tracks.length, additionalTracks.length);
      selectedPlaylist.tracks = [
        ...selectedPlaylist.tracks,
        ...shuffleArray(additionalTracks).slice(0, totalNeeded)
      ];
    }
  }
  
  return selectedPlaylist;
}

// Get related weather conditions for mood-based track recommendations
function getRelatedWeatherConditions(condition: string): string[] {
  // Map of conditions that have similar musical moods
  const moodMap: Record<string, string[]> = {
    'sunny': ['clear', 'hot'],
    'clear': ['sunny', 'hot'],
    'cloudy': ['fog', 'windy'],
    'rain': ['thunderstorm', 'fog'],
    'thunderstorm': ['rain', 'windy'],
    'fog': ['cloudy', 'rain'],
    'hot': ['sunny', 'clear'],
    'cold': ['windy', 'cloudy'],
    'windy': ['cold', 'cloudy'],
    'default': ['clear', 'sunny', 'cloudy']
  };
  
  return moodMap[condition] || moodMap['default'];
}

// Shuffle an array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get random tracks from multiple playlists
function getRandomTracks(count: number = 5): PlaylistTrack[] {
  // Collect all tracks from all Tamil playlists
  const allTracks: PlaylistTrack[] = Object.values(TAMIL_WEATHER_PLAYLISTS).reduce((acc, playlist) => {
    return [...acc, ...playlist.tracks];
  }, [] as PlaylistTrack[]);
  
  // Shuffle and return requested number of tracks
  const shuffled = shuffleArray(allTracks);
  return shuffled.slice(0, count);
}

const MusicVibes: FC<MusicVibesProps> = ({ weather }) => {
  const [showMoodToast, setShowMoodToast] = useState(false);
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<{
    title: string;
    mood: string;
    tracks: PlaylistTrack[];
    description: string;
  } | null>(null);
  
  // Keep track of whether the current toast is from a reshuffle action
  const [isReshuffleToast, setIsReshuffleToast] = useState(false);
  
  // Add climate mood shuffling function
  const reshuffleMoodTracks = () => {
    if (selectedPlaylist) {
      // Create a copy of the current playlist
      const reshuffledPlaylist = {
        ...selectedPlaylist,
        tracks: shuffleArray([...selectedPlaylist.tracks])
      };
      
      // Update the playlist with reshuffled tracks
      setSelectedPlaylist(reshuffledPlaylist);
      
      // Set the reshuffle flag and show toast
      setIsReshuffleToast(true);
      setShowMoodToast(true);
      
      // Add subtle animation to the shuffle button for feedback
      const shuffleButton = document.querySelector('.shuffle-button');
      if (shuffleButton) {
        shuffleButton.classList.add('animate-spin-once');
        setTimeout(() => {
          shuffleButton.classList.remove('animate-spin-once');
        }, 500);
      }
      
      setTimeout(() => {
        setShowMoodToast(false);
        // Reset the flag after toast is hidden
        setTimeout(() => setIsReshuffleToast(false), 100);
      }, 3000);
    }
  };
  
  // Display mood toast briefly when component mounts
  useEffect(() => {
    setShowMoodToast(true);
    const timer = setTimeout(() => {
      setShowMoodToast(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update selected playlist when weather changes
  useEffect(() => {
    if (weather && weather.current) {
      setSelectedPlaylist(getWeatherPlaylist(weather));
    }
  }, [weather]);
  
  // Get mood message based on weather or shuffle action
  const getMoodMessage = (isReshuffle: boolean = false) => {
    if (!weather || !weather.current || !weather.current.condition) return '';
    
    if (isReshuffle) {
      return "Refreshed your climate mood playlist! ✨ Enjoy new vibes.";
    }
    
    const condition = weather.current.condition.text.split(' ')[0];
    // Safely access the mood popup with type checking, defaulting to Clear if not found
    return MOOD_POPUP[condition as keyof typeof MOOD_POPUP] || MOOD_POPUP['Clear'];
  };
  
  // Open YouTube Music for a track - replacing JioSaavn with a more reliable alternative
  const openMusicPlayer = (trackUrl: string) => {
    try {
      // Extract song and artist information
      const songTitle = trackUrl.includes('/song/') 
        ? trackUrl.split('/song/')[1].split('/')[0].replace(/-/g, ' ')
        : trackUrl;
      
      // Get the artist name from the track object if possible
      const artistName = selectedPlaylist?.tracks.find(t => t.spotifyUrl === trackUrl)?.artist || '';
      
      // Create a YouTube Music search query with both song and artist for better results
      const searchQuery = artistName ? `${songTitle} ${artistName}` : songTitle;
      const youtubeSearchUrl = `https://music.youtube.com/search?q=${encodeURIComponent(searchQuery)}`;
      
      // Open in a new tab
      window.open(youtubeSearchUrl, '_blank', 'noopener,noreferrer');
      console.log('Opening YouTube Music search:', youtubeSearchUrl);
    } catch (error) {
      console.error('Error opening music link:', error);
      // Fallback to YouTube Music main page
      window.open('https://music.youtube.com/', '_blank', 'noopener,noreferrer');
    }
  };
  
  // Render nothing if no weather data
  if (!weather || !selectedPlaylist) {
    return null;
  }

  return (
    <div className="glass rounded-xl shadow-elevation p-4 md:p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Music Vibes</h3>
        <div className="text-2xl">🎵</div>
      </div>

      {/* Weather-based Playlist */}
      <div className="glass-dark rounded-lg p-4 mb-6">
        <h4 className="text-lg font-medium text-white mb-3">Today's Weather Playlist</h4>
        <div className="space-y-3">
          {selectedPlaylist.tracks.map((track, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 glass rounded-lg">
              <div className="text-2xl">🎵</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{track.title}</div>
                <div className="text-xs text-slate-400">{track.artist}</div>
              </div>
              <div className="text-xs text-slate-400">{track.duration}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mood-based Recommendations */}
      <div className="glass-dark rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-white mb-3">Mood-based Recommendations</h4>
        <div className="grid grid-cols-2 gap-3">
          {/* This section is not directly related to the weather or mood,
              but it's part of the new_code. It's kept as is. */}
          <div className="text-center p-3 glass rounded-lg">
            <div className="text-2xl mb-2">🎧</div>
            <div className="text-xs text-slate-400">Current Weather Vibes</div>
          </div>
          <div className="text-center p-3 glass rounded-lg">
            <div className="text-2xl mb-2">📱</div>
            <div className="text-xs text-slate-400">Open in Spotify</div>
          </div>
        </div>
      </div>

      {/* Spotify Integration */}
      <div className="glass-dark rounded-lg p-4">
        <h4 className="text-sm font-medium text-white mb-3">Connect with Spotify</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 glass rounded-lg">
            <div className="text-2xl">🎧</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Current Weather Vibes</div>
              <div className="text-xs text-slate-400">Automatically generated playlist</div>
            </div>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-3 p-3 glass rounded-lg">
            <div className="text-2xl">📱</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Open in Spotify</div>
              <div className="text-xs text-slate-400">Continue listening on mobile</div>
            </div>
            <Button size="sm" variant="outline" className="text-white border-slate-600 hover:bg-slate-700">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicVibes;