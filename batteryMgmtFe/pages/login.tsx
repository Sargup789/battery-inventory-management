import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { setTokenCookie } from '@/lib/auth-cookie';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useTranslation('common');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/router?path=api/auth/login', {
        username,
        password,
        applicationName: 'battery',
      });
      setTokenCookie(null, response.data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || t('login.failed'));
    }
  };

  return (
    <Dialog open={true} onClose={() => {}}>
      <DialogTitle>
        <Box display="flex" alignItems="center" sx={{ width: '100%', height: '150px' }}>
          <img src="/images/ttcm.jpeg" alt="Logo" style={{ width: '100%' }} />
        </Box>
        <Typography variant="h6">{t('login.title')}</Typography>
        <Typography variant="body2" color="text.secondary">{t('login.subtitle')}</Typography>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={t('login.username')}
          type="text"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />
        <TextField
          margin="dense"
          label={t('login.password')}
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Box style={{ display: 'flex', width: '95%', justifyContent: 'flex-end', mb: 1 }}>
          <Button
            style={{ borderRadius: 15, backgroundColor: '#9B2735', fontSize: '13px' }}
            onClick={handleLogin}
            variant="contained"
          >
            {t('login.button')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default LoginPage;
