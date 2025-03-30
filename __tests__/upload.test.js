const request = require('supertest');
const path = require('path');
let app, server;

beforeAll(async () => {
  process.env.JWT_SECRET = 'testSecret'; // Mock JWT secret
  process.env.PORT = 0; // Use a random available port
  const mod = await import('../server');
  app = mod.app;
  server = mod.server;
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
  console.log('Server closed after tests');
});

describe('POST /api/upload', () => {
  it('should upload a file and return metadata', async () => {
    const response = await request(app)
      .post('/api/upload')
      .attach('file', path.join(__dirname, 'testFile.csv'));
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'File uploaded successfully');
    expect(response.body).toHaveProperty('file');
  });

  it('should return 400 if no file is uploaded', async () => {
    const response = await request(app).post('/api/upload');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'No file uploaded');
  });
});