import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import AddLocationDialog from "./AddLocationDialog";
import LocationTable from "./LocationTable";
import { LocationApiResponse, LocationFilters, ZoneData } from "@/pages/location";
import LocationTableFilters from "./LocationTableFilters";
import axios from "axios";
import { toast } from "react-toastify";

type Props = {
  locationApiData: LocationApiResponse;
  deleteZone: (id: string) => void;
  refetch: () => void;
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  page: number;
  size: number;
  filters: LocationFilters;
  onFiltersChange: (filters: LocationFilters) => void;
};

const queryClient = new QueryClient();

const LocationIndex = ({ locationApiData, deleteZone, refetch, setPage, setSize, page, size, filters, onFiltersChange }: Props) => {
  const [addLocationDialogOpen, setAddLocationDialogOpen] = useState(false);
  const [locationDialogData, setLocationDialogData] = useState<ZoneData | {}>({});
  const [showFilters, setShowFilters] = useState(false);

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
      } catch (error: any) {
        if (error?.response?.status === 409) {
          toast.error("This location is already created");
          return;
        }
        console.error(error);
      }
    }
    handleClose();
    refetch();
  };

  const hasActiveFilters = Object.values(filters).some((v) => !!v);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="m-6">
        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <Button
            style={{
              borderRadius: 15,
              backgroundColor: "#9B2735",
              fontSize: "13px"
            }}
            variant="contained"
            onClick={() => setShowFilters(prev => !prev)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Typography align='left' style={{ display: 'flex', alignItems: 'center' }}>
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
          </Typography>
        </Box>
        {(showFilters || hasActiveFilters) && (
          <Box sx={{ background: 'white', width: '100%', marginBottom: '16px' }}>
            <LocationTableFilters filtersState={filters} setFilterState={onFiltersChange} />
          </Box>
        )}
        <LocationTable
          zoneData={locationApiData.data}
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
          parentZones={locationApiData.data}
          onSubmit={onSubmit}
        />
      </div>
    </QueryClientProvider>
  );
};

export default LocationIndex;
