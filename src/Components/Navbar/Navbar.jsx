import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

export default function Navbar({ handleGoogleOAuthSignIn, handleGoogleOAuthSignOut, signInStatus, isLoadingData }) {
    return (
        <>
            <Box 
                border={2}
                borderColor='border.grey'
                sx={{ flexGrow: 1 }}
            >
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="primary"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Expense-Tracker
                        </Typography>
                        <Button 
                            color="primary"
                            onClick={() => signInStatus ? handleGoogleOAuthSignOut() : handleGoogleOAuthSignIn()}
                        >
                            {signInStatus ? 'Logout' : 'Login'}
                        </Button>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box sx={{display: isLoadingData ? 'block' : 'hidden'}}>
                <LinearProgress sx={{height: '1px'}}/>
            </Box>
        </>
    )
}

Navbar.propTypes = {
  handleGoogleOAuthSignIn: PropTypes.func.isRequired,
  handleGoogleOAuthSignOut: PropTypes.func.isRequired,
  signInStatus: PropTypes.bool.isRequired,
  isLoadingData: PropTypes.bool.isRequired
};

