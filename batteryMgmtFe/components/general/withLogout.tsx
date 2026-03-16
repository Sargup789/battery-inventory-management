import React from 'react';
import { useRouter } from 'next/router';
import { removeTokenCookie } from '@/lib/auth-cookie';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    removeTokenCookie(null);
    router.push('/login');
  };

  return (
    <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
      Logout
    </Button>
  );
};

export default LogoutButton;
