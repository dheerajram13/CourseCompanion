import React, { useState } from 'react';
import { Modal, Button, TextField, Box, Typography } from '@mui/material';

const AddCourseModal = ({ open, handleClose, handleAddCourse }) => {
    const [courseCode, setCourseCode] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [semester, setSemester] = useState('');
    const [year, setYear] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        const newCourseData = {
            courseCode,
            title,
            description,
            semester,
            year,
        };
        handleAddCourse(newCourseData);
        setCourseCode('');
        setTitle('');
        setDescription('');
        setSemester('');
        setYear('');
        handleClose(); 
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    padding: 2,
                    backgroundColor: 'white',
                    borderRadius: 1,
                    width: 400,
                    margin: 'auto',
                    mt: '10%',
                    overflowY: 'scroll', 
                    maxHeight: '80vh' 
                }}
            >
                <Typography variant="h6" gutterBottom>Add New Course</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Course Code"
                        value={courseCode}
                        onChange={(e) => setCourseCode(e.target.value)}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Semester"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Add Course
                    </Button>
                </form>
            </Box>
        </Modal>
    );
};

export default AddCourseModal;
