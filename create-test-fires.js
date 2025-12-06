const http = require('http');

const baseLat = 37.40;
const baseLon = -121.85;

function createFire(lat, lon) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ longitude: lon, latitude: lat });
    
    const options = {
      hostname: 'localhost',
      port: 8000,
      path: '/test/fire-w-coords',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve({ id: 'unknown', status: 'created' });
          }
        } else {
          reject(new Error(`Failed: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function createMultipleFires(numFires, options = {}) {
  const { rapid = false, spread = 0.1 } = options;
  const startTime = Date.now();
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < numFires; i++) {
    // Spread fires around the base location
    const lat = baseLat + (Math.random() - 0.5) * spread * 2; // ±spread degrees
    const lon = baseLon + (Math.random() - 0.5) * spread * 2; // ±spread degrees
    
    try {
      const fire = await createFire(lat, lon);
      successCount++;
      if ((i + 1) % 10 === 0 || i === 0) {
        process.stdout.write(`Created ${i + 1}/${numFires} fires...\r`);
      }
    } catch (error) {
      failCount++;
      console.error(`\nFire ${i + 1} failed:`, error.message);
    }
    
    // Small delay to avoid overwhelming the API (unless rapid mode)
    if (!rapid && i < numFires - 1) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log(`\nBackend: ${successCount}/${numFires} fires created in ${duration}s`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const numFires = args[0] ? parseInt(args[0]) : 50;
const rapid = args.includes('--rapid');
const spreadArg = args.find(arg => arg.startsWith('--spread='));
const spread = spreadArg ? parseFloat(spreadArg.split('=')[1]) : 0.1;

if (isNaN(numFires) || numFires < 1) {
  console.error('Usage: node create-test-fires.js <number-of-fires> [--rapid] [--spread=0.1]');
  console.error('Example: node create-test-fires.js 100');
  console.error('Example: node create-test-fires.js 50 --rapid');
  console.error('Example: node create-test-fires.js 30 --spread=0.2');
  process.exit(1);
}

createMultipleFires(numFires, { rapid, spread }).catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});

