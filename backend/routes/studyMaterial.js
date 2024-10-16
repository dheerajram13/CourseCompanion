const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { bucket, db } = require('../firebaseAdmin');
const router = express.Router();

// Enable CORS for all routes
router.use(cors());

// Set up multer for file storage with size limit
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).single('file');

// Function to sanitize file name for use as a database key
function sanitizeFileName(fileName) {
    return fileName.replace(/[.#$[\]]/g, '_');
}

router.post('/materials', async (req, res) => {
    const { uid, course, visibility } = req.body;

    try {
        // Reference to the study_materials node in the database
        const materialsRef = db.ref('study_materials');

        // Fetch all study materials
        const snapshot = await materialsRef.once('value');
        const materials = snapshot.val();

        if (!materials) {
            return res.status(404).json({ message: 'No study materials found' });
        }

        // Filter materials based on the provided UID, course, and visibility (optional filters)
        let filteredMaterials = Object.values(materials);
        console.log('All materials:', filteredMaterials);

        if (uid) {
            filteredMaterials = filteredMaterials.filter((material) => material.uid === uid);
        }

        if (course) {
            filteredMaterials = filteredMaterials.filter((material) => material.course === course);
        }

        if (visibility) {
            filteredMaterials = filteredMaterials.filter((material) => material.visibility === visibility);
        }

        if (filteredMaterials.length === 0) {
            return res.status(404).json({ message: 'No materials match the criteria' });
        }

        // Return the filtered study materials
        res.status(200).json(filteredMaterials);
    } catch (error) {
        console.error('Error fetching study materials:', error);
        res.status(500).json({ message: 'Error fetching study materials: ' + error.message });
    }
});

// Endpoint for uploading study materials
router.post('/upload', (req, res) => {
    upload(req, res, async function(err) {
        // Handle multer errors
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({ message: `Multer error: ${err.message}` });
        } else if (err) {
            console.error('Unknown error:', err);
            return res.status(500).json({ message: `Unknown error: ${err.message}` });
        }

        // Check if the file is present
        if (!req.file) {
            console.log('No file detected in the request');
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // Check if Firebase is properly initialized
        if (!bucket || !db) {
            return res.status(500).json({ message: 'Server configuration error' });
        }

        try {
            const timestamp = Date.now();
            const fileName = `${timestamp}-${req.file.originalname}`;
            const fileBuffer = req.file.buffer;

            // Get the course, visibility type, and user ID from the request body
            const { course, visibility, uid } = req.body;
            
            // Validate visibility type
            const validVisibility = ['public', 'private'];
            if (!validVisibility.includes(visibility)) {
                return res.status(400).json({ message: 'Invalid visibility type' });
            }

            // Upload file to Firebase Storage
            const file = bucket.file(fileName);
            await file.save(fileBuffer, {
                metadata: {
                    contentType: req.file.mimetype,
                },
            });

            // Get the file download URL
            const downloadURL = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

            // Save file metadata to Realtime Database
            const dbFileName = sanitizeFileName(fileName);
            console.log('Database file name:', dbFileName);
            await db.ref('study_materials').child(dbFileName).set({
                fileName: fileName,
                fileUrl: downloadURL,
                uploadedAt: new Date().toISOString(),
                course: course,
                visibility: visibility,
                uid: uid
            });

            // Send success response
            res.status(200).json({ message: 'File uploaded successfully!', fileUrl: downloadURL });
        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error.code ? error.code : error.message;
            res.status(500).json({ message: 'Error uploading file: ' + errorMessage });
        }
    });
});

module.exports = router;