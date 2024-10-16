import React from 'react';
import { Paper, Typography, Button, Grid } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const MaterialCard = ({ material, uid }) => {
    const handleOpenMaterial = async () => {
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

    // Function to get the correct icon based on file type
    const getFileIcon = () => {
        const fileExtension = material.fileUrl.split('.').pop();
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

    // Function to format file size in KB/MB
    const formatFileSize = (size) => {
        if (size < 1024) return `${size} bytes`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Function to shorten the file name to three words
    const shortenFileName = (name) => {
        const words = name.split(' ');
        return words.length > 3 ? `${words.slice(0, 3).join(' ')}...` : name;
    };

    return (
        <Grid item xs={12} sm={6}>
            <Paper elevation={3} style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                
                {/* File Icon and Name */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {getFileIcon()}
                    <div style={{ marginLeft: '10px' }}>
                        <Typography 
                            variant="body1" 
                            noWrap 
                            title={material.fileName} // Show full name on hover
                        >
                            {shortenFileName(material.fileName)}
                        </Typography>
                        {/* File Size */}
                        {material.fileSize && (
                            <><Typography variant="body2" style={{ color: 'black' }}>
                                body={material.course}
                            </Typography>
                            <Typography variant="body2" style={{ color: 'gray' }}>
                                    {formatFileSize(material.fileSize)}
                                </Typography></>
                        )}
                    </div>
                </div>

                {/* Open File Button */}
                <Button 
                    onClick={handleOpenMaterial}
                    variant="contained" 
                    color="primary" 
                    size="small"
                >
                    Open
                </Button>
            </Paper>
        </Grid>
    );
};

export default MaterialCard;
