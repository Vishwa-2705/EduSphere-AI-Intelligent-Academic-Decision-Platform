import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { ENV } from './config/env';
import { connectDB } from './config/db';
import apiRoutes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app = express();

// Middlewares
app.use(
  cors({
    origin: [ENV.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (ENV.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/v1', apiRoutes);

// Root Welcome Route
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to EduSphere AI: Intelligent Academic Decision Platform API',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/v1/health',
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 EduSphere AI Server running on port ${ENV.PORT}`);
    console.log(`🌐 Health endpoint: http://localhost:${ENV.PORT}/api/v1/health`);
    console.log(`⚙️ Environment: ${ENV.NODE_ENV}`);
    console.log(`====================================================`);
  });
};

startServer();

export default app;
