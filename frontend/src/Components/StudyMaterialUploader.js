import React, { useState, useEffect } from 'react';
import {
    Button,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Grid,
    Paper,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';

const StudyMaterialUploader = ({ uid }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [visibility, setVisibility] = useState('public');
    const [openModal, setOpenModal] = useState(false); 
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://34.46.247.125:81/courses/public', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ uid })
                });
        
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch courses');
                }
        
                const data = await response.json();
                const fetchedCourses = Object.entries(data.courses).map(([key, course]) => ({
                    id: key,
                    name: course.title || course.courseCode || key,
                }));
                setCourses(fetchedCourses);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setMessage('Failed to load courses: ' + error.message);
            }
        };
        
        fetchCourses();
    }, [uid]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setMessage('');
    };

    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    const handleUpload = async () => {
        if (!file || !selectedCourse) {
            setMessage('Please select a file and a course.');
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
        formData.append('course', selectedCourse);
        formData.append('visibility', visibility);
        formData.append('uid', uid);

        try {
            const response = await fetch('http://34.46.247.125:81/study-material/upload', {
                method: 'POST',
                body: formData,
            });
    
            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                setMessage('Error parsing server response');
                return;
            }
    
            if (response.ok) {
                setMessage('File uploaded successfully!');
                setFile(null);
                setSelectedCourse('');
                setVisibility('public');
                setOpenModal(false); // Close modal on success
            } else {
                setMessage(data.message || 'Upload failed');
            }
        } catch (error) {
            setMessage('Upload error: ' + error.message);
        }
    };

    return (
        <>
          <Grid container alignItems="center" sx={{ mb: 2, mt: 2  }}>
            <Grid item xs>
                <Typography variant="h4" gutterBottom textAlign="center">
                    Study Materials
                </Typography>
            </Grid>
            <Grid item>
                <Button
                variant="contained"
                onClick={() => setOpenModal(true)}
                sx={{ mb: 2 }}
            >
                Upload Study Material
            </Button>
            </Grid>
        </Grid>
           
            {/* Modal for uploading study material */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Upload Study Material</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<AttachFileIcon />}
                            fullWidth
                        >
                            Select File
                            <input type="file" hidden onChange={handleFileChange} />
                        </Button>
                        {file && <Typography variant="body2">{file.name}</Typography>}
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Select a Course</InputLabel>
                        <Select
                            value={selectedCourse}
                            onChange={handleCourseChange}
                            label="Select a Course"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {courses.length > 0 ? (
                                courses.map((course) => (
                                    <MenuItem key={course.id} value={course.id}>
                                        {course.name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>
                                    <em>No courses available</em>
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Visibility</InputLabel>
                        <Select
                            value={visibility}
                            onChange={(e) => setVisibility(e.target.value)}
                            label="Visibility"
                        >
                            <MenuItem value="public">
                                <PublicIcon sx={{ mr: 1 }} /> Public
                            </MenuItem>
                            <MenuItem value="private">
                                <LockIcon sx={{ mr: 1 }} /> Private
                            </MenuItem>
                        </Select>
                    </FormControl>

                    {message && (
                        <Box mt={2}>
                            <Alert severity={message.includes('successfully') ? 'success' : 'error'}>
                                {message}
                            </Alert>
                        </Box>
                    )}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleUpload} variant="contained" startIcon={<CloudUploadIcon />}>
                        Upload
                    </Button>
                    <Button onClick={() => setOpenModal(false)} variant="outlined">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default StudyMaterialUploader;
