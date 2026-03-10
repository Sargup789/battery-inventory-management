import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Typography, Box } from "@mui/material";
import axios from 'axios';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { setTokenCookie } from '@/lib/auth-cookie';
import { toast } from 'react-toastify';
import AddPasswordDialog from '@/components/UserComponents/AddPasswordDialog';

export interface PasswordData {
    username: string;
    oldPassword: string;
    newPassword: string;
}

const LoginModal: React.FC = () => {
    const { t } = useTranslation('common');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
    const [resetPasswordDialogData, setResetPasswordDialogData] = useState<{}>({});
    const router = useRouter();

    const handleClose = () => {
        setResetPasswordDialogOpen(false);
        setResetPasswordDialogData({});
    };

    const onSubmit = async (data: PasswordData) => {
        try {
            await axios.post(`/api/router?path=api/auth/reset-password`, data);
            setUsername(data.username)
            setPassword(data.newPassword)
            handleLogin()
        } catch (error: any) {
            toast.error(error.response?.data?.message || t('login.resetFailed'));
            console.error(error);
        }
        finally {
            handleClose()
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/router?path=api/auth/login', {
                username,
                password,
                applicationName: "tools",
            });
            setTokenCookie(null, response.data.token);
            let isSameDomain = false;
            try {
                isSameDomain = new URL(window.document.referrer).origin === window.location.origin;
            } catch {
                // Ignore invalid or empty referrer and use default redirect.
            }
            if (typeof window !== 'undefined' && window.history.length > 2 && isSameDomain) {
                router.back();
            } else {
                router.push('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || t('login.loginFailed'));
        }
    };

    return (
        <>
            <Dialog open={true} onClose={() => { }}>
                <DialogTitle>
                    <img
                        src={"/images/ttcm.jpeg"}
                        alt={t('login.logo')}
                        style={{  width: '100%', height: '150px', display: 'flex', alignItems: 'center' }}
                    />
                    <h2>{t('login.title')}</h2>
                    <p>{t('login.subtitle')}</p>
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
                    />
                    <TextField
                        margin="dense"
                        label={t('login.password')}
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <Typography color="error">{error}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Box style={{ display: 'flex', width: '95%', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Button
                            onClick={() => setResetPasswordDialogOpen(true)}
                            style={{
                                borderRadius: 15,
                                backgroundColor: "grey",
                                fontSize: "13px"
                            }}
                            variant="contained"
                        >
                            {t('login.resetPassword')}
                        </Button>
                        <Button
                            style={{
                                borderRadius: 15,
                                backgroundColor: "#9B2735",
                                fontSize: "13px"
                            }}
                            onClick={handleLogin}
                            variant="contained"
                        >
                            {t('login.loginButton')}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
            <AddPasswordDialog
                open={resetPasswordDialogOpen}
                userDialogData={resetPasswordDialogData}
                handleClose={handleClose}
                onSubmit={onSubmit}
            />
        </>
    );
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default LoginModal;
