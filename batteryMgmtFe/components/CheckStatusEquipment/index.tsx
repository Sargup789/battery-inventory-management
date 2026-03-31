import React, { useState } from "react";
import axios from "axios";
import { QrReader } from "react-qr-reader";
import {
  Box, Typography, TextField, InputAdornment, Button, IconButton, Chip, Divider, Paper
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";
import moment from "moment";

const CheckStatusEquipment: React.FC = () => {
  const [qrCode, setQrCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleScan = async (scanResult: any) => {
    const scannedCode = scanResult?.text;
    if (!scannedCode) return;
    setQrCode(scannedCode);
    setIsScanning(false);
    try {
      const response = await axios.get(`/api/router?path=api/power-equipment/status/${scannedCode}`);
      setResult(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Equipment not found.");
    }
  };

  const handleClear = () => {
    setQrCode("");
    setResult(null);
  };

  const eq = result?.equipment;
  const events = result?.events || [];

  const getStatusColor = (status: string) => {
    if (status === "created") return "default";
    if (status === "checked-in") return "success";
    return "warning";
  };

  return (
    <Box p={3} bgcolor="white" boxShadow={2}>
      <Typography variant="h5">Check Equipment Status</Typography>
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
          onChange={(e) => setQrCode(e.target.value)}
          InputProps={{
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <Button onClick={() => setIsScanning(true)}>Scan</Button>
                </InputAdornment>
                <InputAdornment position="end">
                  <IconButton onClick={handleClear}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              </>
            ),
          }}
        />
      )}

      {eq && (
        <Box mt={2} display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6">Equipment Details</Typography>
            <Chip label={eq.status} color={getStatusColor(eq.status) as any} />
          </Box>

          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography>QR Code: {eq.qrCodeId || "N/A"}</Typography>
            <Typography>Equipment ID: {eq.equipmentId || "N/A"}</Typography>
            <Typography>Item Type: {eq.itemType || "N/A"}</Typography>
            <Typography>Manufacturer: {eq.manufacturer || "N/A"}</Typography>
            <Typography>Model Number: {eq.modelNumber || "N/A"}</Typography>
            <Typography>Serial Number: {eq.serialNumber || "N/A"}</Typography>
            <Typography>Voltage: {eq.voltage || "N/A"}</Typography>
            <Typography>Amp-hours: {eq.ampHours || "N/A"}</Typography>
            <Typography>Power Equipment Status: {eq.powerEquipmentStatus || "N/A"}</Typography>
            <Typography>Assignation Type: {eq.assignationType || "N/A"}</Typography>
            <Typography>Assigned To: {eq.assignedTo || "N/A"}</Typography>
            <Typography>Customer Name: {eq.customerName || "N/A"}</Typography>
            <Typography>Order Entry Number: {eq.orderEntryNumber || "N/A"}</Typography>
            <Divider sx={{ my: 1 }} />
            {eq.status === "checked-in" && (
              <>
                <Typography>Zone: {eq.zoneName || "N/A"}</Typography>
                <Typography>Location Type: {eq.zoneLocationType || "N/A"}</Typography>
                <Typography>City: {eq.zoneCity || "N/A"}</Typography>
                <Typography>State: {eq.zoneState || "N/A"}</Typography>
                <Typography>Location: {eq.location || "N/A"}</Typography>
              </>
            )}
            {eq.checkoutReason && (
              <Typography>Check-out Reason: {eq.checkoutReason}</Typography>
            )}
            <Divider sx={{ my: 1 }} />
            <Typography>
              Created: {eq.createdAt ? moment(eq.createdAt).format("MMM DD, YYYY HH:mm") : "N/A"}
            </Typography>
            <Typography>
              Updated: {eq.updatedAt ? moment(eq.updatedAt).format("MMM DD, YYYY HH:mm") : "N/A"}
            </Typography>
          </Paper>

          {events.length > 0 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={1}>Event History</Typography>
              {events.map((event: any, idx: number) => (
                <Paper key={idx} variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip label={event.eventType} size="small" />
                    <Typography variant="caption" color="text.secondary">
                      {moment(event.createdAt).format("MMM DD, YYYY HH:mm")}
                    </Typography>
                  </Box>
                  {event.zoneName && <Typography variant="body2">Zone: {event.zoneName}</Typography>}
                  {event.location && <Typography variant="body2">Location: {event.location}</Typography>}
                  {event.checkoutReason && <Typography variant="body2">Reason: {event.checkoutReason}</Typography>}
                  {event.performedBy && <Typography variant="body2">By: {event.performedBy}</Typography>}
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CheckStatusEquipment;
