import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Grid } from '@mui/material';
import AddCourseModal from './AddCourseModal';
import { fetchMaterials } from './fetchMaterials';
import { useNavigate } from 'react-router-dom';
import Chat from './Chat';
import CourseCard from './CourseCard';
import MaterialCard from './MaterialCard';
import UsersModal from './UsersModal';
import StudyMaterialUploader from './StudyMaterialUploader';

const CourseManager = ({ uid }) => {
    const [courses, setCourses] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [open, setOpen] = useState(false);
    const [enrolledCourses, setEnrolledCourses] = useState({});
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [usersModalOpen, setUsersModalOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatRecipient, setChatRecipient] = useState(null);
    const [chatUserId, setChatUserId] = useState(null);
    const navigate = useNavigate();

    

    // Fetch courses
    const fetchCourses = async () => {
        try {
            const userResponse = await fetch('http://localhost:81/courses/public', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uid })
            });

            if (userResponse.ok) {
                const userData = await userResponse.json();
                const userCoursesArray = Object.entries(userData.courses).map(([key, course]) => ({
                    courseId: key,
                    ...course
                }));
                setCourses(userCoursesArray);
                
                const enrolled = {};
                userCoursesArray.forEach(course => {
                    if (course.enrolledUsers && course.enrolledUsers[uid]) {
                        enrolled[course.courseId] = true;
                    }
                });
                setEnrolledCourses(enrolled);
            } else {
                console.error('Failed to fetch user courses');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    // Fetch study materials
    const fetchStudyMaterials = async () => {
        const materialsData = await fetchMaterials('', 'public');
        setMaterials(materialsData);
    };

    useEffect(() => {
        fetchCourses();
        fetchStudyMaterials();
    }, [uid]);

    // Handle course enrollment
    const handleEnroll = async (courseId) => {
        try {
            const response = await fetch(`http://localhost:81/courses/${courseId}/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uid })
            });

            if (response.ok) {
                setEnrolledCourses(prev => ({ ...prev, [courseId]: true }));
            } else {
                console.error('Failed to enroll in course');
            }
        } catch (error) {
            console.error('Error enrolling in course:', error);
        }
    };

    // Handle opening the users modal
    const handleOpenUsersModal = async (courseId) => {
        try {
            const response = await fetch(`http://localhost:81/courses/${courseId}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uid })
            });

            if (response.ok) {
                const data = await response.json();
                setSelectedCourse(data);
                setUsersModalOpen(true);
            } else {
                console.error('Failed to fetch course users');
            }
        } catch (error) {
            console.error('Error fetching course users:', error);
        }
    };

    // Handle adding a course
    const handleAddCourse = async (newCourseData) => {
        const newCourse = {
            uid,
            ...newCourseData,
        };

        try {
            const response = await fetch('http://localhost:81/courses/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCourse)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setCourses(prevCourses => [
                ...prevCourses,
            ]);
            setOpen(false);
            fetchCourses();
        } catch (error) {
            console.error('Error adding course:', error.message);
        }
    };

    // Handle course deletion
    const handleDeleteCourse = async (courseId) => {
        try {
            const response = await fetch(`http://localhost:81/courses/${courseId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uid })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await fetchCourses();
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    // Handle chat user selection
    const handleChatUser = (userUid, userName) => {
        setChatUserId(userUid);
        setChatRecipient({ uid: userUid, name: userName });
        setUsersModalOpen(false);
        setChatOpen(true);
    };

    const handleViewCourse = (courseId) => { 
          navigate(`/courses/${courseId}`);
    };



    return (
        <Container maxWidth="lg">
                <Grid container alignItems="center" sx={{ mb: 2 }}>
            <Grid item xs>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Courses
                </Typography>
            </Grid>
            <Grid item>
                <Button variant="contained" onClick={() => setOpen(true)}>
                    Add Course
                </Button>
            </Grid>
        </Grid>

            
            <Grid container spacing={3}>
                {courses.map((course) => (
                    <CourseCard 
                        key={course.courseId} 
                        course={course} 
                        enrolled={enrolledCourses[course.courseId]}
                        onEnroll={() => handleEnroll(course.courseId)}
                        onViewUsers={() => handleOpenUsersModal(course.courseId)}
                        onViewCourse={() => handleViewCourse(course.courseId)}
                    />
                ))}
            </Grid>

            {chatOpen && chatRecipient && (
                <Chat 
                    uid={uid} 
                    recipient={chatRecipient.uid}
                    recipientName={chatRecipient.name}
                    closeChat={() => {
                        setChatOpen(false);
                        setChatRecipient(null);
                    }} 
                />
            )}

            {/* <Typography variant="h4" gutterBottom style={{ marginTop: '40px' }}>Study Materials</Typography> */}
            <StudyMaterialUploader uid={uid}/>
            <Grid container spacing={3}>
                {materials.map((material) => (
                    <MaterialCard 
                        key={material.fileName} 
                        material={material}
                        uid={uid} 
                    />
                ))}
            </Grid>

            <AddCourseModal 
                open={open} 
                handleClose={() => setOpen(false)} 
                handleAddCourse={handleAddCourse} 
            />
             <UsersModal 
                open={usersModalOpen} 
                course={selectedCourse} 
                uid={uid} 
                handleChatUser={handleChatUser}
                handleClose={() => setUsersModalOpen(false)} 
            />
        </Container>
    );
};

export default CourseManager;
