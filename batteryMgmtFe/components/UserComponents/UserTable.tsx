import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {
  users: any[];
  onEdit: (user: any) => void;
  onDelete: (id: string) => void;
};

const UserTable = ({ users, onEdit, onDelete }: Props) => {
  const columns: GridColDef[] = [
    { field: "username", headerName: "Username", width: 200 },
    {
      field: "role",
      headerName: "Role",
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "administrator" ? "error" : params.value === "editor" ? "warning" : "default"}
          size="small"
        />
      ),
    },
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
            <IconButton size="small" color="error" onClick={() => onDelete(params.row.id || params.row._id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = users.map((u: any) => ({
    ...u,
    id: u.id || u._id?.$oid || u._id?.toString?.() || String(Math.random()),
  }));

  return (
    <Box sx={{ height: 500, bgcolor: "white", borderRadius: 2, boxShadow: 1 }}>
      <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10, 25]} disableSelectionOnClick sx={{ border: "none" }} />
    </Box>
  );
};

export default UserTable;
