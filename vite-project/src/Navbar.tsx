import React from 'react';
import { Stack, Box, Typography, Switch, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

interface NavbarProps {
  isViewUser: boolean;
  toggleViewMode: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isViewUser, toggleViewMode }) => {
  return (
    <Stack direction="row" gap={6} alignSelf="flex-end" alignItems="center">
      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography variant="body1">admin</Typography>
        <Switch
          checked={isViewUser}
          onChange={toggleViewMode}
          inputProps={{ "aria-label": "controlled" }}
        />
        <Typography variant="body1">user</Typography>
      </Box>
      <IconButton>
        <LogoutIcon />
      </IconButton>
    </Stack>
  );
};

export default Navbar;
