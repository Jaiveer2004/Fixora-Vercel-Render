const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API and its dependencies
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 uptime:
 *                   type: number
 *                   example: 12345.678
 *                 timestamp:
 *                   type: number
 *                   example: 1639123456789
 *                 database:
 *                   type: string
 *                   example: connected
 *                 environment:
 *                   type: string
 *                   example: production
 */
router.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: Date.now(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  };

  const statusCode = healthCheck.database === 'connected' ? 200 : 503;
  
  res.status(statusCode).json(healthCheck);
});

module.exports = router;
