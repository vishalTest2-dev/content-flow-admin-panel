
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const quizRoutes = require('./routes/quiz.routes');
const quizCategoryRoutes = require('./routes/quizCategory.routes');
const postRoutes = require('./routes/post.routes');
const postCategoryRoutes = require('./routes/postCategory.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/quiz-categories', quizCategoryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/post-categories', postCategoryRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Admin Dashboard API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
