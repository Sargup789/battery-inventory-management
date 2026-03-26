import React from 'react';
import { removeTokenCookie } from '@/lib/auth-cookie';
import { Button } from '@mui/material';
import { useTranslation } from 'next-i18next';

const LogoutButton: React.FC = () => {
    const { t } = useTranslation('common');
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
        >{t('nav.logout')}
        </Button>
    );
}

export default LogoutButton;
