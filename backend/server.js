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
  'http://34.46.247.125:81',
  'http://localhost:3000',
  'http://localhost:80'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
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
