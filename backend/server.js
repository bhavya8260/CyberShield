const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/database');
const { errorHandler } = require('./src/middleware/errorMiddleware');
const authRoutes = require('./src/routes/authRoutes');
const missionRoutes = require('./src/routes/missionRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: function (origin, callback) {
    // Reflect the requesting origin to support Vercel preview domains and localhosts
    callback(null, origin || '*');
  },
  credentials: true,
}));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/missions', missionRoutes);

// Handle 404 for unknown routes
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
});

// Error middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
