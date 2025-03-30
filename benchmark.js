const axios = require('axios');
const { performance } = require('perf_hooks');

const API_URL = 'http://localhost:5000';

async function benchmark() {
  const start = performance.now();

  try {
    const response = await axios.get(`${API_URL}/api/preview`);
    const end = performance.now();

    console.log('Response time:', (end - start).toFixed(2), 'ms');
    console.log('Status code:', response.status);
  } catch (error) {
    console.error('Error during benchmarking:', error.message);
  }
}

benchmark();