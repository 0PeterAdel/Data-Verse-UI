const request = require('supertest');
const app = require('../server'); // Assuming server.js exports the app

describe('End-to-End Integration Tests', () => {
  let uploadedFileId;

  it('should upload a file successfully', async () => {
    const response = await request(app)
      .post('/api/upload')
      .attach('file', '__tests__/testFile.csv');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('fileId');
    uploadedFileId = response.body.fileId;
  });

  it('should preview the uploaded data', async () => {
    const response = await request(app)
      .get(`/api/preview?fileId=${uploadedFileId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('previewData');
  });

  it('should trigger the processing pipeline', async () => {
    const response = await request(app)
      .post('/api/process')
      .send({ fileId: uploadedFileId });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('jobId');
  });

  it('should retrieve the processed results', async () => {
    const response = await request(app)
      .get(`/api/results?fileId=${uploadedFileId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('results');
  });
});