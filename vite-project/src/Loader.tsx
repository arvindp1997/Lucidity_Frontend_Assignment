import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Loader: React.FC = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center",   height: "100vh",
        width: "100vw", 
        position: "fixed",  }}>
      <CircularProgress />
    </Box>
  );
};

export default Loader;
