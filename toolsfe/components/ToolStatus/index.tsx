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
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";
import { ToolData } from "@/pages/tools";
import moment from "moment";

const CheckToolStatusForm: React.FC = () => {
  const [qrCode, setQrCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [tool, setTool] = useState<ToolData | null>(null);

  const handleScan = async (result: any) => {
    const scannedCode = result?.text;
    if (!scannedCode) return;
    setQrCode(scannedCode);
    setIsScanning(false);
    try {
      const response = await axios.get(`/api/router?path=api/truck/qrCode/${scannedCode}`);
      setTool(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error fetching tool status.");
    }
  };

  return (
    <Box p={3} bgcolor="white" boxShadow={2}>
      <Typography variant="h5">Check Tool Status</Typography>
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
        <Box mt={2} display="flex" flexDirection="column" gap={1}>
          <Typography variant="h6">Tool Details</Typography>
          <Typography>QR Code ID: {tool.qrCodeId || "N/A"}</Typography>
          <Typography>Tool ID: {tool.toolId || "N/A"}</Typography>
          <Typography>Part Number: {tool.partNumber || "N/A"}</Typography>
          <Typography>Tool Name: {tool.toolName || "N/A"}</Typography>
          <Typography>Tool Description: {tool.toolDescription || "N/A"}</Typography>
          <Typography>Supplier: {tool.supplier || "N/A"}</Typography>
          <Typography>Status: {tool.status || "N/A"}</Typography>
          <Typography>Assigned Person: {(tool as any).assignedPerson || "N/A"}</Typography>
          <Typography>
            Person Designation: {(tool as any).assignedPersonDesignation || "N/A"}
          </Typography>
          <Typography>Person Email: {(tool as any).assignedPersonEmail || "N/A"}</Typography>
          <Typography>
            Person Phone: {(tool as any).assignedPersonPhoneNumber || "N/A"}
          </Typography>
          <Typography>Assigned Location: {(tool as any).assignedLocation || "N/A"}</Typography>
          <Typography>
            Location Type: {(tool as any).assignedLocationType || "N/A"}
          </Typography>
          <Typography>
            Location City: {(tool as any).assignedLocationCity || "N/A"}
          </Typography>
          <Typography>
            Location State: {(tool as any).assignedLocationState || "N/A"}
          </Typography>
          <Typography>
            Created At:{" "}
            {tool.createdAt ? moment(tool.createdAt).format("MMM DD, YYYY HH:mm") : "N/A"}
          </Typography>
          <Typography>
            Updated At:{" "}
            {tool.updatedAt ? moment(tool.updatedAt).format("MMM DD, YYYY HH:mm") : "N/A"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CheckToolStatusForm;
