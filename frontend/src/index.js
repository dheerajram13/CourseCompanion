import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';


const theme = createTheme({
    palette: {
        primary: {
            main: '#4a90e2', 
        },
        secondary: {
            main: '#ff4081', 
        },
    },
    typography: {
        h1: {
            fontFamily: '"Roboto", sans-serif',
        },
        h4: {
            fontFamily: '"Roboto", sans-serif',
            fontWeight: 600,
        },
    },
});

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
    </ThemeProvider>,
    document.getElementById('root')
);
