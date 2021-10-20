import React from 'react';
import "../Styles/Spinner.scss"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Spinner = () => {
    return (
        <Box className="spinner" sx={{ display: 'flex' }}>
            <CircularProgress />
        </Box>
    )
}

export default Spinner;