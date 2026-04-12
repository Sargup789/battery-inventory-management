import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, IconButton, Tooltip, Chip } from '@mui/material';
import { EditOutlined, DeleteOutline, Add } from '@mui/icons-material';
import { ZoneApiResponse } from '@/pages/zones';
import { ZoneData } from '@/pages/index';
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation('common');

  const columns: GridColDef[] = [
    { field: 'name', headerName: t('zone.name'), width: 180, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'identifier', headerName: t('zone.identifier'), width: 130, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'locationType', headerName: t('zone.locationType'), width: 150, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'city', headerName: t('zone.city'), width: 130, headerAlign: 'center', align: 'center', sortable: true },
    { field: 'state', headerName: t('zone.state'), width: 130, headerAlign: 'center', align: 'center', sortable: true },
    {
      field: 'parentZoneId',
      headerName: t('zone.type'),
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value ? t('zone.subZone') : t('zone.zone')}
          color={params.value ? 'secondary' : 'primary'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'equipmentCount',
      headerName: t('zone.equipmentCount'),
      width: 160,
      type: 'number',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 160,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box>
          <Tooltip title={t('zone.addSubZone')} followCursor>
            <IconButton size="small" color="primary" onClick={() => onAddSubZone(params.row.id)}>
              <Add fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.edit')} followCursor>
            <IconButton size="small" onClick={() => onEdit(params.row)}>
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.delete')} followCursor>
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
    </div>
  );
};

export default ZoneTable;
