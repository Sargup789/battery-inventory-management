import { Button, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import AddLocationDialog from "./AddLocationDialog";
import LocationTable from "./LocationTable";
import { ZoneData } from "@/pages/location";
import axios from "axios";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import xlsx from "json-as-xlsx"

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

  // id: string;
  // name: string;
  // description: string;
  // maxCapacity: number;
  // occupiedCapacity: number;
  // isActive: boolean;
  // isFinalZone: boolean;
  // locationPrefix: string;
  // isParentZone: boolean;
  // isSubZone: boolean;
  // parentZoneId: string | null;
  // createdAt: string;
  // updatedAt: string;

  const flattenZoneData = (zoneData: ZoneData[]) => {
    const flattenedData: any[] = [];

    const flattenRecursively = (zone: ZoneData) => {
      flattenedData.push({
        id: zone.id,
        name: zone.name,
        locationPrefix: zone.locationPrefix,
        maxCapacity: zone.maxCapacity ?? 'N/A',
        occupiedCapacity: zone.occupiedLocations?.length ?? 0,
        isFinalZone: zone.isFinalZone,
        isParentZone: zone.isParentZone,
      });

      if (zone.subZones) {
        for (const subZone of zone.subZones) {
          flattenRecursively(subZone);
        }
      }
    };

    for (const zone of zoneData) {
      flattenRecursively(zone);
    }

    return flattenedData;
  };

  const downloadFile = () => {
    const flattenedData = flattenZoneData(zoneData);

    let data = [
      {
        sheet: "Data",
        columns: [
          { label: "ID", value: 'id' },
          { label: "Name", value: 'name' },
          { label: "Loc. Preference", value: 'locationPrefix' },
          { label: "Max Capacity", value: 'maxCapacity' },
          { label: "Loc. Occupied", value: 'occupiedCapacity' },
          { label: "Is Final Zone", value: 'isFinalZone' },
          { label: "Is Parent Zone", value: 'isParentZone' }
        ],
        content: flattenedData
      }
    ]
    let settings = {
      fileName: "ZoneData",
    }
    xlsx(data, settings)
  }

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
      description: data.description || "",
      maxCapacity: data.maxCapacity || "0",
      occupiedLocations: Array.isArray(data.occupiedLocations) ? data.occupiedLocations : [],
      isActive: typeof data.isActive === "boolean" ? data.isActive : true,
      isFinalZone: Boolean(data.isFinalZone),
      locationPrefix: data.locationPrefix || "",
      isParentZone: Boolean(data.isParentZone),
      isSubZone: Boolean(data.isSubZone),
      parentZoneId: data.parentZoneId ?? null,
      subZones: data.subZones ?? null,
    };

    if (Object.keys(locationDialogData).length > 0) {
      const { id } = data;
      try {
        const response = await axios.put(
          `/api/router?path=api/locations/${id}`,
          payload
        );
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await axios.post(`/api/router?path=api/locations`, payload);
        console.log(response.data);
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
