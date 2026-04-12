import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import UserTable from './UserTable';
import AddUserDialog from './AddUserDialog';
import { useQuery } from 'react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserApiResponse, UserData } from '@/pages/user';
import { useTranslation } from 'next-i18next';

const UserIndex: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userDialogData, setUserDialogData] = useState<UserData | {}>({});
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const { t } = useTranslation('common');

  const { data: userApiData = { data: [], totalCount: 0 }, refetch } = useQuery(
    ['allUsers', page, size],
    async (): Promise<UserApiResponse> => {
      const res = await axios.get(`/api/router?path=api/auth/users&page=${page}&size=${size}`);
      if (Array.isArray(res.data)) {
        return { data: res.data, totalCount: res.data.length };
      }
      return { data: res.data?.data || [], totalCount: res.data?.totalCount || 0 };
    },
    { refetchOnWindowFocus: false }
  );

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/router?path=api/auth/${id}`);
      toast.success(t('user.userDeleted'));
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('user.deleteFailed'));
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setUserDialogData({});
  };

  const handleSubmit = async (values: UserData) => {
    try {
      if (values.id) {
        await axios.put(`/api/router?path=api/auth/users/${values.id}`, values);
        toast.success(t('user.userUpdated'));
      } else {
        await axios.post('/api/router?path=api/auth/register', values);
        toast.success(t('user.userCreated'));
      }
      refetch();
      handleDialogClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('user.errorOccurred'));
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700} />
        <Button
          variant="contained"
          style={{ borderRadius: 15, backgroundColor: '#9B2735', fontSize: '13px' }}
          onClick={() => setDialogOpen(true)}
        >
          {t('user.addUser')}
        </Button>
      </Box>

      <UserTable
        userApiData={userApiData}
        deleteUser={handleDelete}
        setPage={setPage}
        setSize={setSize}
        page={page}
        size={size}
      />

      <AddUserDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        userDialogData={userDialogData}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

export default UserIndex;
