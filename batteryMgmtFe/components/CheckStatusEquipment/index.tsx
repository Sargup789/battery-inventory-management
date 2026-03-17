import React, { useState } from "react";
import axios from "axios";
import { QrReader } from "react-qr-reader";
import {
  TextField, Button, Box, Typography, IconButton, InputAdornment, Chip, Divider, Paper
} from "@mui/material";
import { toast } from "react-toastify";
import ClearIcon from "@mui/icons-material/Clear";
import moment from "moment";

const CheckStatusEquipment: React.FC = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleLookup = async (code?: string) => {
    const lookupCode = code || qrCode;
    if (!lookupCode) return;
    try {
      // First try by QR code
      const response = await axios.get(`/api/router?path=api/power-equipment/status/${lookupCode}`);
      setResult(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Equipment not found.");
    }
  };

  const handleScan = async (result: any) => {
    const scannedCode = result?.text;
    if (!scannedCode) return;
    setQrCode(scannedCode);
    setIsScanning(false);
    await handleLookup(scannedCode);
  };

  const handleClear = () => {
    setQrCode(null);
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
    <Box p={3} bgcolor="white" boxShadow={2} borderRadius={2}>
      <Typography variant="h5" fontWeight={700} mb={2}>Check Equipment Status</Typography>

      {isScanning ? (
        <Box>
          <div style={{ width: "40%" }}>
            <QrReader onResult={handleScan} constraints={{ facingMode: "environment" }} />
          </div>
          <Button onClick={() => setIsScanning(false)}>Close Scanner</Button>
        </Box>
      ) : (
        <TextField
          label="Scan QR Code or Enter Equipment ID"
          value={qrCode || ""}
          margin="normal"
          fullWidth
          onChange={(e) => setQrCode(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleLookup()}
          InputProps={{
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <Button onClick={() => setIsScanning(true)}>Scan</Button>
                </InputAdornment>
                <InputAdornment position="end">
                  <Button onClick={() => handleLookup()}>Lookup</Button>
                </InputAdornment>
                <InputAdornment position="end">
                  <IconButton onClick={handleClear}><ClearIcon /></IconButton>
                </InputAdornment>
              </>
            ),
          }}
        />
      )}

      {eq && (
        <Box mt={3}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography variant="h6" fontWeight={700}>Equipment Details</Typography>
            <Chip label={eq.status} color={getStatusColor(eq.status) as any} />
          </Box>

          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="body1"><strong>Equipment ID:</strong> {eq.equipmentId}</Typography>
            <Typography variant="body1"><strong>Item Type:</strong> {eq.itemType || "—"}</Typography>
            <Typography variant="body1"><strong>Manufacturer:</strong> {eq.manufacturer || "—"}</Typography>
            <Typography variant="body1"><strong>Model Number:</strong> {eq.modelNumber || "—"}</Typography>
            <Typography variant="body1"><strong>Serial Number:</strong> {eq.serialNumber || "—"}</Typography>
            <Typography variant="body1"><strong>Voltage:</strong> {eq.voltage || "—"}</Typography>
            <Typography variant="body1"><strong>Amp-hours:</strong> {eq.ampHours || "—"}</Typography>
            <Typography variant="body1"><strong>Assignation Type:</strong> {eq.assignationType || "—"}</Typography>
            <Typography variant="body1"><strong>Assigned To:</strong> {eq.assignedTo || "—"}</Typography>
            <Typography variant="body1"><strong>Customer Name:</strong> {eq.customerName || "—"}</Typography>
            <Typography variant="body1"><strong>Order Entry Number:</strong> {eq.orderEntryNumber || "—"}</Typography>
            <Divider sx={{ my: 1 }} />
            {eq.status === "checked-in" && (
              <>
                <Typography variant="body1"><strong>Zone:</strong> {eq.zoneName || "—"}</Typography>
                <Typography variant="body1"><strong>Location Type:</strong> {eq.zoneLocationType || "—"}</Typography>
                <Typography variant="body1"><strong>City:</strong> {eq.zoneCity || "—"}</Typography>
                <Typography variant="body1"><strong>State:</strong> {eq.zoneState || "—"}</Typography>
                <Typography variant="body1"><strong>Location:</strong> {eq.location || "—"}</Typography>
              </>
            )}
            {eq.checkoutReason && (
              <Typography variant="body1"><strong>Check-out Reason:</strong> {eq.checkoutReason}</Typography>
            )}
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
