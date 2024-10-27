import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, Grid, Divider, Button } from '@mui/material';
import DiscussionBoard from './DiscussionBoard';
import CourseMaterials from './CourseMaterials';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import config from '../config';
const CourseDetailPage = ({ uid }) => {
    const { courseId } = useParams();
    const [courseDetails, setCourseDetails] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const baseURL = config.baseUrl;

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const response = await fetch(`${baseURL}/courses/${courseId}/details`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ uid })
                });

                if (response.ok) {
                    const data = await response.json();
                    setCourseDetails(data.course);
                    setIsEnrolled(data.isEnrolled);
                } else {
                    console.error('Failed to fetch course details');
                }
            } catch (error) {
                console.error('Error fetching course details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId, uid]);



    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!isEnrolled) {
        return <Navigate to="/courses" />;
    }
    const handleBack = () => {
        navigate(-1); 
    };

    return (
        
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={handleBack}
                >
                    Back to Course
                </Button>
            </Box>
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Typography variant="h4" gutterBottom>{courseDetails.title}</Typography>
                <Typography variant="subtitle1" gutterBottom>Course Code: {courseDetails.courseCode}</Typography>
                <Typography variant="body1" paragraph>{courseDetails.description}</Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h5" gutterBottom>Discussion Board</Typography>
                        <DiscussionBoard courseId={courseId} uid={uid} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" gutterBottom>Course Materials</Typography>
                        <CourseMaterials courseId={courseId} uid={uid} />
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default CourseDetailPage;