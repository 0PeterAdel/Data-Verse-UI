const axios = require('axios');
const os = require('os');
const fs = require('fs');

const endpoints = [
  { name: 'Upload', url: 'http://localhost:5000/api/upload', method: 'POST' },
  { name: 'Preview', url: 'http://localhost:5000/api/preview', method: 'GET' },
  { name: 'Process', url: 'http://localhost:5000/api/process', method: 'POST' },
  { name: 'Results', url: 'http://localhost:5000/api/results', method: 'GET' },
];

async function monitorPerformance() {
  const results = [];

  for (const endpoint of endpoints) {
    const startTime = Date.now();
    try {
      if (endpoint.method === 'POST') {
        await axios.post(endpoint.url, {}); // Add payload if needed
      } else {
        await axios.get(endpoint.url);
      }
      const duration = Date.now() - startTime;
      results.push({ endpoint: endpoint.name, status: 'Success', responseTime: duration });
    } catch (error) {
      results.push({ endpoint: endpoint.name, status: 'Error', error: error.message });
    }
  }

  const memoryUsage = process.memoryUsage();
  const cpuLoad = os.loadavg();

  const report = {
    timestamp: new Date().toISOString(),
    results,
    memoryUsage,
    cpuLoad,
  };

  fs.writeFileSync('performance_report.json', JSON.stringify(report, null, 2));
  console.log('Performance report generated:', report);
}

monitorPerformance();