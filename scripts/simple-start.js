#!/usr/bin/env node

import { spawn } from 'child_process';
import { findAvailablePort, killPortWindows, killPortUnix } from './port-manager.js';

async function startDev() {
  const isWindows = process.platform === 'win32';
  const targetPort = 5000;
  
  console.log('🚀 WeatherMood Development Server Startup');
  console.log('==========================================');
  
  try {
    // Step 1: Clean up any existing processes
    console.log('\n🧹 Cleaning up existing processes...');
    if (isWindows) {
      await killPortWindows(targetPort);
    } else {
      await killPortUnix(targetPort);
    }
    
    // Step 2: Wait for cleanup
    console.log('⏳ Waiting for port cleanup...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Find available port
    console.log('🔍 Finding available port...');
    const availablePort = await findAvailablePort(targetPort, 5);
    
    if (availablePort === targetPort) {
      console.log(`✅ Port ${targetPort} is available`);
    } else {
      console.log(`⚠️  Port ${targetPort} was busy, using port ${availablePort}`);
    }
    
    // Step 4: Set environment variable
    process.env.SERVER_PORT = availablePort.toString();
    
    // Step 5: Start the development server using npm
    console.log(`\n🎯 Starting server on port ${availablePort}...`);
    console.log(`🌐 Your app will be available at: http://localhost:${availablePort}`);
    console.log('\n📝 Press Ctrl+C to stop the server\n');
    
    // Use the correct npm command for the platform
    const npmCmd = isWindows ? 'npm.cmd' : 'npm';
    
    // Use npm run dev:manual which uses cross-env
    const child = spawn(npmCmd, ['run', 'dev:manual'], {
      stdio: 'inherit',
      env: { ...process.env, SERVER_PORT: availablePort.toString() },
      shell: isWindows // Use shell on Windows to help with PATH issues
    });
    
    child.on('error', (error) => {
      console.error('❌ Failed to start server:', error.message);
      console.log('💡 Try running: npm install && npm run dev:manual');
      console.log('💡 Or try: node scripts/start-dev.js');
      process.exit(1);
    });
    
    child.on('exit', (code) => {
      if (code !== 0) {
        console.error(`❌ Server exited with code ${code}`);
        process.exit(code);
      }
    });
    
  } catch (error) {
    console.error('❌ Startup failed:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down...');
  process.exit(0);
});

startDev();
