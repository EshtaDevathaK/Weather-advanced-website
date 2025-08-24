# WeatherMood Server Startup Script (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "WeatherMood Server Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Checking for existing processes on port 5000..." -ForegroundColor Yellow

# Find and kill any process using port 5000
$processes = netstat -ano | Select-String ":5000" | ForEach-Object {
    $parts = $_ -split '\s+'
    $parts[-1]  # Get the PID
}

if ($processes) {
    Write-Host "Found processes using port 5000: $($processes -join ', ')" -ForegroundColor Red
    
    foreach ($pid in $processes) {
        Write-Host "Killing process $pid..." -ForegroundColor Yellow
        try {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "Successfully killed process $pid" -ForegroundColor Green
        } catch {
            Write-Host "Process $pid was already terminated" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    Write-Host "Waiting 3 seconds for port to be released..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
} else {
    Write-Host "No processes found using port 5000" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting WeatherMood server..." -ForegroundColor Green
Write-Host ""

# Start the server
npm run dev
