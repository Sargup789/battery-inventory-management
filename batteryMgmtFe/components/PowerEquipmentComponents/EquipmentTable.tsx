import React, { useState } from 'react';
import { DataGrid, GridColDef, GridCellParams, GridValueGetterParams } from '@mui/x-data-grid';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import { EditOutlined, DeleteOutline } from '@mui/icons-material';
import { EquipmentApiResponse, EquipmentData } from '@/pages/power-equipment';
import QRCode from 'react-qr-code';
import PrintDialog from '../QRCodeComponents/PrintDialog';
import moment from 'moment';
import { useTranslation } from 'next-i18next';

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
    case 'created': return '#2196f3';
    case 'checked-in': return '#4caf50';
    case 'checked-out': return '#ff9800';
    case 'in-transit': return '#ff9800';
    case 'assigned': return '#ffc107';
    default: return '#9e9e9e';
  }
};

const EquipmentTable = ({ equipmentApiData, deleteEquipment, onEdit, setPage, setSize, page, size }: Props) => {
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [printCode, setPrintCode] = useState('');
  const { t } = useTranslation('common');

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'created': return t('equipment.created');
      case 'checked-in': return t('equipment.checkedIn');
      case 'checked-out': return t('equipment.checkedOut');
      case 'in-transit': return t('equipment.inTransit');
      case 'assigned': return t('equipment.assigned');
      default: return status || t('common.na');
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'qrCodeId',
      headerName: t('equipment.qrCode'),
      width: 150,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridCellParams) => {
        const code = params.value as string;
        if (!code) return t('common.na');
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
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
    { field: 'equipmentId', headerName: t('equipment.equipmentId'), width: 130, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'itemType', headerName: t('equipment.itemType'), width: 130, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'manufacturer', headerName: t('equipment.manufacturer'), width: 130, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'modelNumber', headerName: t('equipment.modelNumber'), width: 130, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'serialNumber', headerName: t('equipment.serialNumber'), width: 130, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'voltage', headerName: t('equipment.voltage'), width: 100, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'ampHours', headerName: t('equipment.ampHours'), width: 110, headerAlign: 'center', align: 'center', sortable: true },
    {
      field: 'status',
      headerName: t('equipment.status'),
      width: 150,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      renderCell: (params) => (
        <Chip
          label={getStatusLabel(params.value)}
          style={{ backgroundColor: getStatusColor(params.value), color: 'white' }}
          size="small"
        />
      ),
    },
    { field: 'powerEquipmentStatus', headerName: t('equipment.equipmentStatus'), width: 160, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'zoneName', headerName: t('equipment.zone'), width: 130, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'location', headerName: t('equipment.location'), width: 130, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'assignedTo', headerName: t('equipment.assignedTo'), width: 130, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'assignationType', headerName: t('equipment.assignationType'), width: 150, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'truckModelNumber', headerName: t('equipment.truckModelNumber'), width: 140, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'truckSerialNumber', headerName: t('equipment.truckSerialNumber'), width: 140, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'checkoutReason', headerName: t('equipment.checkoutReason'), width: 150, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'inboundDocumentType', headerName: t('equipment.inboundDocType'), width: 160, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'inboundDocumentNumber', headerName: t('equipment.inboundDocNumber'), width: 150, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'orderEntryNumber', headerName: t('equipment.orderEntryNumber'), width: 140, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'outboundDocumentType', headerName: t('equipment.outboundDocType'), width: 170, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'outboundDocumentNumber', headerName: t('equipment.outboundDocNumber'), width: 150, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'zoneLocationType', headerName: t('equipment.zoneLocationType'), width: 160, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'zoneCity', headerName: t('equipment.zoneCity'), width: 120, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'zoneState', headerName: t('equipment.zoneState'), width: 120, headerAlign: 'center', align: 'center', sortable: true },
    {
      field: 'dateOfArrival',
      headerName: t('equipment.dateOfArrival'),
      width: 140,
      headerAlign: 'center',
      align: 'center',
      sortable: true,
      valueGetter: (params: GridValueGetterParams) =>
        params.value ? moment(params.value).format('MMM DD, YYYY') : '—',
    },
    { field: 'customerName', headerName: t('equipment.customerName'), width: 150, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'lastUpdatedBy', headerName: t('equipment.lastUpdatedBy'), width: 150, headerAlign: 'center', align: 'center', sortable: true },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 120,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box>
          <Tooltip title={t('common.edit')} followCursor>
            <IconButton size="small" onClick={() => onEdit(params.row)}>
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.delete')} followCursor>
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
          border: 'none',
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
