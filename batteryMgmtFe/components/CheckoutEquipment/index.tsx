import React, { useState } from "react";
import axios from "axios";
import { QrReader } from "react-qr-reader";
import {
  TextField, Button, Box, Typography, IconButton, InputAdornment,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { toast } from "react-toastify";
import ClearIcon from "@mui/icons-material/Clear";
import moment from "moment";
import { useQuery } from "react-query";

const CheckoutEquipment: React.FC = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [equipmentDetails, setEquipmentDetails] = useState<any | null>(null);
  const [checkoutReason, setCheckoutReason] = useState("");

  const { data: checkoutReasons = [] } = useQuery("checkoutReasons", async () => {
    const res = await axios.get(`/api/router?path=api/dropdownmaster/checkoutReason`);
    return res.data?.options || [];
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

  const handleCheckout = async () => {
    if (!equipmentDetails?.equipmentId) {
      toast.error("No equipment selected.");
      return;
    }
    if (!checkoutReason) {
      toast.error("Please select a check-out reason.");
      return;
    }
    try {
      await axios.post(`/api/router?path=api/power-equipment/check-out`, {
        equipmentId: equipmentDetails.equipmentId,
        checkoutReason,
      });
      toast.success("Equipment checked out successfully.");
      setEquipmentDetails(null);
      setQrCode(null);
      setCheckoutReason("");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Check-out failed.");
    }
  };

  const handleClear = () => {
    setQrCode(null);
    setEquipmentDetails(null);
    setCheckoutReason("");
  };

  return (
    <Box p={3} bgcolor="white" boxShadow={2} borderRadius={2}>
      <Typography variant="h5" fontWeight={700} mb={2}>Check-out Power Equipment</Typography>

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
          <Typography variant="body1">Manufacturer: {equipmentDetails.manufacturer || "—"}</Typography>
          <Typography variant="body1">Model Number: {equipmentDetails.modelNumber || "—"}</Typography>
          <Typography variant="body1">Serial Number: {equipmentDetails.serialNumber || "—"}</Typography>
          <Typography variant="body1">Voltage: {equipmentDetails.voltage || "—"}</Typography>
          <Typography variant="body1">Amp-hours: {equipmentDetails.ampHours || "—"}</Typography>
          <Typography variant="body1">Status: {equipmentDetails.status || "—"}</Typography>
          <Typography variant="body1">Zone: {equipmentDetails.zoneName || "—"}</Typography>
          <Typography variant="body1">Location: {equipmentDetails.location || "—"}</Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Check-out Reason *</InputLabel>
            <Select
              value={checkoutReason}
              label="Check-out Reason *"
              onChange={(e) => setCheckoutReason(e.target.value)}
            >
              <MenuItem value=""><em>Select reason</em></MenuItem>
              {checkoutReasons.map((o: any) => (
                <MenuItem key={o.key} value={o.key}>{o.label || o.key}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "15px", backgroundColor: "#9B2735" }}
            onClick={handleCheckout}
          >
            Check-out Power Equipment
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CheckoutEquipment;
