import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import UserTable from "./UserTable";
import AddUserDialog from "./AddUserDialog";
import { useQuery } from "react-query";
import axios from "axios";
import { toast } from "react-toastify";

const UserIndex: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);

  const { data: users = [], refetch } = useQuery("allUsers", async () => {
    const res = await axios.get(`/api/router?path=api/auth/users`);
    return Array.isArray(res.data) ? res.data : [];
  }, { refetchOnWindowFocus: false });

  const handleEdit = (user: any) => {
    setEditData(user);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/router?path=api/auth/${id}`);
      toast.success("User deleted.");
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditData(null);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700}>Users</Typography>
        <Button
          variant="contained"
          style={{ borderRadius: 15, backgroundColor: "#9B2735", fontSize: "13px" }}
          onClick={() => setDialogOpen(true)}
        >
          Add User
        </Button>
      </Box>

      <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />

      <AddUserDialog
        open={dialogOpen}
        editData={editData}
        handleClose={handleDialogClose}
        onSuccess={refetch}
      />
    </Box>
  );
};

export default UserIndex;
