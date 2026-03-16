import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Typography, Box } from "@mui/material";
import axios from 'axios';
import { useRouter } from 'next/router';
import { setTokenCookie } from '@/lib/auth-cookie';
import { toast } from 'react-toastify';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/router?path=api/auth/login', {
        username,
        password,
        applicationName: "battery",
      });
      setTokenCookie(null, response.data.token);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Dialog open={true} onClose={() => {}}>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h5" color="primary" fontWeight={700}>Battery IMS</Typography>
        </Box>
        <Typography variant="h6">Login</Typography>
        <Typography variant="body2" color="text.secondary">Sign in to your account</Typography>
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
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />
        <TextField
          margin="dense"
          label="Password"
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
            style={{ borderRadius: 15, backgroundColor: "#1565C0", fontSize: "13px" }}
            onClick={handleLogin}
            variant="contained"
          >
            Login
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default LoginPage;
