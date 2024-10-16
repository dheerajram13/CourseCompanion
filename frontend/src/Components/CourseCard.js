import React from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';

const CourseCard = ({ course, enrolled, onEnroll, onViewUsers, onViewCourse }) => {
    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card>
                <CardContent>
                    <Typography variant="h6" component="div">
                        {course.title}
                    </Typography>
                    <Typography color="text.secondary">
                        {course.courseCode}
                    </Typography>
                    <Typography variant="body2">
                        {course.description}
                    </Typography>
                    {enrolled ? (
                        <Button onClick={() => onViewCourse(course.courseId)} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            View Course
                        </Button>
                    ) : (
                        <Button onClick={() => onEnroll(course.courseId)} variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>
                            Enroll
                        </Button>
                    )}
                    <Button onClick={() => onViewUsers(course.courseId)} variant="outlined" fullWidth sx={{ mt: 1 }}>
                        View Users
                    </Button>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default CourseCard;