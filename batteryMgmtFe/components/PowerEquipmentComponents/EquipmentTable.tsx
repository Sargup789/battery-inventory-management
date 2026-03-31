import React, { useState } from "react";
import { DataGrid, GridColDef, GridCellParams, GridValueGetterParams } from "@mui/x-data-grid";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import { EditOutlined, DeleteOutline } from "@mui/icons-material";
import { EquipmentApiResponse, EquipmentData } from "@/pages/power-equipment";
import QRCode from "react-qr-code";
import PrintDialog from "../QRCodeComponents/PrintDialog";
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

const getStatusColor = (status: string): string => {
  switch (status) {
    case "created": return "#2196f3";
    case "checked-in": return "#4caf50";
    case "checked-out": return "#ff9800";
    case "in-transit": return "#ff9800";
    case "assigned": return "#ffc107";
    default: return "#9e9e9e";
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "created": return "Created";
    case "checked-in": return "Checked-in";
    case "checked-out": return "Checked-out";
    case "in-transit": return "In-transit";
    case "assigned": return "Assigned";
    default: return status || "N/A";
  }
};

const EquipmentTable = ({ equipmentApiData, deleteEquipment, onEdit, setPage, setSize, page, size }: Props) => {
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [printCode, setPrintCode] = useState("");

  const columns: GridColDef[] = [
    {
      field: "qrCodeId",
      headerName: "QR Code",
      width: 150,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridCellParams) => {
        const code = params.value as string;
        if (!code) return "N/A";
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
            <QRCode value={code} size={40} level="H"
              onClick={() => {
                setPrintCode(code);
                setPrintDialogOpen(true);
              }}
            />
          </div>
        );
      },
    },
    { field: "equipmentId", headerName: "Equipment ID", width: 130, headerAlign: "center", align: "center", sortable: true },
    { field: "itemType", headerName: "Item Type", width: 130, headerAlign: "center", align: "center", sortable: true },
    { field: "manufacturer", headerName: "Manufacturer", width: 130, headerAlign: "center", align: "center", sortable: true },
    { field: "modelNumber", headerName: "Model Number", width: 130, headerAlign: "center", align: "center", sortable: true },
    { field: "serialNumber", headerName: "Serial Number", width: 130, headerAlign: "center", align: "center", sortable: true },
    { field: "voltage", headerName: "Voltage", width: 100, headerAlign: "center", align: "center", sortable: true },
    { field: "ampHours", headerName: "Amp-hours", width: 110, headerAlign: "center", align: "center", sortable: true },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      headerAlign: "center",
      align: "center",
      sortable: true,
      renderCell: (params) => (
        <Chip
          label={getStatusLabel(params.value)}
          style={{ backgroundColor: getStatusColor(params.value), color: "white" }}
          size="small"
        />
      ),
    },
    { field: "powerEquipmentStatus", headerName: "Equipment Status", width: 160, headerAlign: "center", align: "center", sortable: true },
    { field: "zoneName", headerName: "Zone", width: 130, headerAlign: "center", align: "center", sortable: true },
    { field: "location", headerName: "Location", width: 130, headerAlign: "center", align: "center", sortable: true },
    { field: "assignedTo", headerName: "Assigned To", width: 130, headerAlign: "center", align: "center", sortable: true },
    {
      field: "dateOfArrival",
      headerName: "Date of Arrival",
      width: 140,
      headerAlign: "center",
      align: "center",
      sortable: true,
      valueGetter: (params: GridValueGetterParams) =>
        params.value ? moment(params.value).format("MMM DD, YYYY") : "—",
    },
    { field: "customerName", headerName: "Customer Name", width: 150, headerAlign: "center", align: "center", sortable: true },
    { field: "lastUpdatedBy", headerName: "Last Updated By", width: 150, headerAlign: "center", align: "center", sortable: true },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit" followCursor>
            <IconButton size="small" onClick={() => onEdit(params.row)}>
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" followCursor>
            <IconButton size="small" color="error" onClick={() => deleteEquipment(params.row.id)}>
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
        rows={equipmentApiData?.data || []}
        columns={columns}
        paginationMode="server"
        rowCount={equipmentApiData?.totalCount || 0}
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
      {printDialogOpen && (
        <PrintDialog open={printDialogOpen} handleClose={() => setPrintDialogOpen(false)} code={printCode} />
      )}
    </div>
  );
};

export default EquipmentTable;
