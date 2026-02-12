import React, { useState } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';
import { TextField, Button, Box, Typography, IconButton, InputAdornment } from '@mui/material';
import { toast } from 'react-toastify';
import { ToolData } from '@/pages/tools';
import ClearIcon from '@mui/icons-material/Clear';
import moment from 'moment';

const CheckoutForm: React.FC = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [toolDetails, setToolDetails] = useState<ToolData | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleScan = async (result: any) => {
    const scannedCode = result?.text;
    if (scannedCode) {
      setQrCode(scannedCode);
      setIsScanning(false);
      try {
        const response = await axios.get(`api/router?path=api/truck/qrCode/${scannedCode}`);
        setToolDetails(response.data);
        if (response.data.zoneId) {
          setShowConfirmDialog(true);
        } else {
          toast.warn('Truck is not checked in.');
        }
      } catch (error: any) {
        const errmsg = error?.response?.data?.message;
        toast.error(errmsg || "Something went wrong");
      }
    }
  };

  console.log(showConfirmDialog, "dialog");

  const handleCheckout = async () => {
    try {
      await axios.post(`/api/router?path=api/tools/check-out`, { toolId: toolDetails?.id });
      toast.success('Tool checked out successfully.');
      setShowConfirmDialog(false);
      setToolDetails(null)
      setQrCode(null)
    } catch (error: any) {
      const errmsg = error?.response?.data?.message;
      toast.error(errmsg || 'Error during checkout.');
    }
  };

  return (
    <Box p={3} bgcolor="white" boxShadow={2}>
      <Typography variant="h5">Checkout Form</Typography>
      {isScanning ? (
        <div>
          <QrReader
            onResult={handleScan}
            constraints={{ facingMode: "environment" }}
            //@ts-ignore
            style={{ width: "40%", height: "40%" }}
          />
          <Button onClick={() => setIsScanning(false)}>Close Scanner</Button>
        </div>
      ) : (
        <TextField
          label="Scan QR Code"
          value={qrCode || ''}
          margin='normal'
          InputProps={{

            endAdornment: (
              <>
                <InputAdornment position="end"><Button onClick={() => setIsScanning(true)}>Scan</Button></InputAdornment>
                <InputAdornment position="end"><IconButton onClick={() => { setQrCode(null); setToolDetails(null) }}><ClearIcon /></IconButton></InputAdornment>
              </>
            )
          }}
          fullWidth
        />
      )}
      {toolDetails && (
        <Box mt={2} display="flex" flexDirection="column">
          <Typography variant="h4">Tool Details:</Typography>
          <br />
          <Typography variant="body1">QR Code ID: {toolDetails.qrCodeId}</Typography>
          <Typography variant="body1">Tool ID: {toolDetails.toolId}</Typography>
          <Typography variant="body1">Part Number: {toolDetails.partNumber}</Typography>
          <Typography variant="body1">Tool Name: {toolDetails.toolName}</Typography>
          <Typography variant="body1">Description: {toolDetails.toolDescription}</Typography>
          <Typography variant="body1">Supplier: {toolDetails.supplier}</Typography>
          <Typography variant="body1">Status: {toolDetails.status}</Typography>
          <Typography variant="body1">Assigned Person: {toolDetails.assignedPerson || 'N/A'}</Typography>
          <Typography variant="body1">Assigned Location: {toolDetails.assignedLocation || 'N/A'}</Typography>
          <Typography variant="body1">Created At: {toolDetails.createdAt ? moment(toolDetails.createdAt).format("MMM DD, YYYY") : 'N/A'}</Typography>
          <Typography variant="body1">Updated At: {toolDetails.updatedAt ? moment(toolDetails.updatedAt).format("MMM DD, YYYY") : 'N/A'}</Typography>

          <br />
          <Typography sx={{ fontWeight: 'bold' }}>Do you want to checkout this truck?</Typography>
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '15px' }} onClick={handleCheckout}>Confirm</Button>
        </Box>

      )}
      {/* <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
                <DialogTitle>Confirm Checkout</DialogTitle>
                <DialogContent>
                    <Typography>Do you want to checkout this truck?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowConfirmDialog(false)} color="primary">Cancel</Button>
                    <Button onClick={handleCheckout} color="primary">Yes</Button>
                </DialogActions>
            </Dialog> */}
    </Box>
  );
};

export default CheckoutForm;
