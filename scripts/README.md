# WeatherMood Port Management System

This directory contains scripts to handle port conflicts and ensure reliable server startup.

## 🚀 Quick Start

### Recommended Method (Automatic)
```bash
npm run dev
```
This will:
- ✅ Automatically detect and kill conflicting processes
- ✅ Find an available port (5000 or next available)
- ✅ Start the server with proper error handling
- ✅ Show clear status messages

### Alternative Methods

#### Manual Port Cleanup
```bash
npm run kill-port
npm run dev
```

#### Check Port Status
```bash
npm run port-check
```

#### Legacy Method (No port management)
```bash
npm run dev:legacy
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | **Recommended** - Smart startup with port management |
| `npm run dev:clean` | Clean port 5000 and start server |
| `npm run dev:manual` | Manual port 5000 startup |
| `npm run dev:legacy` | Original startup method |
| `npm run kill-port` | Kill processes on port 5000 |
| `npm run cleanup` | Run port cleanup only |
| `npm run port-check` | Check port availability |

## 🛠️ Troubleshooting

### Port Still Busy?
```bash
# Kill all Node.js processes
taskkill /F /IM node.exe

# Or use the cleanup script
npm run cleanup
```

### Multiple Terminal Sessions?
- Close all terminal windows
- Restart your terminal
- Use `npm run dev` (recommended)

### Windows Process Issues?
```powershell
# Find processes using port 5000
netstat -ano | findstr :5000

# Kill specific process
taskkill /PID [PID_NUMBER] /F
```

## 📁 Script Files

- `start-dev.js` - Main development startup script
- `port-manager.js` - Port detection and cleanup utilities
- `start-server.bat` - Windows batch file (legacy)
- `start-server.ps1` - PowerShell script (legacy)

## 🎯 Features

- ✅ **Automatic port detection**
- ✅ **Cross-platform compatibility**
- ✅ **Graceful error handling**
- ✅ **Clear status messages**
- ✅ **Process cleanup**
- ✅ **Fallback port selection**

## 🔄 Workflow

1. **Always use `npm run dev`** for development
2. **Use Ctrl+C** to stop the server properly
3. **Wait 2-3 seconds** between restarts
4. **Check port status** if issues persist

This system prevents the "EADDRINUSE" error permanently! 🎉
