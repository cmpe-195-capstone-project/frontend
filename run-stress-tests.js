const { exec } = require('child_process');
const util = require('util');
const readline = require('readline');
const execPromise = util.promisify(exec);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function waitForUserInput() {
  return new Promise((resolve) => {
    rl.question('\nPress ENTER to continue...', () => {
      resolve();
    });
  });
}

async function runStressTest(numFires) {
  try {
    const { stdout, stderr } = await execPromise(
      `node create-test-fires.js ${numFires}`,
      { cwd: __dirname }
    );
    
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    
    await waitForUserInput();
    
    return { success: true, fires: numFires };
  } catch (error) {
    console.error(`Test with ${numFires} fires failed:`, error.message);
    return { success: false, fires: numFires, error: error.message };
  }
}

async function clearDatabase() {
  try {
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    const { stdout, stderr } = await execPromise(
      `node clear-fires.js`,
      { cwd: __dirname }
    );
    if (stdout) console.log(stdout);
    if (stderr && !stderr.includes('password')) console.error(stderr);
  } catch (error) {
    console.error('Could not clear database:', error.message);
  }
}

async function runAllTests() {
  const results = [];
  const startFireCount = 10;
  const endFireCount = 100;
  const increment = 10;
  
  for (let fires = startFireCount; fires <= endFireCount; fires += increment) {
    await clearDatabase();
    const result = await runStressTest(fires);
    results.push(result);
  }
  
  console.log('\nStress Test Suite Complete\n');
  rl.close();
}

runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

