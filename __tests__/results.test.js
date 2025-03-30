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

describe('GET /api/results/:jobId', () => {
  const jobId = 'testJobId';

  beforeAll(() => {
    // Mock in-memory job results for testing
    app.locals.jobResults = {
      testJobId: { status: 'completed', data: 'Test results' },
    };
  });

  it('should return job results for a valid job ID and token', async () => {
    const validToken = jwt.sign({ id: 'testUser' }, process.env.JWT_SECRET);
    const response = await request(app)
      .get(`/api/results/${jobId}`)
      .set('Authorization', `Bearer ${validToken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'completed');
    expect(response.body).toHaveProperty('data', 'Test results');
  });

  it('should return 404 if the job ID is not found', async () => {
    const validToken = jwt.sign({ id: 'testUser' }, process.env.JWT_SECRET);
    const response = await request(app)
      .get('/api/results/invalidJobId')
      .set('Authorization', `Bearer ${validToken}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Job not found');
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app).get(`/api/results/${jobId}`);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Access denied. No token provided.');
  });

  it('should return 401 if an invalid token is provided', async () => {
    const response = await request(app)
      .get(`/api/results/${jobId}`)
      .set('Authorization', 'Bearer invalidToken');
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid token.');
  });
});