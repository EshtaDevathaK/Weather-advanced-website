# 🌤️ WeatherMood - Your Weather Companion

A modern, beautiful weather application that combines real-time weather data with mood tracking and personalized recommendations. Built with React, TypeScript, and Tailwind CSS.

![WeatherMood App](https://img.shields.io/badge/WeatherMood-v2.0.0-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.14-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🌟 **Modern UI/UX**
- **Glass Morphism Design** - Beautiful translucent effects and modern aesthetics
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Smooth Animations** - Engaging micro-interactions and transitions
- **Dark/Light Theme** - Toggle between themes for your preference

### 🌤️ **Weather Features**
- **Real-time Weather Data** - Live updates from OpenWeather API
- **Current Weather Display** - Temperature, conditions, humidity, wind speed
- **Hourly Forecast** - Detailed 24-hour weather predictions
- **Multi-day Forecast** - 3-day weather outlook
- **Location Management** - Save and switch between multiple locations

### 🎭 **Mood & Lifestyle**
- **Mood Tracking** - Track how weather affects your mood
- **Outfit Recommendations** - Get dressed for the weather
- **Music Vibes** - Curated playlists based on weather conditions
- **Local Activities** - Discover weather-appropriate activities
- **Seasonal Photos** - Beautiful background images that change with weather

### 📊 **Analytics & Insights**
- **Weather Analytics** - Historical weather data and trends
- **Mood Patterns** - Understand weather-mood correlations
- **Calendar Integration** - Plan activities around weather
- **Personalized Insights** - AI-powered recommendations

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- OpenWeather API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weathermood-app.git
   cd weathermood-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create a .env file in the root directory
   cp .env.example .env
   
   # Add your OpenWeather API key
   OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run dev:direct` | Direct server start (alternative) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run tests |
| `npm run type-check` | TypeScript type checking |

## 🏗️ Project Structure

```
weathermood-app/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and services
│   │   ├── hooks/         # Custom React hooks
│   │   └── ui/            # Shadcn/ui components
├── server/                # Backend Express server
├── shared/                # Shared types and schemas
├── scripts/               # Build and utility scripts
└── public/                # Static assets
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`#667eea` to `#764ba2`)
- **Secondary**: Purple gradient (`#f093fb` to `#f5576c`)
- **Success**: Cyan gradient (`#4facfe` to `#00f2fe`)
- **Warning**: Orange gradient (`#fa709a` to `#fee140`)

### Components
- **Glass Morphism**: Translucent backgrounds with blur effects
- **Gradient Cards**: Beautiful gradient backgrounds
- **Hover Effects**: Smooth lift and glow animations
- **Loading States**: Animated spinners and skeleton screens

## 🔧 Configuration

### Environment Variables

```env
# Required
OPENWEATHER_API_KEY=your_openweather_api_key

# Optional
SERVER_PORT=5000
NODE_ENV=development
```

### API Configuration

1. **Get OpenWeather API Key**
   - Visit [OpenWeather](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key
   - Add to your `.env` file

2. **API Endpoints**
   - Current Weather: `/api/weather/current`
   - Forecast: `/api/weather/forecast`
   - Location Search: `/api/weather/search`

## 📱 Mobile Support

WeatherMood is fully responsive and optimized for:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run type checking
npm run type-check
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Docker
```bash
# Build Docker image
docker build -t weathermood-app .

# Run container
docker run -p 5000:5000 weathermood-app
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenWeather API** - Weather data provider
- **Unsplash** - Beautiful background images
- **Lucide React** - Icon library
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives

## 📞 Support

- 📧 Email: support@weathermood.app
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/weathermood-app/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/weathermood-app/wiki)

---

<div align="center">
  <p>Made with ❤️ by the WeatherMood Team</p>
  <p>⭐ Star this repository if you found it helpful!</p>
</div>
