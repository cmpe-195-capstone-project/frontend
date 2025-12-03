
const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');

function getLocationFromIP() {
  return new Promise((resolve, reject) => {
    https.get('https://ipapi.co/json/', (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const location = JSON.parse(data);
          
          if (location.error) {
            reject(new Error(`API error: ${location.reason || location.message}`));
            return;
          }
          
          if (!location.latitude || !location.longitude) {
            reject(new Error(`Invalid location data: missing lat/lon`));
            return;
          }
          
          resolve({
            lat: location.latitude,
            lon: location.longitude
          });
        } catch (e) {
          reject(new Error(`Failed to parse location: ${e.message}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Network error: ${err.message}`));
    });
  });
}

function getLocationFromAlternative() {
  return new Promise((resolve, reject) => {
    https.get('https://ipwho.is/', (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const location = JSON.parse(data);
          if (location.success && location.latitude && location.longitude) {
            resolve({
              lat: location.latitude,
              lon: location.longitude
            });
          } else {
            reject(new Error(`API returned: ${location.message || 'unknown error'}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse location: ${e.message}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Network error: ${err.message}`));
    });
  });
}

function getLocationFromThird() {
  return new Promise((resolve, reject) => {
    https.get('https://freeipapi.com/api/json', (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const location = JSON.parse(data);
          if (location.latitude && location.longitude) {
            resolve({
              lat: location.latitude,
              lon: location.longitude
            });
          } else {
            reject(new Error(`Invalid location data from third API`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse location: ${e.message}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Network error: ${err.message}`));
    });
  });
}

function getLocationFromMac() {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'get-mac-location.py');
    
    if (!fs.existsSync(scriptPath)) {
      reject(new Error('get-mac-location.py not found'));
      return;
    }
    
    try {
      const result = execSync(`python3 "${scriptPath}"`, { encoding: 'utf8', timeout: 15000 });
      const location = JSON.parse(result);
      
      if (location.error) {
        reject(new Error(location.error));
        return;
      }
      
      if (location.lat && location.lon) {
        resolve({
          lat: location.lat,
          lon: location.lon
        });
      } else {
        reject(new Error('No location data returned'));
      }
    } catch (error) {
      reject(new Error(`Failed to get Mac location: ${error.message}`));
    }
  });
}

async function getLocation() {
  if (process.env.MY_LAT && process.env.MY_LON) {
    console.log('📍 Using manual coordinates from environment variables...');
    return {
      lat: parseFloat(process.env.MY_LAT),
      lon: parseFloat(process.env.MY_LON)
    };
  }
  
  try {
    console.log('📍 Trying to get Mac\'s actual location...');
    return await getLocationFromMac();
  } catch (error) {
    console.log('⚠️  Mac location failed, falling back to IP geolocation...');
    console.log('   Error:', error.message);
    console.log('   Tip: Grant location permission to Terminal in System Settings > Privacy & Security > Location Services');
    console.log('   Or set MY_LAT and MY_LON environment variables for manual coordinates');
    
    try {
      return await getLocationFromIP();
    } catch (error2) {
      console.log('⚠️  First API failed, trying alternative...');
      try {
        return await getLocationFromAlternative();
      } catch (error3) {
        console.log('⚠️  Second API failed, trying third...');
        return await getLocationFromThird();
      }
    }
  }
}

function sendToEmulator(lat, lon) {
  if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
    throw new Error(`Invalid coordinates: lat=${lat}, lon=${lon}`);
  }
  
  try {
    const adbPath = process.env.ANDROID_HOME 
      ? `${process.env.ANDROID_HOME}/platform-tools/adb`
      : '/Users/spartan/Library/Android/sdk/platform-tools/adb';
    
    execSync(`${adbPath} emu geo fix ${lon} ${lat}`, { stdio: 'inherit' });
    console.log(`✅ Location sent to emulator: ${lat}, ${lon}`);
    console.log(`   You may need to reload your app (press R twice in Metro) for changes to take effect.`);
  } catch (error) {
    console.error('❌ Error sending to emulator. Make sure emulator is running.');
    console.error('   Error:', error.message);
    process.exit(1);
  }
}

async function syncLocation() {
  console.log('📍 Getting your current location...');
  try {
    const { lat, lon } = await getLocation();
    console.log(`📍 Found location: ${lat}, ${lon}`);
    sendToEmulator(lat, lon);
    return { lat, lon };
  } catch (error) {
    console.error('❌ Error getting location:', error.message);
    throw error;
  }
}

async function main() {
  const watchMode = process.argv.includes('--watch') || process.argv.includes('-w');
  
  if (watchMode) {
    console.log('🔄 Watch mode: Location will refresh every 30 seconds...');
    console.log('   Press Ctrl+C to stop\n');
    
    await syncLocation().catch(() => {});
    
    setInterval(async () => {
      await syncLocation().catch(() => {});
    }, 30000);
  } else {
    await syncLocation();
  }
}

main();

