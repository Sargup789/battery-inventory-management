import React, { useState } from "react";
import axios from "axios";
import { QrReader } from "react-qr-reader";
import {
  TextField, Button, Box, Typography, IconButton, InputAdornment,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { toast } from "react-toastify";
import ClearIcon from "@mui/icons-material/Clear";
import { useQuery } from "react-query";
import { ZoneData } from "@/pages/index";

const CheckinEquipment: React.FC = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [equipmentDetails, setEquipmentDetails] = useState<any | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [location, setLocation] = useState("");

  const { data: zones = [] } = useQuery("allZones", async () => {
    const res = await axios.get(`/api/router?path=api/zones`, { params: { size: 200 } });
    const raw = res.data;
    const rows = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
    return rows.map((z: any) => ({
      id: z?.id || z?._id?.$oid || z?._id?.toString?.() || "",
      name: z?.name || "",
    })) as ZoneData[];
  }, { refetchOnWindowFocus: false });

  const handleScan = async (result: any) => {
    const scannedCode = result?.text;
    if (!scannedCode) return;
    setQrCode(scannedCode);
    setIsScanning(false);
    try {
      const response = await axios.get(`/api/router?path=api/power-equipment/qr-code/${scannedCode}`);
      setEquipmentDetails(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Equipment not found.");
    }
  };

  const handleManualLookup = async () => {
    if (!qrCode) return;
    try {
      const response = await axios.get(`/api/router?path=api/power-equipment/qr-code/${qrCode}`);
      setEquipmentDetails(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Equipment not found.");
    }
  };

  const handleCheckin = async () => {
    if (!equipmentDetails?.equipmentId) {
      toast.error("No equipment selected.");
      return;
    }
    if (!selectedZoneId) {
      toast.error("Please select a zone.");
      return;
    }
    try {
      await axios.post(`/api/router?path=api/power-equipment/check-in`, {
        equipmentId: equipmentDetails.equipmentId,
        zoneId: selectedZoneId,
        location: location || undefined,
      });
      toast.success("Equipment checked in successfully.");
      setEquipmentDetails(null);
      setQrCode(null);
      setSelectedZoneId("");
      setLocation("");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Check-in failed.");
    }
  };

  const handleClear = () => {
    setQrCode(null);
    setEquipmentDetails(null);
    setSelectedZoneId("");
    setLocation("");
  };

  return (
    <Box p={3} bgcolor="white" boxShadow={2} borderRadius={2}>
      <Typography variant="h5" fontWeight={700} mb={2}/>

      {isScanning ? (
        <Box>
          <div style={{ width: "40%" }}>
            <QrReader onResult={handleScan} constraints={{ facingMode: "environment" }} />
          </div>
          <Button onClick={() => setIsScanning(false)}>Close Scanner</Button>
        </Box>
      ) : (
        <TextField
          label="Scan QR Code"
          value={qrCode || ""}
          margin="normal"
          fullWidth
          onChange={(e) => setQrCode(e.target.value)}
          InputProps={{
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <Button onClick={() => setIsScanning(true)}>Scan</Button>
                </InputAdornment>
                <InputAdornment position="end">
                  <Button onClick={handleManualLookup}>Lookup</Button>
                </InputAdornment>
                <InputAdornment position="end">
                  <IconButton onClick={handleClear}><ClearIcon /></IconButton>
                </InputAdornment>
              </>
            ),
          }}
        />
      )}

      {equipmentDetails && (
        <Box mt={2}>
          <Typography variant="h6" fontWeight={700} mb={1}>Equipment Details:</Typography>
          <Typography variant="body1">Equipment ID: {equipmentDetails.equipmentId}</Typography>
          <Typography variant="body1">Item Type: {equipmentDetails.itemType || "—"}</Typography>
          <Typography variant="body1">Status: {equipmentDetails.status || "—"}</Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Zone *</InputLabel>
            <Select
              value={selectedZoneId}
              label="Select Zone *"
              onChange={(e) => setSelectedZoneId(e.target.value)}
            >
              <MenuItem value=""><em>Select zone</em></MenuItem>
              {zones.map((zone: any) => (
                <MenuItem key={zone.id} value={zone.id}>{zone.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Location (Optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            margin="normal"
            placeholder="e.g. Row A, Shelf 3"
          />

          <Button
            variant="contained"
            style={{ marginTop: "15px", backgroundColor: "#9B2735" }}
            onClick={handleCheckin}
          >
            Check-in Power Equipment
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CheckinEquipment;
