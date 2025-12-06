async function clearFires() {
  try {
    // Use docker exec to delete all fires (more reliable than psql)
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);
    
    // Connect to test database via Docker and delete all fires
    const dockerCommand = `docker exec my-postgres psql -U postgres -d emberalert_test -c "DELETE FROM fire_data;"`;
    
    await execPromise(dockerCommand);
  } catch (error) {
    console.error('Error clearing database:', error.message);
    process.exit(1);
  }
}

clearFires();

