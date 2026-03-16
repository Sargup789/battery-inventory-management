import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Grid, FormControl, InputLabel, Select, MenuItem, Typography
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { EquipmentData } from "@/pages/power-equipment";
import { useQuery } from "react-query";
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

  useEffect(() => {
    if (editData) {
      setFormData(editData);
      setDateOfArrival(editData.dateOfArrival ? new Date(editData.dateOfArrival) : null);
    } else {
      setFormData({});
      setDateOfArrival(null);
    }
  }, [editData, open]);

  const fetchDropdown = (name: string) =>
    useQuery(["dropdown", name], async () => {
      const res = await axios.get(`/api/router?path=api/dropdownmaster/${name}`);
      return res.data?.options || [];
    }, { refetchOnWindowFocus: false });

  const { data: itemTypes = [] } = fetchDropdown("itemType");
  const { data: manufacturers = [] } = fetchDropdown("manufacturer");
  const { data: statuses = [] } = fetchDropdown("powerEquipmentStatus");
  const { data: assignationTypes = [] } = fetchDropdown("assignationType");
  const { data: inboundDocTypes = [] } = fetchDropdown("inboundDocumentType");
  const { data: outboundDocTypes = [] } = fetchDropdown("outboundDocumentType");

  const { data: qrCodes = [] } = useQuery("qrCodes", async () => {
    const res = await axios.get(`/api/router?path=api/qr-code`);
    const rows = Array.isArray(res.data) ? res.data : [];
    return rows.filter((qr: any) => !qr.inUse);
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
      <DialogTitle>{isEdit ? "Edit Power Equipment" : "Add Power Equipment"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
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
            {dropdownField("Power Equipment Status", "status", statuses)}
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
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>QR Code</InputLabel>
              <Select
                value={formData.qrCodeId || ""}
                label="QR Code"
                onChange={(e) => set("qrCodeId", e.target.value)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {qrCodes.map((qr: any) => (
                  <MenuItem key={qr.code} value={qr.code}>{qr.code}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" style={{ backgroundColor: "#1565C0" }}>
          {isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEquipmentDialog;
