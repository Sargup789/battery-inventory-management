import React, { useState } from "react";
import { Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import QRCode from "react-qr-code";
import axios from "axios";
import { toPng } from "html-to-image";
import PrintDialog from "./PrintDialog";

interface QRCodeData {
  id: string;
  code: string;
  inUse: boolean;
}

const QRCodeIndex = () => {
  const [quantity, setQuantity] = useState("");
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [printCode, setPrintCode] = useState("");

  const handleGenerate = async () => {
    const response = await axios.post("/api/router?path=api/qr-code", { quantity: Number(quantity) });
    setQrCodes(response.data);
  };

  const handleSave = (code: string) => {
    const node = document.getElementById(`qr-${code}`);
    if (!node) return;
    toPng(node)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `QR-${code}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error("Error generating QR image:", error);
      });
  };

  const handlePrint = (code: string) => {
    setPrintCode(code);
    setPrintDialogOpen(true);
  };

  return (
    <Box sx={{ padding: 3, backgroundColor: "white", borderRadius: 2 }}>
      <Typography variant="h6" marginBottom={2}>Generate QR Code</Typography>
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
        <TextField
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          label="Quantity"
          size="small"
          variant="outlined"
          sx={{ marginRight: 1, flexGrow: 0.5 }}
        />
        <Button
          variant="contained"
          style={{ borderRadius: 15, backgroundColor: "#9B2735", fontSize: "13px" }}
          onClick={handleGenerate}
        >
          Generate
        </Button>
      </Box>

      {qrCodes.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>QR Code</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {qrCodes.map((qrCode) => (
                <TableRow key={qrCode.id}>
                  <TableCell>{qrCode.code}</TableCell>
                  <TableCell>
                    <QRCode
                      id={`qr-${qrCode.code}`}
                      value={qrCode.code}
                      size={64}
                      level="H"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      style={{ borderRadius: 15, backgroundColor: "#9B2735", fontSize: "13px" }}
                      onClick={() => handleSave(qrCode.code)}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ ml: 2 }}
                      style={{ borderRadius: 15, backgroundColor: "#000", fontSize: "13px" }}
                      onClick={() => handlePrint(qrCode.code)}
                    >
                      Print
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {printDialogOpen && (
        <PrintDialog open={printDialogOpen} handleClose={() => setPrintDialogOpen(false)} code={printCode} />
      )}
    </Box>
  );
};

export default QRCodeIndex;
