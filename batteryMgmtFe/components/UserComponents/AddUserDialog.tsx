import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, Grid, IconButton, Box
} from "@mui/material";
import { HighlightOff } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";

type Props = {
  open: boolean;
  editData: any | null;
  handleClose: () => void;
  onSuccess: () => void;
};

const AddUserDialog = ({ open, editData, handleClose, onSuccess }: Props) => {
  const isEdit = Boolean(editData);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("editor");

  useEffect(() => {
    if (editData) {
      setUsername(editData.username || "");
      setRole(editData.role || "editor");
      setPassword("");
    } else {
      setUsername("");
      setPassword("");
      setRole("editor");
    }
  }, [editData, open]);

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        const payload: any = { role };
        if (password) payload.password = password;
        await axios.put(`/api/router?path=api/auth/users/${editData.id || editData._id}`, payload);
        toast.success("User updated.");
      } else {
        await axios.post(`/api/router?path=api/auth/register`, { username, password, role });
        toast.success("User created.");
      }
      onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {isEdit ? "Edit User" : "Add User"}
        </Box>
        <IconButton
          children={<HighlightOff />}
          color="inherit"
          onClick={handleClose}
          sx={{ transform: "translate(8px, -8px)" }}
        />
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              fullWidth
              size="small"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isEdit}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={isEdit ? "New Password (leave blank to keep)" : "Password"}
              fullWidth
              size="small"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select value={role} label="Role" onChange={(e) => setRole(e.target.value)}>
                <MenuItem value="viewer">Viewer</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
                <MenuItem value="administrator">Administrator</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          variant="contained"
          style={{
            borderRadius: 15,
            backgroundColor: "#9B2735",
            fontSize: "13px"
          }}
        >
          {isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
