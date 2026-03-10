import { ZoneData } from "@/pages/location";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import * as React from "react";
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation('common');
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: t('common.name'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      minWidth: 160,
    },
    {
      field: "type",
      headerName: t('common.type'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      minWidth: 140,
    },
    {
      field: "city",
      headerName: t('common.city'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      minWidth: 140,
    },
    {
      field: "state",
      headerName: t('common.state'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      minWidth: 120,
    },
    {
      field: "toolsCount",
      headerName: t('location.toolsAssigned'),
      type: "number",
      flex: 1,  
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
    },
    {
      field: "actions",
      headerName: t('common.actions'),
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<ZoneData>) => (
        <>
          <Tooltip title={t('common.edit')} followCursor>
            <IconButton size="small" onClick={() => editZone(params.row)}>
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.delete')} followCursor>
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
