import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton, Tooltip, Chip } from "@mui/material";
import { EditOutlined, DeleteOutline, Add } from "@mui/icons-material";
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
    { field: "name", headerName: "Name", width: 180, headerAlign: "center", align: "center", sortable: true },
    { field: "identifier", headerName: "Identifier", width: 130, headerAlign: "center", align: "center", sortable: true },
    { field: "locationType", headerName: "Location Type", width: 150, headerAlign: "center", align: "center", sortable: true },
    { field: "city", headerName: "City", width: 130, headerAlign: "center", align: "center", sortable: true },
    { field: "state", headerName: "State", width: 130, headerAlign: "center", align: "center", sortable: true },
    {
      field: "parentZoneId",
      headerName: "Type",
      width: 120,
      headerAlign: "center",
      align: "center",
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
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 160,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box>
          <Tooltip title="Add Sub-zone" followCursor>
            <IconButton size="small" color="primary" onClick={() => onAddSubZone(params.row.id)}>
              <Add fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit" followCursor>
            <IconButton size="small" onClick={() => onEdit(params.row)}>
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" followCursor>
            <IconButton size="small" color="error" onClick={() => deleteZone(params.row.id)}>
              <DeleteOutline fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <div style={{ height: 450, width: '100%', backgroundColor: 'white' }}>
      <DataGrid
        rows={zonesApiData?.data || []}
        columns={columns}
        paginationMode="server"
        rowCount={zonesApiData?.totalCount || 0}
        page={page - 1}
        pageSize={size}
        onPageChange={(newPage) => setPage(newPage + 1)}
        onPageSizeChange={(newSize) => setSize(newSize)}
        rowsPerPageOptions={[10, 25, 100]}
        disableSelectionOnClick
        sx={{
          border: "none",
          '& .MuiDataGrid-cell': {
            textAlign: 'center',
            justifyContent: 'center',
            display: 'flex',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: '700',
          },
          '& .MuiDataGrid-columnHeaderTitleContainer': {
            justifyContent: 'center',
          },
        }}
      />
    </div>
  );
};

export default ZoneTable;
