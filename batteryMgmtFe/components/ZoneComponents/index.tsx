import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { ZoneApiResponse } from "@/pages/zones";
import { ZoneData } from "@/pages/index";
import ZoneTable from "./ZoneTable";
import AddZoneDialog from "./AddZoneDialog";

type Props = {
  zonesApiData: ZoneApiResponse;
  deleteZone: (id: string) => void;
  refetch: () => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  page: number;
  size: number;
};

const ZonesIndex = ({ zonesApiData, deleteZone, refetch, setPage, setSize, page, size }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<ZoneData | null>(null);
  const [parentZoneId, setParentZoneId] = useState<string | null>(null);

  const handleEdit = (zone: ZoneData) => {
    setEditData(zone);
    setDialogOpen(true);
  };

  const handleAddSubZone = (parentId: string) => {
    setParentZoneId(parentId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditData(null);
    setParentZoneId(null);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={700}>Zones</Typography>
        <Button
          variant="contained"
          style={{ borderRadius: 15, backgroundColor: "#9B2735", fontSize: "13px" }}
          onClick={() => setDialogOpen(true)}
        >
          Add Zone
        </Button>
      </Box>

      <ZoneTable
        zonesApiData={zonesApiData}
        deleteZone={deleteZone}
        onEdit={handleEdit}
        onAddSubZone={handleAddSubZone}
        setPage={setPage}
        setSize={setSize}
        page={page}
        size={size}
      />

      <AddZoneDialog
        open={dialogOpen}
        editData={editData}
        parentZoneId={parentZoneId}
        allZones={zonesApiData.data}
        handleClose={handleDialogClose}
        onSuccess={refetch}
      />
    </Box>
  );
};

export default ZonesIndex;
