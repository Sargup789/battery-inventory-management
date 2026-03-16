import React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { EquipmentApiResponse, EquipmentData } from "@/pages/power-equipment";
import moment from "moment";

type Props = {
  equipmentApiData: EquipmentApiResponse;
  deleteEquipment: (id: string) => void;
  onEdit: (equipment: EquipmentData) => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  page: number;
  size: number;
};

const getStatusColor = (status: string) => {
  if (status === "created") return "default";
  if (status === "checked-in") return "success";
  return "warning"; // checkout reason
};

const EquipmentTable = ({ equipmentApiData, deleteEquipment, onEdit, setPage, setSize, page, size }: Props) => {
  const columns: GridColDef[] = [
    { field: "equipmentId", headerName: "Equipment ID", width: 130 },
    { field: "itemType", headerName: "Item Type", width: 130 },
    { field: "manufacturer", headerName: "Manufacturer", width: 130 },
    { field: "modelNumber", headerName: "Model Number", width: 130 },
    { field: "serialNumber", headerName: "Serial Number", width: 130 },
    { field: "voltage", headerName: "Voltage", width: 100 },
    { field: "ampHours", headerName: "Amp-hours", width: 110 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <Chip label={params.value} color={getStatusColor(params.value) as any} size="small" />
      ),
    },
    { field: "zoneName", headerName: "Zone", width: 130 },
    { field: "location", headerName: "Location", width: 130 },
    { field: "assignedTo", headerName: "Assigned To", width: 130 },
    {
      field: "dateOfArrival",
      headerName: "Date of Arrival",
      width: 140,
      valueGetter: (params: GridValueGetterParams) =>
        params.value ? moment(params.value).format("MMM DD, YYYY") : "—",
    },
    { field: "customerName", headerName: "Customer Name", width: 150 },
    { field: "lastUpdatedBy", headerName: "Last Updated By", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEdit(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => deleteEquipment(params.row.id)}>
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
        rows={equipmentApiData.data}
        columns={columns}
        paginationMode="server"
        rowCount={equipmentApiData.totalCount}
        page={page - 1}
        pageSize={size}
        onPageChange={(newPage) => setPage(newPage + 1)}
        onPageSizeChange={(newSize) => setSize(newSize)}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
        sx={{ border: "none" }}
      />
    </Box>
  );
};

export default EquipmentTable;
