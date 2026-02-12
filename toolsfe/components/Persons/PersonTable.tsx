import { PersonData } from './AddPersonDialog';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
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
    personData: PersonData[];
    deletePerson: (id: string) => void;
    editPerson: (data: PersonData) => void;
    setPage: (page: number) => void;
    setSize: (size: number) => void;
    page: number;
    size: number;
}

export default function PersonTable({
    personData,
    deletePerson,
    editPerson,
    setPage,
    setSize,
    page,
    size,
}: Props) {
    if (!personData) return <div>Loading...</div>;

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage + 1); // Backend is 1-indexed, but Material-UI pagination is 0-indexed.
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(+event.target.value);
        setPage(1); // Reset to the first page when rows per page change.
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer component={Paper}>
                <Table aria-label="persons table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                Designation
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                Email ID
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                Phone Number
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                Immediate Boss
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {personData.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="center">{row.designation}</TableCell>
                                <TableCell align="center">{row.emailId}</TableCell>
                                <TableCell align="center">{row.phoneNumber}</TableCell>
                                <TableCell align="center">{row.immediateBoss || '-'}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Edit" followCursor>
                                        <IconButton
                                            size="small"
                                            sx={{
                                                mr: 0.5,
                                            }}
                                            onClick={() => editPerson(row)}
                                            children={<EditOutlined fontSize="small" />}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Delete" followCursor>
                                        <IconButton
                                            size="small"
                                            onClick={() => deletePerson(row.id!)}
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
                count={personData.length}
                rowsPerPage={size}
                page={page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}
