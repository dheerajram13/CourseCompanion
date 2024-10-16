// YourCourses.js
import React from 'react';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Courses = ({ courses, onDeleteCourse }) => {
    return (
        <List>
            {courses.map(course => (
                <ListItem 
                    key={course.courseId} 
                    secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => onDeleteCourse(course.courseId)}>
                            <DeleteIcon />
                        </IconButton>
                    }
                >
                    <ListItemText primary={course.title} />
                </ListItem>
            ))}
        </List>
    );
};

export default Courses;
