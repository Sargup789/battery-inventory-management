import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Grid, FormControl, InputLabel, Select, MenuItem, Typography, IconButton, Box, InputAdornment
} from "@mui/material";
import { HighlightOff } from "@mui/icons-material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import { toast } from "react-toastify";
import { EquipmentData } from "@/pages/power-equipment";
import { useQuery } from "react-query";
import { QrReader } from "react-qr-reader";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  open: boolean;
  editData: EquipmentData | null;
  handleClose: () => void;
  onSuccess: () => void;
};

const AddEquipmentDialog = ({ open, editData, handleClose, onSuccess }: Props) => {
  const isEdit = Boolean(editData);
  const [formData, setFormData] = useState<Partial<EquipmentData>>({});
  const [dateOfArrival, setDateOfArrival] = useState<Date | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
      setDateOfArrival(editData.dateOfArrival ? new Date(editData.dateOfArrival) : null);
    } else {
      setFormData({});
      setDateOfArrival(null);
    }
  }, [editData, open]);

  useEffect(() => {
    if (!open) setIsScanning(false);
  }, [open]);

  const handleScanResult = (result: any) => {
    const text = typeof result?.getText === "function" ? result.getText() : result?.text;
    if (text) {
      set("qrCodeId", text.trim());
      setIsScanning(false);
    }
  };

  const { data: itemTypes = [] } = useQuery(["dropdown", "itemType"], async () => {
    const res = await axios.get(`/api/router?path=api/dropdownmaster/itemType`);
    return res.data?.options || [];
  }, { refetchOnWindowFocus: false });
  const { data: manufacturers = [] } = useQuery(["dropdown", "manufacturer"], async () => {
    const res = await axios.get(`/api/router?path=api/dropdownmaster/manufacturer`);
    return res.data?.options || [];
  }, { refetchOnWindowFocus: false });
  const { data: statuses = [] } = useQuery(["dropdown", "powerEquipmentStatus"], async () => {
    const res = await axios.get(`/api/router?path=api/dropdownmaster/powerEquipmentStatus`);
    return res.data?.options || [];
  }, { refetchOnWindowFocus: false });
  const { data: assignationTypes = [] } = useQuery(["dropdown", "assignationType"], async () => {
    const res = await axios.get(`/api/router?path=api/dropdownmaster/assignationType`);
    return res.data?.options || [];
  }, { refetchOnWindowFocus: false });
  const { data: inboundDocTypes = [] } = useQuery(["dropdown", "inboundDocumentType"], async () => {
    const res = await axios.get(`/api/router?path=api/dropdownmaster/inboundDocumentType`);
    return res.data?.options || [];
  }, { refetchOnWindowFocus: false });
  const { data: outboundDocTypes = [] } = useQuery(["dropdown", "outboundDocumentType"], async () => {
    const res = await axios.get(`/api/router?path=api/dropdownmaster/outboundDocumentType`);
    return res.data?.options || [];
  }, { refetchOnWindowFocus: false });


  const set = (field: keyof EquipmentData, value: any) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    try {
      const payload = { ...formData, dateOfArrival: dateOfArrival || undefined };
      if (isEdit) {
        await axios.put(`/api/router?path=api/power-equipment/${editData.id}`, payload);
        toast.success("Equipment updated successfully");
      } else {
        await axios.post(`/api/router?path=api/power-equipment`, payload);
        toast.success("Equipment created successfully");
      }
      onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "An error occurred");
    }
  };

  const dropdownField = (label: string, field: keyof EquipmentData, options: any[]) => (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select value={(formData[field] as string) || ""} label={label} onChange={(e) => set(field, e.target.value)}>
        <MenuItem value=""><em>None</em></MenuItem>
        {options.map((o: any) => (
          <MenuItem key={o.key} value={o.key}>{o.label || o.key}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const textField = (label: string, field: keyof EquipmentData) => (
    <TextField
      label={label}
      size="small"
      fullWidth
      value={(formData[field] as string) || ""}
      onChange={(e) => set(field, e.target.value)}
    />
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {isEdit ? "Edit Power Equipment" : "Add Power Equipment"}
        </Box>
        <IconButton
          children={<HighlightOff />}
          color="inherit"
          onClick={handleClose}
          sx={{ transform: "translate(8px, -8px)" }}
        />
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="QR Code"
              size="small"
              fullWidth
              value={(formData.qrCodeId as string) || ""}
              onChange={(e) => set("qrCodeId", e.target.value)}
              disabled={isEdit}
              placeholder="Scan or enter QR code"
              InputProps={{
                endAdornment: (
                  <>
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setIsScanning((s) => !s)}
                        disabled={isEdit}
                        title="Scan QR"
                      >
                        <QrCodeScannerIcon />
                      </IconButton>
                    </InputAdornment>
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => set("qrCodeId", "")}
                        disabled={isEdit}
                        title="Clear"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  </>
                ),
              }}
            />
            {isScanning && (
              <Box sx={{ mt: 1 }}>
                <QrReader
                  onResult={handleScanResult}
                  constraints={{ facingMode: "environment" }}
                  containerStyle={{ width: "100%" }}
                />
                <Button size="small" sx={{ mt: 1 }} onClick={() => setIsScanning(false)}>
                  Close Scanner
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            {dropdownField("Item Type", "itemType", itemTypes)}
          </Grid>
          <Grid item xs={12} sm={6}>
            {dropdownField("Manufacturer", "manufacturer", manufacturers)}
          </Grid>
          <Grid item xs={12} sm={6}>
            {textField("Model Number", "modelNumber")}
          </Grid>
          <Grid item xs={12} sm={6}>
            {textField("Serial Number", "serialNumber")}
          </Grid>
          <Grid item xs={12} sm={6}>
            {textField("Voltage", "voltage")}
          </Grid>
          <Grid item xs={12} sm={6}>
            {textField("Amp-hours", "ampHours")}
          </Grid>
          <Grid item xs={12} sm={6}>
            {dropdownField("Power Equipment Status", "powerEquipmentStatus", statuses)}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">Date of Arrival</Typography>
            <br />
            <ReactDatePicker
              selected={dateOfArrival}
              onChange={(date) => setDateOfArrival(date)}
              dateFormat="MMM dd, yyyy"
              placeholderText="Select date"
              customInput={<TextField size="small" fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {dropdownField("Assignation Type", "assignationType", assignationTypes)}
          </Grid>
          <Grid item xs={12} sm={6}>
            {textField("Assigned To", "assignedTo")}
          </Grid>
          <Grid item xs={12} sm={6}>
            {textField("Truck Model Number", "truckModelNumber")}
          </Grid>
          <Grid item xs={12} sm={6}>
            {textField("Truck Serial Number", "truckSerialNumber")}
          </Grid>
          <Grid item xs={12} sm={6}>
            {dropdownField("In-bound Document Type", "inboundDocumentType", inboundDocTypes)}
          </Grid>
          <Grid item xs={12} sm={6}>
            {textField("In-bound Document Number", "inboundDocumentNumber")}
          </Grid>
          <Grid item xs={12} sm={6}>
            {textField("Order Entry Number", "orderEntryNumber")}
          </Grid>
          <Grid item xs={12} sm={6}>
            {dropdownField("Out-bound Document Type", "outboundDocumentType", outboundDocTypes)}
          </Grid>
          <Grid item xs={12} sm={6}>
            {textField("Out-bound Document Number", "outboundDocumentNumber")}
          </Grid>
          <Grid item xs={12} sm={6}>
            {textField("Customer Name", "customerName")}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          variant="contained"
          style={{
            borderRadius: 15,
            backgroundColor: "#9B2735",
            fontSize: "13px"
          }}
        >
          {isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEquipmentDialog;
