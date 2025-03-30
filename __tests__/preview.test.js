const request = require('supertest');
const fs = require('fs');
const path = require('path');
let app, server;

beforeAll(async () => {
  process.env.JWT_SECRET = 'testSecret'; // Mock JWT secret
  process.env.PORT = 0; // Use a random available port
  const mod = await import('../server');
  app = mod.app;
  server = mod.server;

  // Mock file existence
  const filePath = path.join(__dirname, '../uploads/example.csv');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, 'mock data');
  }
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
  console.log('Server closed after tests');

  // Clean up mock file
  const filePath = path.join(__dirname, '../uploads/example.csv');
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
});

describe('GET /api/preview', () => {
  it('should return a data preview if the file exists', async () => {
    const response = await request(app).get('/api/preview');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('preview');
  });

  it('should return 404 if no file is found', async () => {
    // Remove the mock file before testing
    const filePath = path.join(__dirname, '../uploads/example.csv');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const response = await request(app).get('/api/preview');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'No file found');
  });
});