import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: 'rgb(10,25,41)',
            paper: 'rgb(6,12,18)'
        },
        border: {
            grey: 'rgb(24,41,58)'
        }
    },
});


ReactDOM.createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
            <React.StrictMode>
                <App />
            </React.StrictMode>
    </ThemeProvider>
)
