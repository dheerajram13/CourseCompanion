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
app.use(cors());
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
