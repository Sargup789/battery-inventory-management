import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Grid } from "@mui/material";
import QRCode from "react-qr-code";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery } from "react-query";
import { toPng } from "html-to-image";

const QRCodeComponents: React.FC = () => {
  const [newCode, setNewCode] = useState("");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const { data: qrCodes = [], refetch } = useQuery("allQrCodes", async () => {
    const res = await axios.get(`/api/router?path=api/qr-code`);
    return Array.isArray(res.data) ? res.data : [];
  }, { refetchOnWindowFocus: false });

  const handleCreate = async () => {
    if (!newCode.trim()) {
      toast.error("Please enter a QR code value.");
      return;
    }
    try {
      await axios.post(`/api/router?path=api/qr-code`, { code: newCode.trim() });
      toast.success("QR Code created.");
      setNewCode("");
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to create QR code.");
    }
  };

  const handleDownload = (code: string) => {
    const el = document.getElementById(`qr-${code}`);
    if (!el) return;
    toPng(el).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = `qr-${code}.png`;
      link.href = dataUrl;
      link.click();
    });
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>QR Code Management</Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" mb={2}>Generate New QR Code</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            label="QR Code Value"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCreate()}
            size="small"
            sx={{ minWidth: 300 }}
          />
          <Button variant="contained" onClick={handleCreate} style={{ borderRadius: 15, backgroundColor: "#9B2735", fontSize: "13px" }}>
            Generate
          </Button>
        </Box>
      </Paper>

      <Typography variant="h6" mb={2}>All QR Codes ({qrCodes.length})</Typography>
      <Grid container spacing={2}>
        {qrCodes.map((qr: any) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={qr.code}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                cursor: "pointer",
                border: selectedCode === qr.code ? "2px solid #9B2735" : "1px solid #eee",
                opacity: qr.inUse ? 0.7 : 1,
              }}
              onClick={() => setSelectedCode(qr.code)}
            >
              <Box id={`qr-${qr.code}`} display="flex" flexDirection="column" alignItems="center" p={1}>
                <QRCode value={qr.code} size={128} />
                <Typography variant="caption" mt={1}>{qr.code}</Typography>
              </Box>
              <Typography variant="caption" color={qr.inUse ? "error" : "success.main"}>
                {qr.inUse ? "In Use" : "Available"}
              </Typography>
              <Box mt={1}>
                <Button size="small" onClick={(e) => { e.stopPropagation(); handleDownload(qr.code); }}>
                  Download
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QRCodeComponents;
