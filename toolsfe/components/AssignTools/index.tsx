import React, { useState } from "react";
import axios from "axios";
import { QrReader } from "react-qr-reader";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";
import { ToolData } from "@/pages/tools";
import { PersonData } from "../Persons/AddPersonDialog";
import { ZoneData } from "@/pages/location";

const getEntityId = (item: any): string => {
  const candidate = item?.id ?? item?._id;
  if (typeof candidate === "string") return candidate;
  if (candidate?.$oid) return candidate.$oid;
  if (typeof candidate?.toHexString === "function") return candidate.toHexString();
  if (typeof candidate?.toString === "function") return candidate.toString();
  return "";
};

const AssignToolsForm: React.FC = () => {
  const [qrCode, setQrCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [tool, setTool] = useState<ToolData | null>(null);
  const [locations, setLocations] = useState<ZoneData[]>([]);
  const [persons, setPersons] = useState<PersonData[]>([]);
  const [locationId, setLocationId] = useState("");
  const [personId, setPersonId] = useState("");

  React.useEffect(() => {
    axios
      .get("/api/router?path=api/locations")
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        setLocations(
          rows.map((location: any) => ({
            id: getEntityId(location),
            name: location?.name || "",
            description: location?.description || "",
            type: location?.type || "",
            city: location?.city || "",
            state: location?.state || "",
            maxCapacity: String(location?.maxCapacity ?? "0"),
            occupiedLocations: Array.isArray(location?.occupiedLocations)
              ? location.occupiedLocations
              : [],
            isActive: location?.isActive ?? true,
            isFinalZone: location?.isFinalZone ?? false,
            locationPrefix: location?.locationPrefix || "",
            isParentZone: location?.isParentZone ?? false,
            isSubZone: location?.isSubZone ?? false,
            parentZoneId: location?.parentZoneId ?? null,
            createdAt: location?.createdAt || "",
            updatedAt: location?.updatedAt || "",
            subZones: null,
          }))
        );
      })
      .catch(() => toast.error("Error fetching locations."));

    axios
      .get("/api/router?path=api/persons")
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        setPersons(
          rows.map((person: any) => ({
            id: getEntityId(person),
            name: person?.name || "",
            designation: person?.designation || "",
            emailId: person?.emailId || person?.email || "",
            phoneNumber: person?.phoneNumber || "",
            immediateBoss: person?.immediateBoss || "",
          }))
        );
      })
      .catch(() => toast.error("Error fetching persons."));
  }, []);

  const handleScan = async (result: any) => {
    const scannedCode = result?.text;
    if (!scannedCode) return;
    setQrCode(scannedCode);
    setIsScanning(false);
    try {
      const response = await axios.get(`/api/router?path=api/truck/qrCode/${scannedCode}`);
      setTool(response.data);
      setLocationId(response.data?.assignedLocationId || "");
      setPersonId(response.data?.assignedPersonId || "");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error fetching tool");
    }
  };

  const handleAssign = async () => {
    if (!tool?.id) {
      toast.error("Scan a tool first.");
      return;
    }
    if (!locationId || !personId) {
      toast.error("Select both location and person.");
      return;
    }
    try {
      await axios.post("/api/router?path=api/tools/assign", {
        toolId: tool.id,
        locationId,
        personId,
      });
      toast.success("Tool assigned successfully.");
      setQrCode("");
      setTool(null);
      setLocationId("");
      setPersonId("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Assign failed.");
    }
  };

  return (
    <Box p={3} bgcolor="white" boxShadow={2}>
      <Typography variant="h5">Assign Tools</Typography>

      {isScanning ? (
        <div>
          <QrReader
            onResult={handleScan}
            constraints={{ facingMode: "environment" }}
            // @ts-ignore
            style={{ width: "40%", height: "40%" }}
          />
          <Button onClick={() => setIsScanning(false)}>Close Scanner</Button>
        </div>
      ) : (
        <TextField
          label="Scan QR Code"
          value={qrCode}
          margin="normal"
          fullWidth
          InputProps={{
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <Button onClick={() => setIsScanning(true)}>Scan</Button>
                </InputAdornment>
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setQrCode("");
                      setTool(null);
                      setLocationId("");
                      setPersonId("");
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              </>
            ),
          }}
        />
      )}

      {tool && (
        <Box mt={2}>
          <Typography variant="body1">Tool ID: {tool.toolId}</Typography>
          <Typography variant="body1">Tool Name: {tool.toolName}</Typography>
          <Typography variant="body1">Status: {tool.status}</Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel id="assign-location-label">Select Location</InputLabel>
            <Select
              labelId="assign-location-label"
              label="Select Location"
              value={locationId}
              onChange={(e) => setLocationId(e.target.value as string)}
            >
              {locations.map((location) => (
                <MenuItem key={location.id} value={location.id}>
                  {location.name} {location.type ? `(${location.type})` : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="assign-person-label">Select Person</InputLabel>
            <Select
              labelId="assign-person-label"
              label="Select Person"
              value={personId}
              onChange={(e) => setPersonId(e.target.value as string)}
            >
              {persons.map((person) => (
                <MenuItem key={person.id} value={person.id}>
                  {person.name} ({person.designation})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAssign}
            style={{ marginTop: "16px" }}
          >
            Assign Tool
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AssignToolsForm;
