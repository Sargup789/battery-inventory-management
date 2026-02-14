import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';
import { Box, Card, CardActions, CardContent, Collapse, TablePagination, Typography } from '@mui/material';
import { ZoneData } from '@/pages/location';


interface Props {
  dashboardData: ZoneData[]
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
  { id: 'name', label: 'Zone Name', minWidth: 170 },
  { id: 'occupiedCapacity', label: 'Occupied Capactity', minWidth: 100 },
  {
    id: 'maxCapacity',
    label: 'maxCapacity',
    minWidth: 100
  },
];

function Row(props: { row: ZoneData }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const getCapacity = (value?: string) => {
    const parsed = parseInt(value || "0", 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  };
  const getOccupiedCount = (zone?: Partial<ZoneData>) =>
    Array.isArray(zone?.occupiedLocations) ? zone.occupiedLocations.length : 0;
  const subZones = Array.isArray(row?.subZones) ? row.subZones : [];

  const maxCapacity =
    row?.isParentZone && subZones.length > 0
      ? subZones.reduce((sum, zone) => sum + getCapacity(zone.maxCapacity), 0)
      : getCapacity(row.maxCapacity);
  const locOccupied =
    row?.isParentZone && subZones.length > 0
      ? subZones.reduce((sum, zone) => sum + getOccupiedCount(zone), 0)
      : getOccupiedCount(row);
  const available = maxCapacity - locOccupied

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
        <TableCell align="center">{locOccupied}</TableCell>
        <TableCell align="center">
          {available}
        </TableCell>
        <TableCell align="center">{maxCapacity}</TableCell>
        <TableCell align="center">{row.isActive ? row.isActive.toString().toUpperCase() : "FALSE"}</TableCell>
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
                    <TableCell align='center' sx={{ fontWeight: 'bold' }}>Zone Name</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Occupied</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Available</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Active</TableCell>
                  </TableRow>
                </TableHead>
                {subZones.length > 0 && <TableBody>
                  {subZones.map((subRow) => (
                    <TableRow key={subRow.id}>
                      <TableCell component="th" scope="row" align="center">
                        {subRow.name}
                      </TableCell>
                      <TableCell align="center">{getOccupiedCount(subRow)}</TableCell>
                      <TableCell align="center">{getCapacity(subRow.maxCapacity) - getOccupiedCount(subRow)}</TableCell>
                      <TableCell align="center">{subRow.maxCapacity}</TableCell>
                      <TableCell align="center">{subRow.isActive ? subRow.isActive.toString().toUpperCase() : "FALSE"}</TableCell>
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

export default function DashboardTable({ dashboardData, setPage, setSize, page, size }: Props) {
  if (!dashboardData) return (<div></div>)

  const getCapacity = (value?: string) => {
    const parsed = parseInt(value || "0", 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  };
  const getOccupiedCount = (zone?: Partial<ZoneData>) =>
    Array.isArray(zone?.occupiedLocations) ? zone.occupiedLocations.length : 0;
  const getSubZones = (zone?: Partial<ZoneData>) =>
    Array.isArray(zone?.subZones) ? zone.subZones : [];

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage + 1);  // +1 because backend pages are 1-indexed while material-ui's pagination is 0-indexed.
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(+event.target.value);
    setPage(1);  // reset to the first page whenever the rows per page size changes.
  };

  const totalMaxCapacity = dashboardData.reduce((total, zone) => {
    const subZones = getSubZones(zone);
    if (zone.isParentZone && subZones.length > 0) {
      const subZoneMaxCapacity = subZones.reduce(
        (subTotal, subZone) => subTotal + getCapacity(subZone.maxCapacity),
        0
      );
      return total + subZoneMaxCapacity;
    } else {
      return total + getCapacity(zone.maxCapacity);
    }
  }, 0);

  const totalOccupiedCount = dashboardData.reduce((total, row) => {
    if (!row.isSubZone) {
      const subZones = getSubZones(row);
      total +=
        row.isParentZone && subZones.length > 0
          ? subZones.reduce((subTotal, subRow) => subTotal + getOccupiedCount(subRow), 0)
          : getOccupiedCount(row);
    }
    return total;
  }, 0);

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "1fr 1fr 1fr",
            xl: "1fr 1fr 1fr",
          },
          gap: 5,
          columnGap: 4,
          pt: 2,
        }}
      >
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
              <b>Total Locations : {totalMaxCapacity}</b>
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
              <b>Occupied Locations : {totalOccupiedCount}</b>
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <br />
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell sx={{ fontWeight: 'bold' }}>Zone Name</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Occupied</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Available</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dashboardData.map((row) => {
                if (row.isSubZone) return null
                else return <Row key={row.name} row={row} />
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={dashboardData.length}
          rowsPerPage={size}
          page={page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
