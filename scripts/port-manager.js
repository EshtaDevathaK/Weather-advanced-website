import net from 'net';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Function to check if a port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

// Function to find the next available port
async function findAvailablePort(startPort = 5000, maxAttempts = 10) {
  for (let port = startPort; port < startPort + maxAttempts; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available ports found between ${startPort} and ${startPort + maxAttempts - 1}`);
}

// Function to kill processes on a specific port (Windows)
async function killPortWindows(port) {
  try {
    const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
    const lines = stdout.trim().split('\n');
    
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 5) {
        const pid = parts[4];
        if (pid && !isNaN(pid)) {
          try {
            await execAsync(`taskkill /PID ${pid} /F`);
            console.log(`✅ Killed process ${pid} on port ${port}`);
          } catch (error) {
            console.log(`⚠️  Process ${pid} was already terminated`);
          }
        }
      }
    }
  } catch (error) {
    console.log(`ℹ️  No processes found on port ${port}`);
  }
}

// Function to kill processes on a specific port (Unix/Linux/macOS)
async function killPortUnix(port) {
  try {
    const { stdout } = await execAsync(`lsof -ti:${port}`);
    const pids = stdout.trim().split('\n').filter(pid => pid);
    
    for (const pid of pids) {
      try {
        await execAsync(`kill -9 ${pid}`);
        console.log(`✅ Killed process ${pid} on port ${port}`);
      } catch (error) {
        console.log(`⚠️  Process ${pid} was already terminated`);
      }
    }
  } catch (error) {
    console.log(`ℹ️  No processes found on port ${port}`);
  }
}

// Main function
async function main() {
  const targetPort = parseInt(process.env.PORT) || 5000;
  const isWindows = process.platform === 'win32';
  
  console.log('🔍 Checking port availability...');
  
  // Try to kill any existing processes on the target port
  console.log(`🧹 Cleaning up port ${targetPort}...`);
  if (isWindows) {
    await killPortWindows(targetPort);
  } else {
    await killPortUnix(targetPort);
  }
  
  // Wait a moment for processes to fully terminate
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Check if target port is now available
  if (await isPortAvailable(targetPort)) {
    console.log(`✅ Port ${targetPort} is available`);
    process.env.SERVER_PORT = targetPort.toString();
    return;
  }
  
  // Find next available port
  console.log(`⚠️  Port ${targetPort} is still busy, finding alternative...`);
  const availablePort = await findAvailablePort(targetPort + 1, 10);
  console.log(`✅ Found available port: ${availablePort}`);
  
  process.env.SERVER_PORT = availablePort.toString();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { findAvailablePort, killPortWindows, killPortUnix, isPortAvailable };
