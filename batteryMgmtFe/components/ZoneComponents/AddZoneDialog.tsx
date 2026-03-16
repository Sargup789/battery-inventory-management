import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Grid, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { ZoneData } from "@/pages/index";
import { useQuery } from "react-query";

type Props = {
  open: boolean;
  editData: ZoneData | null;
  parentZoneId: string | null;
  allZones: ZoneData[];
  handleClose: () => void;
  onSuccess: () => void;
};

const AddZoneDialog = ({ open, editData, parentZoneId, allZones, handleClose, onSuccess }: Props) => {
  const isEdit = Boolean(editData);
  const [formData, setFormData] = useState<Partial<ZoneData>>({});

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({ parentZoneId: parentZoneId || undefined });
    }
  }, [editData, parentZoneId, open]);

  const fetchDropdown = (name: string) =>
    useQuery(["dropdown", name], async () => {
      const res = await axios.get(`/api/router?path=api/dropdownmaster/${name}`);
      return res.data?.options || [];
    }, { refetchOnWindowFocus: false });

  const { data: locationTypes = [] } = fetchDropdown("locationType");
  const { data: cities = [] } = fetchDropdown("city");
  const { data: states = [] } = fetchDropdown("state");

  const set = (field: keyof ZoneData, value: any) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await axios.put(`/api/router?path=api/zones/${editData.id}`, formData);
        toast.success("Zone updated successfully");
      } else {
        await axios.post(`/api/router?path=api/zones`, formData);
        toast.success("Zone created successfully");
      }
      onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "An error occurred");
    }
  };

  const topLevelZones = allZones.filter((z) => !z.parentZoneId && z.id !== editData?.id);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? "Edit Zone" : parentZoneId ? "Add Sub-zone" : "Add Zone"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <TextField label="Name" size="small" fullWidth value={formData.name || ""} onChange={(e) => set("name", e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Identifier" size="small" fullWidth value={formData.identifier || ""} onChange={(e) => set("identifier", e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Location Type</InputLabel>
              <Select value={formData.locationType || ""} label="Location Type" onChange={(e) => set("locationType", e.target.value)}>
                <MenuItem value=""><em>None</em></MenuItem>
                {locationTypes.map((o: any) => <MenuItem key={o.key} value={o.key}>{o.label || o.key}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>City</InputLabel>
              <Select value={formData.city || ""} label="City" onChange={(e) => set("city", e.target.value)}>
                <MenuItem value=""><em>None</em></MenuItem>
                {cities.map((o: any) => <MenuItem key={o.key} value={o.key}>{o.label || o.key}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>State</InputLabel>
              <Select value={formData.state || ""} label="State" onChange={(e) => set("state", e.target.value)}>
                <MenuItem value=""><em>None</em></MenuItem>
                {states.map((o: any) => <MenuItem key={o.key} value={o.key}>{o.label || o.key}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Parent Zone</InputLabel>
              <Select value={formData.parentZoneId || ""} label="Parent Zone" onChange={(e) => set("parentZoneId", e.target.value || null)}>
                <MenuItem value=""><em>None (Top-level)</em></MenuItem>
                {topLevelZones.map((z) => <MenuItem key={z.id} value={z.id}>{z.name}</MenuItem>)}
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

export default AddZoneDialog;
