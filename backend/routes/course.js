const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Middleware to authenticate and attach user UID to the request
const authenticateUser = async (req, res, next) => {
    const { uid } = req.body; 
    if (!uid) {
        return res.status(401).json({ message: 'Unauthorized: No UID provided' });
    }
    req.uid = uid; 
    next();
};

// Middleware to ensure course data is valid
const validateCourseData = (req, res, next) => {
    const { courseCode, title, description, semester, year} = req.body;
    if (!courseCode || !title || !description || !semester || !year) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    next();
};

// Create a course (POST /courses/add)
router.post('/add', authenticateUser, validateCourseData, async (req, res) => {
    const { courseCode, title, description, semester, year } = req.body;
    const courseId = `${courseCode}-${Date.now()}`;
    const courseData = {
        courseCode,
        title,
        description,
        semester,
        year,
        createdAt: new Date().toISOString(),
        createdBy: req.uid,
        enrolledUsers: {
            [req.uid]: true  // The creator is automatically enrolled
        }
    };

    try {
        await admin.database().ref(`courses/public/${courseId}`).set(courseData);
        res.status(201).json({ message: 'Course created successfully', courseId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating course', error: error.message });
    }
});

// Get all public courses (GET /courses/public)
router.post('/public', authenticateUser, async (req, res) => {
    try {
        const publicCoursesSnapshot = await admin.database().ref('courses/public/').once('value');
        const publicCourses = publicCoursesSnapshot.val();

        if (!publicCourses) {
            return res.status(404).json({ message: 'No public courses found' });
        }
        
        res.status(200).json({ courses: publicCourses });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching public courses', error: error.message });
    }
});

// Update a course (PUT /courses/:courseId)
router.put('/:courseId', authenticateUser, validateCourseData, async (req, res) => {
    const { courseId } = req.params;
    const { courseCode, title, description, semester, year } = req.body;
    const courseData = { courseCode, title, description, semester, year, updatedAt: new Date().toISOString() };

    try {
        const courseRef = admin.database().ref(`courses/public/${courseId}`);
        const courseSnapshot = await courseRef.once('value');
        if (!courseSnapshot.exists()) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if the user is the creator of the course
        if (courseSnapshot.val().createdBy !== req.uid) {
            return res.status(403).json({ message: 'Unauthorized: Only the course creator can update the course' });
        }

        await courseRef.update(courseData);
        res.status(200).json({ message: 'Course updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating course', error: error.message });
    }
});

// Delete a course (DELETE /courses/:courseId)
router.delete('/:courseId', authenticateUser, async (req, res) => {
    const { courseId } = req.params;

    try {
        const courseRef = admin.database().ref(`courses/public/${courseId}`);
        const courseSnapshot = await courseRef.once('value');
        if (!courseSnapshot.exists()) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if the user is the creator of the course
        if (courseSnapshot.val().createdBy !== req.uid) {
            return res.status(403).json({ message: 'Unauthorized: Only the course creator can delete the course' });
        }

        await courseRef.remove();
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Error deleting course', error: error.message });
    }
});

// Enroll in a course (POST /courses/:courseId/enroll)
router.post('/:courseId/enroll', authenticateUser, async (req, res) => {
    const { courseId } = req.params;
    try {
        const courseRef = admin.database().ref(`courses/public/${courseId}`);
        const courseSnapshot = await courseRef.once('value');
        if (!courseSnapshot.exists()) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await courseRef.child('enrolledUsers').update({ [req.uid]: true });
        res.status(200).json({ message: 'Enrolled in course successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error enrolling in course', error: error.message });
    }
});

// Get users enrolled in a course (GET /courses/:courseId/users)
router.post('/:courseId/users', authenticateUser, async (req, res) => {
    const { courseId } = req.params;

    try {
        const courseRef = admin.database().ref(`courses/public/${courseId}`);
        const courseSnapshot = await courseRef.once('value');
        
        if (!courseSnapshot.exists()) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const courseData = courseSnapshot.val();
        const enrolledUsers = courseData.enrolledUsers || {};
        const userIds = Object.keys(enrolledUsers);

        // Fetch user details
        const userDetailsPromises = userIds.map(uid => 
            admin.database().ref(`users/${uid}`).once('value')
        );
        const userSnapshots = await Promise.all(userDetailsPromises);
        const users = userSnapshots.map(snapshot => {
            const userData = snapshot.val();
            return {
                userId: snapshot.key,
                name: userData.name || 'Anonymous',
                email: userData.email || 'No email provided'
            };
        });

        res.status(200).json({ 
            courseId,
            courseTitle: courseData.title,
            userCount: users.length,
            users 
        });
    } catch (error) {
        console.error('Error fetching users for course:', error);
        res.status(500).json({ message: 'Error fetching users for course', error: error.message });
    }
});

// Get course details (POST /courses/:courseId/details)
router.post('/:courseId/details', authenticateUser, async (req, res) => {
    const { courseId } = req.params;
    try {
        const courseRef = admin.database().ref(`courses/public/${courseId}`);
        const courseSnapshot = await courseRef.once('value');
        
        if (!courseSnapshot.exists()) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const courseData = courseSnapshot.val();
        const isEnrolled = courseData.enrolledUsers && courseData.enrolledUsers[req.uid];

        res.status(200).json({ 
            course: courseData,
            isEnrolled
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course details', error: error.message });
    }
});

// Get discussion posts (POST /courses/:courseId/discussion)
router.post('/:courseId/discussion', authenticateUser, async (req, res) => {
    const { courseId } = req.params;
    try {
        const postsRef = admin.database().ref(`courses/public/${courseId}/discussion`);
        const postsSnapshot = await postsRef.once('value');
        
        const posts = [];
        postsSnapshot.forEach(childSnapshot => {
            posts.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
            });
        });

        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching discussion posts', error: error.message });
    }
});

// Add a discussion post (POST /courses/:courseId/discussion/post)
router.post('/:courseId/discussion/post', authenticateUser, async (req, res) => {
    const { courseId } = req.params;
    const { content } = req.body;
    
    if (!content) {
        return res.status(400).json({ message: 'Post content is required' });
    }

    try {
        const userRef = admin.database().ref(`users/${req.uid}`);
        const userSnapshot = await userRef.once('value');
        const userData = userSnapshot.val();

        const newPost = {
            authorId: req.uid,
            authorName: userData.name || 'Anonymous',
            content,
            timestamp: admin.database.ServerValue.TIMESTAMP
        };

        const postRef = admin.database().ref(`courses/public/${courseId}/discussion`).push();
        await postRef.set(newPost);

        res.status(201).json({ message: 'Post added successfully', postId: postRef.key });
    } catch (error) {
        res.status(500).json({ message: 'Error adding discussion post', error: error.message });
    }
});


module.exports = router;