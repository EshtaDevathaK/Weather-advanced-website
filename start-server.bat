@echo off
echo ========================================
echo WeatherMood Server Startup Script
echo ========================================

echo.
echo Checking for existing processes on port 5000...

:: Find and kill any process using port 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo Found process %%a using port 5000
    echo Killing process %%a...
    taskkill /PID %%a /F >nul 2>&1
    if !errorlevel! equ 0 (
        echo Successfully killed process %%a
    ) else (
        echo Process %%a was already terminated
    )
)

echo.
echo Waiting 2 seconds for port to be released...
timeout /t 2 /nobreak >nul

echo.
echo Starting WeatherMood server...
echo.
npm run dev

pause
