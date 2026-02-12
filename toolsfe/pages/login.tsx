import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Typography, Box } from "@mui/material";
import axios from 'axios';
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
            const response = await axios.post(`/api/router?path=api/auth/reset-password`, data);
            console.log(response.data?.message + ". Please login again" || 'Reset password successful');
            setUsername(data.username)
            setPassword(data.newPassword)
            handleLogin()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Reset password failed');
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
            } catch (err: any) {
                toast.error(err.response?.data?.message || 'Not able to login. Please check username and password');
                console.warn("Invalid or empty referrer");
            }
            if (typeof window !== 'undefined' && window.history.length > 2 && isSameDomain) {
                router.back();
            } else {
                router.push('/');
            }
        } catch (err: any) {
            console.log(err.message);
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <>
            <Dialog open={true} onClose={() => { }}>
                <DialogTitle>
                    <img
                        src={"/images/toyota.png"}
                        alt="Logo"
                        style={{ width: '75%', height: '200px', marginLeft: '40px' }}
                    />
                    <h2>Login</h2>
                    <p>Sign In to your account</p>
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Username"
                        type="text"
                        fullWidth
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Password"
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
                            Reset Password
                        </Button>
                        <Button
                            style={{
                                borderRadius: 15,
                                backgroundColor: "#E96820",
                                fontSize: "13px"
                            }}
                            onClick={handleLogin}
                            variant="contained"
                        >
                            Login
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

export default LoginModal;
