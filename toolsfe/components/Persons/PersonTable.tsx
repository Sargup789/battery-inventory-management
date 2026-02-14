import { PersonData } from "./AddPersonDialog";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import * as React from "react";

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
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "emailId",
      headerName: "Email ID",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
      minWidth: 160,
    },
    {
      field: "immediateBoss",
      headerName: "Immediate Boss",
      flex: 1,
      minWidth: 180,
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "toolsCount",
      headerName: "Tools Assigned",
      type: "number",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      minWidth: 130,
      renderCell: (params: GridRenderCellParams<PersonData>) => (
        <>
          <Tooltip title="Edit" followCursor>
            <IconButton size="small" onClick={() => editPerson(params.row)}>
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" followCursor>
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
        components={{ Toolbar: GridToolbar }}
      />
    </div>
  );
};

export default PersonTable;
