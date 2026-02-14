import { Button } from "@mui/material";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import AddLocationDialog from "./AddLocationDialog";
import LocationTable from "./LocationTable";
import { ZoneData } from "@/pages/location";
import axios from "axios";

type Props = {
  zoneData: ZoneData[];
  deleteZone: (id: string) => void;
  refetch: () => void;
  setPage: (page: number) => void
  setSize: (size: number) => void
  page: number
  size: number
};

const queryClient = new QueryClient();

const LocationIndex = ({ zoneData, deleteZone, refetch, setPage, setSize, page, size }: Props) => {
  const [addLocationDialogOpen, setAddLocationDialogOpen] = useState(false);
  const [locationDialogData, setLocationDialogData] = useState<ZoneData | {}>({});

  const editZone = (zone: ZoneData) => {
    setLocationDialogData(zone);
    setAddLocationDialogOpen(true);
  };

  const handleClose = () => {
    setAddLocationDialogOpen(false);
    setLocationDialogData({});
  };

  const onSubmit = async (data: ZoneData) => {
    const payload = {
      name: data.name,
      type: data.type || "",
      city: data.city || "",
      state: data.state || "",
    };

    if (Object.keys(locationDialogData).length > 0) {
      const { id } = data;
      try {
        await axios.put(
          `/api/router?path=api/locations/${id}`,
          payload
        );
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await axios.post(`/api/router?path=api/locations`, payload);
      } catch (error) {
        console.error(error);
      }
    }
    handleClose();
    refetch();
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="m-6">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <Button
            style={{
              borderRadius: 15,
              backgroundColor: "#9B2735",
              fontSize: "13px"
            }}
            variant="contained"
            onClick={() => setAddLocationDialogOpen(true)}
          >
            Add Location
          </Button>
        </div>
        <LocationTable
          zoneData={zoneData}
          deleteZone={deleteZone}
          editZone={editZone}
          setPage={setPage}
          setSize={setSize}
          page={page}
          size={size}
        />
        <AddLocationDialog
          open={addLocationDialogOpen}
          locationDialogData={locationDialogData}
          handleClose={handleClose}
          parentZones={zoneData}
          onSubmit={onSubmit}
        />
      </div>
    </QueryClientProvider>
  );
};

export default LocationIndex;
