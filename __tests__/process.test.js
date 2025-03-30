const request = require('supertest');
const jwt = require('jsonwebtoken');
let app, server;

beforeAll(async () => {
  process.env.JWT_SECRET = 'testSecret'; // Ensure JWT secret is set
  process.env.PORT = 0; // Use a random available port
  const mod = await import('../server');
  app = mod.app;
  server = mod.server;
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
  console.log('Server closed after tests');
});

describe('POST /api/process', () => {
  it('should return a job ID and start processing with a valid token', async () => {
    const validToken = jwt.sign({ id: 'testUser' }, process.env.JWT_SECRET);
    const response = await request(app)
      .post('/api/process')
      .set('Authorization', `Bearer ${validToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Processing started');
    expect(response.body).toHaveProperty('jobId');
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app).post('/api/process');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Access denied. No token provided.');
  });

  it('should return 401 if an invalid token is provided', async () => {
    const response = await request(app)
      .post('/api/process')
      .set('Authorization', 'Bearer invalidToken');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid token.');
  });
});