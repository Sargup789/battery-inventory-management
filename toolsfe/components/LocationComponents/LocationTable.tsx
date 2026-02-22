import { ZoneData } from "@/pages/location";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import * as React from "react";

interface Props {
  zoneData: ZoneData[];
  deleteZone: (id: string) => void;
  editZone: (data: ZoneData) => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  page: number;
  size: number;
}

const LocationTable: React.FC<Props> = ({
  zoneData,
  deleteZone,
  editZone,
  setPage,
  setSize,
  page,
  size,
}) => {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      minWidth: 160,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      minWidth: 140,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      minWidth: 140,
    },
    {
      field: "state",
      headerName: "State",
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      minWidth: 120,
    },
    {
      field: "toolsCount",
      headerName: "Tools Assigned",
      type: "number",
      flex: 1,  
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<ZoneData>) => (
        <>
          <Tooltip title="Edit" followCursor>
            <IconButton size="small" onClick={() => editZone(params.row)}>
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" followCursor>
            <IconButton size="small" onClick={() => deleteZone(params.row.id)}>
              <DeleteOutline fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 520, width: "100%", backgroundColor: "white" }}>
      <DataGrid
        rows={zoneData || []}
        columns={columns}
        page={page - 1}
        pageSize={size}
        rowsPerPageOptions={[10, 25, 100]}
        pagination
        onPageChange={(value) => setPage(value + 1)}
        onPageSizeChange={(value) => setSize(value)}
        disableSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': { textAlign: 'center', justifyContent: 'center', display: 'flex' },
          '& .MuiDataGrid-columnHeaderTitle': { fontWeight: '700' },
          '& .MuiDataGrid-columnHeaderTitleContainer': { justifyContent: 'center' },
        }}
      />
    </div>
  );
};

export default LocationTable;
