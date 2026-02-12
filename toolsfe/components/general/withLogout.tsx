import React from 'react';
import { removeTokenCookie } from '@/lib/auth-cookie';
import { Button } from '@mui/material';

const LogoutButton: React.FC = () => {
    const handleLogout = () => {
        removeTokenCookie(null);
        window.location.href = '/login';
    };
    return (
        <Button
            style={{
                borderRadius: 15,
                backgroundColor: "#000",
                fontSize: "13px"
            }}
            variant="contained"
            onClick={handleLogout}
        >Logout
        </Button>
    );
}

export default LogoutButton;
