import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { EquipmentApiResponse, EquipmentData, EquipmentFilters } from "@/pages/power-equipment";
import EquipmentTable from "./EquipmentTable";
import EquipmentTableFilters from "./EquipmentTableFilters";
import AddEquipmentDialog from "./AddEquipmentDialog";

type Props = {
  equipmentApiData: EquipmentApiResponse;
  deleteEquipment: (id: string) => void;
  refetch: () => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  page: number;
  size: number;
  filters: EquipmentFilters;
  onFiltersChange: (filters: EquipmentFilters) => void;
};

const PowerEquipmentIndex = ({
  equipmentApiData, deleteEquipment, refetch, setPage, setSize, page, size, filters, onFiltersChange
}: Props) => {
  const [showFilters, setShowFilters] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<EquipmentData | null>(null);

  const handleEdit = (equipment: EquipmentData) => {
    setEditData(equipment);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditData(null);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700}>Power Equipment</Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={() => setShowFilters(!showFilters)}
            style={{ borderRadius: 15, fontSize: "13px" }}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button
            variant="contained"
            style={{ borderRadius: 15, backgroundColor: "#9B2735", fontSize: "13px" }}
            onClick={() => setDialogOpen(true)}
          >
            Add Power Equipment
          </Button>
        </Box>
      </Box>

      {showFilters && (
        <EquipmentTableFilters filters={filters} onFiltersChange={onFiltersChange} />
      )}

      <EquipmentTable
        equipmentApiData={equipmentApiData}
        deleteEquipment={deleteEquipment}
        onEdit={handleEdit}
        setPage={setPage}
        setSize={setSize}
        page={page}
        size={size}
      />

      <AddEquipmentDialog
        open={dialogOpen}
        editData={editData}
        handleClose={handleDialogClose}
        onSuccess={refetch}
      />
    </Box>
  );
};

export default PowerEquipmentIndex;
