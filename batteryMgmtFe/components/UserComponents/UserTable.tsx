import { UserApiResponse } from '@/pages/user';
import { DeleteOutline } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { useTranslation } from 'next-i18next';

interface Props {
  userApiData: UserApiResponse;
  deleteUser: (id: string) => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  page: number;
  size: number;
}

export default function UserTable({ userApiData, deleteUser, setPage, setSize, page, size }: Props) {
  const { t } = useTranslation('common');

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(+event.target.value);
    setPage(1);
  };

  if (!userApiData.data) return (<div>{t('common.loading')}</div>);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>{t('user.username')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('user.password')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('user.role')}</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('user.action')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userApiData.data.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.username}
                </TableCell>
                <TableCell align="center">{'*****'}</TableCell>
                <TableCell align="center">
                  {row.role === 'administrator'
                    ? t('user.administrator')
                    : row.role === 'editor'
                      ? t('user.manager')
                      : row.role === 'viewer'
                        ? t('user.operator')
                        : ''}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title={t('common.delete')} followCursor>
                    <IconButton
                      size="small"
                      onClick={() => deleteUser(row.id)}
                      children={<DeleteOutline fontSize="small" />}
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={userApiData.totalCount}
        rowsPerPage={size}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
