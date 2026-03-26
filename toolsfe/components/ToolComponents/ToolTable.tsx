import { ToolApiResponse, ToolData } from '@/pages/tools';
import { DeleteOutline, EditOutlined, RemoveRedEyeOutlined } from '@mui/icons-material';
import { IconButton, Tooltip, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridCellParams } from '@mui/x-data-grid';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import PrintDialog from '../QRCodeComponents/PrintDialog';
import QRCode from 'react-qr-code';
import { green, amber } from '@mui/material/colors';
import withLogin, { DecodedToken } from '@/components/general/withLogin';
interface Props {
  toolApidata: ToolApiResponse;
  deleteTool: (id: string) => void;
  editTool: (data: ToolData) => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  page: number;
  viewTool: (data: ToolData) => void;
  size: number;
  onRowSelect?: (id: string) => void;
}

const Tool = ({
  roles, toolApidata, deleteTool, editTool, setPage, setSize, page, size, viewTool, onRowSelect = () => { }
}: Props & DecodedToken) => {
  const { t } = useTranslation('common');
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [printCode, setPrintCode] = useState('');


  const renderActionButton = (params: GridCellParams) => (
    <>
      <Tooltip title={t('common.view')} followCursor>
        <IconButton
          size="small"
          onClick={() => viewTool(params.row as ToolData)}
          children={<RemoveRedEyeOutlined fontSize="small" />}
        />
      </Tooltip>
       <Tooltip title={t('common.edit')} followCursor>
        <IconButton
          size="small"
          onClick={() => editTool(params.row as ToolData)}
          children={<EditOutlined fontSize="small" />}
        />
      </Tooltip>
     <Tooltip title={t('common.delete')} followCursor>
        <IconButton
          size="small"
          onClick={() => deleteTool(params.row.id as string)}
          children={<DeleteOutline fontSize="small" />}
        />
      </Tooltip>
    </>
  );

  const columns: GridColDef[] = [
    {
      field: 'qrCodeId',
      headerName: t('tool.qrCode'),
      width: 150,
      sortable: false,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: GridCellParams) => {
        const code = params.value as string;
        if (!code) return t('common.na');
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
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
    {
      field: 'toolId',
      headerName: t('tool.toolId'),
      width: 120,
      align: 'center',
      sortable: true,
      headerAlign: 'center',
    },
    {
      field: 'partNumber',
      headerName: t('tool.partNumber'),
      width: 150,
      align: 'center',
      sortable: true,
      headerAlign: 'center',
    },
    {
      field: 'toolName',
      headerName: t('tool.toolName'),
      width: 180,
      align: 'center',
      sortable: true,
      headerAlign: 'center',
    },
    {
      field: 'toolDescription',
      headerName: t('tool.toolDescription'),
      width: 250,
      align: 'left',
      sortable: true,
      headerAlign: 'center',
    },
    {
      field: 'supplier',
      headerName: t('tool.supplier'),
      width: 150,
      align: 'center',
      sortable: true,
      headerAlign: 'center',
    },
    {
      field: 'status',
      headerName: t('common.status'),
      width: 150,
      align: 'center',
      sortable: true,
      headerAlign: 'center',
      renderCell: (params: GridCellParams) => {
        let color;
        switch (params.value) {
          case 'Created':
            color = '#2196f3';
            break;
          case 'Assigned':
            color = amber[500];
            break;
          case 'Checked-in':
            color = green[500];
            break;
          case 'In-transit':
            color = '#ff9800';
            break;
          default:
            color = '#9e9e9e';
        }
        const statusLabels: Record<string, string> = {
          'Created': t('tool.statusCreated'),
          'Assigned': t('tool.statusAssigned'),
          'Checked-in': t('tool.statusCheckedIn'),
          'In-transit': t('tool.statusInTransit'),
        };
        const label = statusLabels[params.value as string] || (params.value as string);
        return <Chip label={label} style={{ backgroundColor: color, color: 'white' }} />;
      },
    },
    {
      field: 'assignedPerson',
      headerName: t('tool.assignedPerson'),
      width: 180,
      align: 'center',
      sortable: true,
      headerAlign: 'center',
      valueFormatter: (params) => params.value || t('common.na'),
    },
    {
      field: 'assignedPersonDesignation',
      headerName: t('tool.personDesignation'),
      width: 180,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (params) => params.value || t('common.na'),
    },
    {
      field: 'assignedPersonEmail',
      headerName: t('tool.personEmail'),
      width: 220,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (params) => params.value || t('common.na'),
    },
    {
      field: 'assignedPersonPhoneNumber',
      headerName: t('tool.personPhone'),
      width: 180,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (params) => params.value || t('common.na'),
    },
    {
      field: 'assignedLocation',
      headerName: t('tool.assignedLocation'),
      width: 180,
      align: 'center',
      sortable: true,
      headerAlign: 'center',
      valueFormatter: (params) => params.value || t('common.na'),
    },
    {
      field: 'assignedLocationType',
      headerName: t('tool.locationType'),
      width: 160,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (params) => params.value || t('common.na'),
    },
    {
      field: 'assignedLocationCity',
      headerName: t('tool.locationCity'),
      width: 160,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (params) => params.value || t('common.na'),
    },
    {
      field: 'assignedLocationState',
      headerName: t('tool.locationState'),
      width: 160,
      align: 'center',
      headerAlign: 'center',
      valueFormatter: (params) => params.value || t('common.na'),
    },
    {
      field: 'lastUpdatedBy',
      headerName: t('tool.lastUpdatedBy'),
      width: 150,
      align: 'center',
      sortable: true,
      headerAlign: 'center',
      valueFormatter: (params) => params.value || t('common.na'),
    },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 150,
      sortable: false,
      renderCell: renderActionButton,
      headerAlign: 'center',
    }
  ];

  return (
    <div style={{ height: 450, width: '100%', backgroundColor: 'white' }}>
      <DataGrid
        rows={toolApidata?.data ?? []}
        columns={columns}
        rowCount={toolApidata?.totalCount ?? 0}
        pageSize={size}
        rowsPerPageOptions={[10, 25, 100]}
        paginationMode="server"
        page={page - 1}
        onPageChange={(val) => setPage(val + 1)}
        onPageSizeChange={(val) => setSize(val)}
        onSelectionModelChange={(ids: any) => {
          if (onRowSelect)
            onRowSelect(ids[0])
        }}
        sx={{
          '& .MuiDataGrid-cell': {
            textAlign: 'center',
            justifyContent: 'center',
            display: 'flex'
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: '700'
          },
          '& .MuiDataGrid-columnHeaderTitleContainer': {
            justifyContent: 'center'
          }
        }}
      />
      {printDialogOpen && (
        <PrintDialog open={printDialogOpen} handleClose={() => setPrintDialogOpen(false)} code={printCode} />
      )}
    </div>
  );
}

export default withLogin(Tool);
