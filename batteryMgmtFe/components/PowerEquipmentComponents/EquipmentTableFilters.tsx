import React, { useState } from "react";
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { EquipmentFilters } from "@/pages/power-equipment";
import axios from "axios";
import { useQuery } from "react-query";

type Props = {
  filters: EquipmentFilters;
  onFiltersChange: (filters: EquipmentFilters) => void;
};

const EquipmentTableFilters = ({ filters, onFiltersChange }: Props) => {
  const [local, setLocal] = useState<EquipmentFilters>(filters);

  const { data: filterOptions } = useQuery("equipmentFilterOptions", async () => {
    const res = await axios.get(`/api/router?path=api/power-equipment/filters`);
    return res.data;
  }, { refetchOnWindowFocus: false });

  const handleApply = () => onFiltersChange(local);
  const handleClear = () => {
    setLocal({});
    onFiltersChange({});
  };

  return (
    <Box display="flex" gap={2} flexWrap="wrap" mb={2} p={2} bgcolor="white" borderRadius={2} boxShadow={1}>
      <TextField
        label="Search"
        size="small"
        value={local.search || ""}
        onChange={(e) => setLocal({ ...local, search: e.target.value })}
        sx={{ minWidth: 200 }}
      />
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={local.status || ""}
          label="Status"
          onChange={(e) => setLocal({ ...local, status: e.target.value })}
        >
          <MenuItem value="">All</MenuItem>
          {(filterOptions?.statuses || []).map((s: string) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Item Type</InputLabel>
        <Select
          value={local.itemType || ""}
          label="Item Type"
          onChange={(e) => setLocal({ ...local, itemType: e.target.value })}
        >
          <MenuItem value="">All</MenuItem>
          {(filterOptions?.itemTypes || []).map((t: string) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Manufacturer</InputLabel>
        <Select
          value={local.manufacturer || ""}
          label="Manufacturer"
          onChange={(e) => setLocal({ ...local, manufacturer: e.target.value })}
        >
          <MenuItem value="">All</MenuItem>
          {(filterOptions?.manufacturers || []).map((m: string) => (
            <MenuItem key={m} value={m}>{m}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleApply} style={{ backgroundColor: "#9B2735" }}>Apply</Button>
      <Button variant="outlined" onClick={handleClear}>Clear</Button>
    </Box>
  );
};

export default EquipmentTableFilters;
