import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { processDataPipeline } from './processPipeline.js';
import { authMiddleware } from './authMiddleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import * as Sentry from '@sentry/node';

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'dist'))); // Middleware for serving static assets

// Update Sentry middleware initialization for compatibility with older versions
if (Sentry.Handlers && Sentry.Handlers.requestHandler) {
  app.use(Sentry.Handlers.requestHandler());
} else {
  console.warn('Sentry requestHandler is not available in this version. Skipping Sentry request handler middleware.');
}

// Logger setup with Winston
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// In-memory storage for job results
app.locals.jobResults = {};

// JWT Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Add caching middleware
const cache = new Map();

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  if (cache.has(key)) {
    return res.json(cache.get(key));
  }
  res.sendResponse = res.json;
  res.json = (body) => {
    cache.set(key, body);
    res.sendResponse(body);
  };
  next();
};

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Data-Verse API',
      version: '1.0.0',
      description: 'API documentation for Data-Verse',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./server.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: No file uploaded
 */

/**
 * @swagger
 * /api/preview:
 *   get:
 *     summary: Get a preview of the uploaded file
 *     responses:
 *       200:
 *         description: Data preview
 *       404:
 *         description: No file found
 */

/**
 * @swagger
 * /api/process:
 *   post:
 *     summary: Start processing the uploaded file
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Processing started
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/results/{jobId}:
 *   get:
 *     summary: Get the results of a processing job
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Job results
 *       404:
 *         description: Job not found
 */

// Routes
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    message: 'File uploaded successfully',
    file: req.file,
  });
});

app.get('/api/preview', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', 'example.csv'); // Replace with dynamic file handling
  if (!fs.existsSync(filePath)) {
    // Return mock data with the expected structure
    return res.json({
      bar: [{ x: ['A', 'B', 'C'], y: [10, 20, 30], type: 'bar' }],
      line: [{ x: ['A', 'B', 'C'], y: [15, 25, 35], type: 'scatter', mode: 'lines' }],
      pie: [{ labels: ['A', 'B', 'C'], values: [10, 20, 30], type: 'pie' }],
      scatter: [{ x: [1, 2, 3], y: [10, 20, 30], mode: 'markers', type: 'scatter' }],
    });
  }
  // Simulate reading and previewing file content
  res.json({ preview: 'First 10 rows of the file' });
});

// /api/process endpoint
app.post('/api/process', authMiddleware, async (req, res, next) => {
  try {
    const jobId = `job_${Date.now()}`;
    logger.info(`Job ${jobId}: Processing initiated by user ${req.user.id}.`);
    processDataPipeline(jobId)
      .then((result) => {
        app.locals.jobResults[jobId] = result; // Use app.locals.jobResults
        logger.info(`Job ${jobId}: Processing completed.`);
      })
      .catch((err) => logger.error(`Job ${jobId}: Error - ${err.message}`));
    res.json({ message: 'Processing started', jobId });
  } catch (err) {
    next(err);
  }
});

// /api/results endpoint
app.get('/api/results/:jobId', authMiddleware, cacheMiddleware, (req, res, next) => {
  try {
    const { jobId } = req.params;
    const result = app.locals.jobResults[jobId]; // Use app.locals.jobResults
    if (!result) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Update the root route to serve index.html from the 'dist' folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Update the catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Add a conditional check for Sentry errorHandler middleware
if (Sentry.Handlers && Sentry.Handlers.errorHandler) {
  app.use(Sentry.Handlers.errorHandler());
} else {
  console.warn('Sentry errorHandler is not available in this version. Skipping Sentry error handler middleware.');
}

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.message);
  Sentry.captureException(err); // Report error to Sentry
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export { app, server };
