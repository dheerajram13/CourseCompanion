import React, { useState, useEffect } from 'react';
import { Button, Paper, Typography, Grid } from '@mui/material';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';


const CourseMaterials = ({ courseId, uid }) => {
    const [materials, setMaterials] = useState([]);


    useEffect(() => {
        fetchMaterials();
    }, [courseId, uid]);

    const shortenFileName = (name) => {
        const words = name.split(' ');
        return words.length > 3 ? `${words.slice(0, 2).join(' ')}...` : name;
    };
    const fetchMaterials = async () => {
        try {
            const response = await fetch(`http://localhost:81/study-material/materials`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    uid,
                    course: courseId
                })
            });

            if (response.ok) {
                const materialsData = await response.json();
                setMaterials(materialsData);
            } else {
                console.error('Failed to fetch course materials');
            }
        } catch (error) {
            console.error('Error fetching course materials:', error);
        }
    };

    const handleOpenMaterial = async (material) => {
        try {
            const storage = getStorage();
            const fileRef = ref(storage, material.fileUrl);
            const url = await getDownloadURL(fileRef);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error opening material:', error);
            alert('An error occurred while opening the file.');
        }
    };

    const getFileIcon = (fileUrl) => {
        const fileExtension = fileUrl.split('.').pop().toLowerCase();
        switch (fileExtension) {
            case 'pdf':
                return <PictureAsPdfIcon style={{ fontSize: '35px' }} />;
            case 'doc':
            case 'docx':
                return <DescriptionIcon style={{ fontSize: '35px' }} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
                return <ImageIcon style={{ fontSize: '35px' }} />;
            default:
                return <InsertDriveFileIcon style={{ fontSize: '35px' }} />;
        }
    };

    const formatFileSize = (size) => {
        if (size < 1024) return `${size} bytes`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    };

 

    return (
            <Grid container spacing={2}>
                {materials.map((material, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Paper elevation={3} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {getFileIcon(material.fileUrl)}
                                <div style={{ marginLeft: '10px' }}>
                                    <Typography variant="body1" noWrap title={material.fileName}>
                                  {shortenFileName(material.fileName)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {material.course}
                                    </Typography>
                                    {material.fileSize && (
                                        <Typography variant="body2" color="textSecondary">
                                            {formatFileSize(material.fileSize)}
                                        </Typography>
                                    )}
                                </div>
                            </div>
                            <Button 
                                onClick={() => handleOpenMaterial(material)}
                                variant="contained" 
                                color="primary" 
                                size="small"
                            >
                                Open
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
    );
};

export default CourseMaterials;