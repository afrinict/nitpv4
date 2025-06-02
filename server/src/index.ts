import express from 'express';
import mongoose from 'mongoose';
import { logger } from './utils/logger';
import financialRoutes from './routes/financial';
import cors from 'cors';
import complaintsRouter from './routes/complaints';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/financial', financialRoutes);
app.use('/api/complaints', complaintsRouter);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to MongoDB
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/financial-management';
mongoose
  .connect(mongoUrl)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
}); 