import { PersonData } from "./AddPersonDialog";
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
  personData: PersonData[];
  deletePerson: (id: string) => void;
  editPerson: (data: PersonData) => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  page: number;
  size: number;
}

const PersonTable: React.FC<Props> = ({
  personData,
  deletePerson,
  editPerson,
  setPage,
  setSize,
  page,
  size,
}) => {
  const { t } = useTranslation('common');
  const columns: GridColDef[] = [
    {
      field: "employeeId",
      headerName: t('person.employeeId'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      minWidth: 140,
    },
    {
      field: "name",
      headerName: t('common.name'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      minWidth: 160,
    },
    {
      field: "designation",
      headerName: t('person.designation'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      minWidth: 150,
    },
    {
      field: "emailId",
      headerName: t('person.emailId'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      minWidth: 220,
    },
    {
      field: "phoneNumber",
      headerName: t('person.phoneNumber'),
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      minWidth: 160,
    },
    {
      field: "immediateBoss",
      headerName: t('person.immediateBoss'),
      flex: 1,  
      align: 'center',
      headerAlign: 'center',
      minWidth: 180,
      valueFormatter: (params) => params.value || t('common.na'),
    },
    {
      field: "toolsCount",
      headerName: t('person.toolsAssigned'),
      type: "number",
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      minWidth: 140,
    },
    {
      field: "actions",
      headerName: t('common.actions'),
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<PersonData>) => (
        <>
          <Tooltip title={t('common.edit')} followCursor>
            <IconButton size="small" onClick={() => editPerson(params.row)}>
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.delete')} followCursor>
            <IconButton
              size="small"
              onClick={() => deletePerson((params.row.id as string) || "")}
            >
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
        rows={personData || []}
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

export default PersonTable;
