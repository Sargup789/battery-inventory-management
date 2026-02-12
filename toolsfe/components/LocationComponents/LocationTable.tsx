import { ZoneData } from '@/pages/location';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { Box, Collapse, IconButton, Tooltip, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';

interface Props {
    zoneData: ZoneData[]
    deleteZone: (id: string) => void
    editZone: (data: ZoneData) => void
    setPage: (page: number) => void
    setSize: (size: number) => void
    page: number
    size: number
}

interface Column {
    id: 'name' | 'occupiedCapacity' | 'maxCapacity';
    label: string;
    minWidth?: number;
    align?: 'center';
    format?: (value: number) => string;
}

const columns: Column[] = [
    { id: 'name', label: 'Location Name', minWidth: 170 },
    { id: 'occupiedCapacity', label: 'Occupied Capacity', minWidth: 100 },
    {
        id: 'maxCapacity',
        label: 'Max Capacity',
        minWidth: 100
    },
];

function Row(props: {
    row: ZoneData, deleteZone: (id: string) => void
    editZone: (data: ZoneData) => void
}) {

    const { row, deleteZone, editZone } = props;
    const [open, setOpen] = React.useState(false);

    const sumOfValue = (array: number[]) => {
        let sum = 0
        for (let i = 0; i < array.length; i++) {
            sum += array[i];
        }
        return sum
    }

    const maxCapacity = row?.isParentZone && row.subZones ? sumOfValue(row.subZones.map((zone) => zone.maxCapacity ? parseInt(zone.maxCapacity) : 0)) : row.maxCapacity
    const locOccupied = row?.isParentZone && row.subZones ? sumOfValue(row.subZones.map((zone) => zone.occupiedLocations.length)) : row.occupiedLocations.length

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {row.isParentZone === true ? (open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />) : ""}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell align="center">{row.locationPrefix || "N/A"}</TableCell>
                <TableCell align="center">{maxCapacity}</TableCell>
                <TableCell align="center">{locOccupied}</TableCell>
                <TableCell align='center'>{row.isFinalZone ? row.isFinalZone.toString().toUpperCase() : "FALSE"}</TableCell>
                <TableCell align='center'>{row.isParentZone ? row.isParentZone.toString().toUpperCase() : "FALSE"}</TableCell>
                <TableCell align='center'>
                    <Tooltip title="Edit" followCursor>
                        <IconButton
                            size="small"
                            sx={{
                                mr: 0.5,
                            }}
                            onClick={() => editZone(row)}
                            children={<EditOutlined fontSize="small" />}
                        />
                    </Tooltip>
                    <Tooltip title="Delete" followCursor>
                        <IconButton
                            size="small"
                            onClick={() => deleteZone(row.id)}
                            children={<DeleteOutline fontSize="small" />}
                        />
                    </Tooltip>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Sub Zones
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center' sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                        <TableCell align='center' sx={{ fontWeight: 'bold' }}>Loc. Prefix</TableCell>
                                        <TableCell align='center' sx={{ fontWeight: 'bold' }}>Max Capacity</TableCell>
                                        <TableCell align='center' sx={{ fontWeight: 'bold' }}>Loc. Occupied</TableCell>
                                        <TableCell align='center' sx={{ fontWeight: 'bold' }}>Is Final Zone</TableCell>
                                        {/* <TableCell align='center'>Is Parent Zone</TableCell> */}
                                        <TableCell align='center' sx={{ fontWeight: 'bold' }}>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                {row.subZones && <TableBody>
                                    {row.subZones.map((subRow) => (
                                        <TableRow key={subRow.id}>
                                            <TableCell align='center'>{subRow.name}</TableCell>
                                            <TableCell align='center'>{subRow.locationPrefix}</TableCell>
                                            <TableCell align='center'>{subRow.maxCapacity}</TableCell>
                                            <TableCell align='center'>{subRow.occupiedLocations.length}</TableCell>
                                            <TableCell align='center'>{subRow.isFinalZone ? subRow.isFinalZone.toString().toUpperCase() : "FALSE"}</TableCell>
                                            <TableCell align='center'>
                                                <Tooltip title="Edit" followCursor>
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            mr: 0.5,
                                                        }}
                                                        onClick={() => editZone(subRow)}
                                                        children={<EditOutlined fontSize="small" />}
                                                    />
                                                </Tooltip>
                                                <Tooltip title="Delete" followCursor>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => deleteZone(subRow.id)}
                                                        children={<DeleteOutline fontSize="small" />}
                                                    />
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>}
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function LocationTable({ zoneData, deleteZone, editZone, setPage, setSize, page, size }: Props) {
    if (!zoneData) return (<div></div>)

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage + 1);  // Backend is 1-indexed, but Material-UI pagination is 0-indexed.
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSize(+event.target.value);
        setPage(1);  // Reset to the first page when rows per page change.
    };


    if (!zoneData) return (<div>Loading...</div>)

    console.log(zoneData, 'zz')

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Loc. Prefix</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Max Capacity</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Loc. Occupied</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Is Final Zone</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Is Parent Zone</TableCell>
                            <TableCell align='center' sx={{ fontWeight: 'bold' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {zoneData.map((row) => {
                            if (row.isSubZone == true) return null
                            else return <Row key={row.name} row={row} deleteZone={deleteZone} editZone={editZone} />
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={zoneData.length}
                rowsPerPage={size}
                page={page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );

}


