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

interface Props {
  userApiData: UserApiResponse;
  deleteUser: (id: string) => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  page: number;
  size: number;
}

export default function UserTable({ userApiData, deleteUser, setPage, setSize, page, size }: Props) {
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(+event.target.value);
    setPage(1);
  };

  if (!userApiData.data) return (<div>Loading...</div>);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Password</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Role</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userApiData.data.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.username}
                </TableCell>
                <TableCell align="center">{"*****"}</TableCell>
                <TableCell align="center">
                  {row.role === "administrator"
                    ? "Administrator"
                    : row.role === "editor"
                      ? "Manager"
                      : row.role === "viewer"
                        ? "Operator"
                        : ""}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Delete" followCursor>
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
