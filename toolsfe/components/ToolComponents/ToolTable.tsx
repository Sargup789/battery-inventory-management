import { ToolApiResponse, ToolData } from '@/pages/tools';
import { DeleteOutline, EditOutlined, RemoveRedEyeOutlined } from '@mui/icons-material';
import { IconButton, Tooltip, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridCellParams, GridToolbar } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useState } from 'react';
import QRCode from 'react-qr-code';
import PrintDialog from '../QRCodeComponents/PrintDialog';
import moment from "moment";
import SellIcon from '@mui/icons-material/Sell';
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
    markToolAsSold: (id: string) => Promise<void>;
}

const Tool = ({
    roles, toolApidata, deleteTool, markToolAsSold, editTool, setPage, setSize, page, size, viewTool, onRowSelect = () => { }
}: Props & DecodedToken) => {
    const [printDialogOpen, setPrintDialogOpen] = useState(false);
    const [printCode, setPrintCode] = useState('');

    const router = useRouter();
    const isTaskPage = router.pathname.includes('task');

    const handlePrint = (code: string) => {
        setPrintCode(code);
        setPrintDialogOpen(true);
    };

    const renderActionButton = (params: GridCellParams) => (
        <>
            <Tooltip title="View" followCursor>
                <IconButton
                    size="small"
                    onClick={() => viewTool(params.row as ToolData)}
                    children={<RemoveRedEyeOutlined fontSize="small" />}
                />
            </Tooltip>
            {roles !== 'viewer' && <Tooltip title="Edit" followCursor>
                <IconButton
                    size="small"
                    onClick={() => editTool(params.row as ToolData)}
                    children={<EditOutlined fontSize="small" />}
                />
            </Tooltip>}
            {roles === 'administrator' && <Tooltip title="Delete" followCursor>
                <IconButton
                    size="small"
                    onClick={() => deleteTool(params.row.id as string)}
                    children={<DeleteOutline fontSize="small" />}
                />
            </Tooltip>}
            {roles !== 'viewer' && (
                <Tooltip title="Mark as Sold" followCursor>
                    <IconButton
                        size="small"
                        onClick={() => markToolAsSold(params.row.id as string)}
                        disabled={params.row.status === 'Sold'}
                        children={<SellIcon fontSize='small' />}
                    />
                </Tooltip>
            )}
        </>
    );

    const columns: GridColDef[] = [
        {
            field: 'qrCodeId',
            headerName: 'QR Code ID',
            width: 150,
            sortable: true,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'toolId',
            headerName: 'Tool ID',
            width: 120,
            align: 'center',
            sortable: true,
            headerAlign: 'center',
        },
        {
            field: 'partNumber',
            headerName: 'Part Number',
            width: 150,
            align: 'center',
            sortable: true,
            headerAlign: 'center',
        },
        {
            field: 'toolName',
            headerName: 'Tool Name',
            width: 180,
            align: 'center',
            sortable: true,
            headerAlign: 'center',
        },
        {
            field: 'toolDescription',
            headerName: 'Tool Description',
            width: 250,
            align: 'left',
            sortable: true,
            headerAlign: 'center',
        },
        {
            field: 'supplier',
            headerName: 'Supplier',
            width: 150,
            align: 'center',
            sortable: true,
            headerAlign: 'center',
        },
        {
            field: 'status',
            headerName: 'Status',
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
                return <Chip label={params.value as string} style={{ backgroundColor: color, color: 'white' }} />;
            },
        },
        {
            field: 'assignedPerson',
            headerName: 'Assigned Person',
            width: 180,
            align: 'center',
            sortable: true,
            headerAlign: 'center',
            valueFormatter: (params) => params.value || 'N/A',
        },
        {
            field: 'assignedPersonDesignation',
            headerName: 'Person Designation',
            width: 180,
            align: 'center',
            headerAlign: 'center',
            valueFormatter: (params) => params.value || 'N/A',
        },
        {
            field: 'assignedPersonEmail',
            headerName: 'Person Email',
            width: 220,
            align: 'center',
            headerAlign: 'center',
            valueFormatter: (params) => params.value || 'N/A',
        },
        {
            field: 'assignedPersonPhoneNumber',
            headerName: 'Person Phone',
            width: 180,
            align: 'center',
            headerAlign: 'center',
            valueFormatter: (params) => params.value || 'N/A',
        },
        {
            field: 'assignedLocation',
            headerName: 'Assigned Location',
            width: 180,
            align: 'center',
            sortable: true,
            headerAlign: 'center',
            valueFormatter: (params) => params.value || 'N/A',
        },
        {
            field: 'assignedLocationType',
            headerName: 'Location Type',
            width: 160,
            align: 'center',
            headerAlign: 'center',
            valueFormatter: (params) => params.value || 'N/A',
        },
        {
            field: 'assignedLocationCity',
            headerName: 'Location City',
            width: 160,
            align: 'center',
            headerAlign: 'center',
            valueFormatter: (params) => params.value || 'N/A',
        },
        {
            field: 'assignedLocationState',
            headerName: 'Location State',
            width: 160,
            align: 'center',
            headerAlign: 'center',
            valueFormatter: (params) => params.value || 'N/A',
        },
        {
            field: 'lastUpdatedBy',
            headerName: 'Last Updated By',
            width: 150,

            align: 'center',
            sortable: true
        }
    ];

    if (!isTaskPage) {
        columns.push(
            {
                field: 'qrCodeId',
                headerName: 'QR Code',
                width: 150,
                align: 'center',
                sortable: false,
                renderCell: (params) => <QRCode
                    id={`qr-${params.value}`}
                    value={params.value as string}
                    size={32}
                    onClick={() => handlePrint(params.value as string)}
                    level={"H"}
                />
            },
            {
                field: 'actions',
                headerName: 'Actions',
                width: 150,
                sortable: false,
                renderCell: renderActionButton,
                headerAlign: 'center',
            }
        )
    }

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
                checkboxSelection={isTaskPage}
                onSelectionModelChange={(ids: any) => {
                    if (onRowSelect)
                        onRowSelect(ids[0])
                }}
                components={{ Toolbar: GridToolbar }}
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
