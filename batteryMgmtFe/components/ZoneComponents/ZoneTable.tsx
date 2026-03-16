import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton, Tooltip, Chip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { ZoneApiResponse } from "@/pages/zones";
import { ZoneData } from "@/pages/index";

type Props = {
  zonesApiData: ZoneApiResponse;
  deleteZone: (id: string) => void;
  onEdit: (zone: ZoneData) => void;
  onAddSubZone: (parentId: string) => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  page: number;
  size: number;
};

const ZoneTable = ({ zonesApiData, deleteZone, onEdit, onAddSubZone, setPage, setSize, page, size }: Props) => {
  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 180 },
    { field: "identifier", headerName: "Identifier", width: 130 },
    { field: "locationType", headerName: "Location Type", width: 150 },
    { field: "city", headerName: "City", width: 130 },
    { field: "state", headerName: "State", width: 130 },
    {
      field: "parentZoneId",
      headerName: "Type",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Sub-zone" : "Zone"}
          color={params.value ? "secondary" : "primary"}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "equipmentCount",
      headerName: "Equipment Count",
      width: 160,
      type: "number",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Add Sub-zone">
            <IconButton size="small" color="primary" onClick={() => onAddSubZone(params.row.id)}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEdit(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => deleteZone(params.row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, bgcolor: "white", borderRadius: 2, boxShadow: 1 }}>
      <DataGrid
        rows={zonesApiData.data}
        columns={columns}
        paginationMode="server"
        rowCount={zonesApiData.totalCount}
        page={page - 1}
        pageSize={size}
        onPageChange={(newPage) => setPage(newPage + 1)}
        onPageSizeChange={(newSize) => setSize(newSize)}
        rowsPerPageOptions={[25, 50, 100]}
        disableSelectionOnClick
        sx={{ border: "none" }}
      />
    </Box>
  );
};

export default ZoneTable;
