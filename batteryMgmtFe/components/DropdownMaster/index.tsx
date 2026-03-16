import React, { useState } from "react";
import { Box, Typography, Paper, List, ListItem, ListItemText, IconButton, Button, TextField, Divider, Chip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery } from "react-query";

const DropdownMasterIndex: React.FC = () => {
  const [selectedDropdown, setSelectedDropdown] = useState<any | null>(null);
  const [newOptionKey, setNewOptionKey] = useState("");
  const [newOptionLabel, setNewOptionLabel] = useState("");

  const { data: dropdowns = [], refetch } = useQuery("allDropdowns", async () => {
    const res = await axios.get(`/api/router?path=api/dropdownmaster`);
    return Array.isArray(res.data) ? res.data : [];
  }, { refetchOnWindowFocus: false });

  const handleSelect = (dropdown: any) => setSelectedDropdown(dropdown);

  const handleAddOption = async () => {
    if (!newOptionKey.trim()) {
      toast.error("Key is required.");
      return;
    }
    try {
      const updatedOptions = [
        ...(selectedDropdown.options || []),
        { key: newOptionKey.trim(), label: newOptionLabel.trim() || newOptionKey.trim() },
      ];
      await axios.put(`/api/router?path=api/dropdownmaster/${selectedDropdown.dropdownName}`, {
        options: updatedOptions,
      });
      toast.success("Option added.");
      setNewOptionKey("");
      setNewOptionLabel("");
      refetch().then(() => {
        // refresh selected
        const updated = dropdowns.find((d: any) => d.dropdownName === selectedDropdown.dropdownName);
        if (updated) setSelectedDropdown({ ...updated, options: updatedOptions });
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to add option.");
    }
  };

  const handleRemoveOption = async (key: string) => {
    try {
      const updatedOptions = (selectedDropdown.options || []).filter((o: any) => o.key !== key);
      await axios.put(`/api/router?path=api/dropdownmaster/${selectedDropdown.dropdownName}`, {
        options: updatedOptions,
      });
      toast.success("Option removed.");
      setSelectedDropdown({ ...selectedDropdown, options: updatedOptions });
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to remove option.");
    }
  };

  return (
    <Box display="flex" gap={3} height="80vh">
      <Paper sx={{ width: 280, p: 2, overflowY: "auto" }}>
        <Typography variant="h6" fontWeight={700} mb={2}>Dropdown Lists</Typography>
        <List dense>
          {dropdowns.map((dd: any) => (
            <ListItem
              key={dd.dropdownName}
              button
              selected={selectedDropdown?.dropdownName === dd.dropdownName}
              onClick={() => handleSelect(dd)}
              sx={{ borderRadius: 1, mb: 0.5 }}
            >
              <ListItemText primary={dd.dropdownLabel} secondary={`${(dd.options || []).length} options`} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper sx={{ flex: 1, p: 3, overflowY: "auto" }}>
        {selectedDropdown ? (
          <Box>
            <Typography variant="h6" fontWeight={700} mb={1}>{selectedDropdown.dropdownLabel}</Typography>
            <Typography variant="caption" color="text.secondary" mb={2} display="block">
              Key: {selectedDropdown.dropdownName}
            </Typography>

            <Box display="flex" gap={2} mb={2}>
              <TextField
                label="Key"
                size="small"
                value={newOptionKey}
                onChange={(e) => setNewOptionKey(e.target.value)}
              />
              <TextField
                label="Label (optional)"
                size="small"
                value={newOptionLabel}
                onChange={(e) => setNewOptionLabel(e.target.value)}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddOption}
                style={{ backgroundColor: "#1565C0" }}
              >
                Add
              </Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box display="flex" flexWrap="wrap" gap={1}>
              {(selectedDropdown.options || []).map((option: any) => (
                <Chip
                  key={option.key}
                  label={`${option.label || option.key} (${option.key})`}
                  onDelete={() => handleRemoveOption(option.key)}
                  deleteIcon={<DeleteIcon />}
                />
              ))}
              {(!selectedDropdown.options || selectedDropdown.options.length === 0) && (
                <Typography color="text.secondary">No options yet. Add one above.</Typography>
              )}
            </Box>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" justifyContent="center" height="100%">
            <Typography color="text.secondary">Select a dropdown list to manage its options.</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default DropdownMasterIndex;
