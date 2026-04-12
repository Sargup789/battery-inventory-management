import React from 'react';
import { useRouter } from 'next/router';
import { removeTokenCookie } from '@/lib/auth-cookie';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslation } from 'next-i18next';

const LogoutButton: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleLogout = () => {
    removeTokenCookie(null);
    router.push('/login');
  };

  return (
    <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
      {t('common.logout')}
    </Button>
  );
};

export default LogoutButton;
