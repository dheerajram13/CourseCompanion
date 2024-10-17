const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const studyMaterialRoutes = require('./routes/studyMaterial');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');  
const chatRoutes = require('./routes/chat'); 

// Load environment variables
dotenv.config();

const app = express();

const allowedOrigins = [
  'http://35.208.88.146:81',
  'http://35.208.88.146:80',
  'http://localhost:3000',
  'http://localhost:80'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  // Preflight response headers
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.sendStatus(200); // Respond with 200 to preflight requests
  }
  
  next();
});
app.use(express.json());

// Healthcheck route
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Backend is up and running!' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/study-material', studyMaterialRoutes);
app.use('/courses', courseRoutes);  
app.use('/chat', chatRoutes);  

// Start server
const port = process.env.PORT || 81;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
