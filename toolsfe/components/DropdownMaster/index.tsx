import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Tab, Tabs, Button, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Tooltip, Grid } from '@mui/material';
import axios from 'axios';
import { EditOutlined, DeleteOutline, Add, HighlightOff } from '@mui/icons-material';
import { DropdownMaster, DropdownOption } from '../types';
import { toast } from 'react-toastify';

const DropdownMasterComponent = () => {
    const [dropdowns, setDropdowns] = useState<DropdownMaster[]>([]);
    const [currentTab, setCurrentTab] = useState(0);
    const [optionModalOpen, setOptionModalOpen] = useState(false);
    const [keyValue, setKeyValue] = useState<DropdownOption>({ key: '', label: '' });
    const [currentOption, setCurrentOption] = useState<DropdownOption | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currentDropdownName, setCurrentDropdownName] = useState<string>('');

    const handleEditOption = (dropdownName: string, option: DropdownOption) => {
        setCurrentDropdownName(dropdownName);
        setKeyValue(option)
        setCurrentOption(option)
        setOptionModalOpen(true);
    };

    const handleAddOption = (dropdownName: string) => {
        setCurrentDropdownName(dropdownName);
        setKeyValue({ key: '', label: '' })
        setCurrentOption(null);
        setOptionModalOpen(true);
    };

    const handleDeleteOption = async () => {
        if (currentDropdownName && currentOption) {
            const url = `/api/router?path=api/dropdownmaster/${currentDropdownName}`;
            const updatedDropdown = dropdowns.find(d => d.dropdownName === currentDropdownName);
            if (updatedDropdown) {
                updatedDropdown.options = updatedDropdown.options.filter(opt => opt.key !== currentOption.key);
                try {
                    await axios.put(url, { options: updatedDropdown.options });
                    fetchDropdowns();
                } catch (error) {
                    console.error("Failed to delete option:", error);
                }
            }
        }
        setDeleteModalOpen(false);
    };

    useEffect(() => {
        fetchDropdowns();
    }, []);

    const fetchDropdowns = () => {
        axios.get('/api/router?path=api/dropdownmaster')
            .then(response => {
                setDropdowns(response.data);
            })
            .catch((error: any) => {
                toast.error(`Error fetching dropdowns: ${error.message}`);
            });
    }

    const handleSaveOption = async () => {
        if (currentDropdownName) {
            const url = `/api/router?path=api/dropdownmaster/${currentDropdownName}`;
            const updatedDropdown = dropdowns.find(d => d.dropdownName === currentDropdownName);
            if (updatedDropdown) {
                const safeKey = (keyValue.key || "").trim();
                const safeLabel = (keyValue.label || "").trim();
                if (!safeKey || !safeLabel) {
                    toast.error("Both key and value are required");
                    return;
                }
                const existingOptions = Array.isArray(updatedDropdown.options)
                    ? [...updatedDropdown.options]
                    : [];
                const normalizedOption = { key: safeKey, label: safeLabel };

                if (currentOption) {
                    const optionIndex = existingOptions.findIndex(
                        opt => opt.key === currentOption.key
                    );
                    if (optionIndex === -1) {
                        toast.error("Option not found. Refresh and try again.");
                        return;
                    }
                    existingOptions[optionIndex] = normalizedOption;
                } else {
                    const duplicateIndex = existingOptions.findIndex(opt => opt.key === safeKey);
                    if (duplicateIndex !== -1) {
                        toast.error("Option key already exists");
                        return;
                    }
                    existingOptions.push(normalizedOption);
                }
                try {
                    await axios.put(url, { options: existingOptions });
                    fetchDropdowns();
                } catch (error: any) {
                    toast.error(`Failed to update dropdown: ${error.message}`);
                }
            }
        }
        setOptionModalOpen(false);
        setCurrentOption(null);
    };

    const currentTable = dropdowns[currentTab]


    return (
        <Box p={3} bgcolor="white" boxShadow={2}>
            <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
                {dropdowns.map((dropdown, index) => (
                    <Tab key={index} label={dropdown?.dropdownName} />
                ))}
            </Tabs>

            <Grid container justifyContent="space-between" alignItems="center" marginBottom={2}>
                <Grid item>
                    <strong>Options List for {currentTable?.dropdownLabel}</strong>
                </Grid>
                <Grid item>
                    <Button
                        startIcon={<Add />}
                        variant="contained"
                        style={{
                            borderRadius: 15,
                            backgroundColor: "#9B2735",
                            fontSize: "13px"
                        }}
                        onClick={() => currentTable?.dropdownName && handleAddOption(currentTable.dropdownName)}
                        disabled={!currentTable?.dropdownName}
                    >
                        Add Record
                    </Button>
                </Grid>
            </Grid>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Index</TableCell>
                        <TableCell>Label</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {currentTable?.options?.map((option, idx) => (
                        <TableRow key={option.key}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell>{option.key}</TableCell>
                            <TableCell>{option.label}</TableCell>
                            <TableCell>
                                <Tooltip title="Edit">
                                    <IconButton size="small" onClick={() => handleEditOption(currentTable.dropdownName, option)}>
                                        <EditOutlined fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton size="small" onClick={() => { setDeleteModalOpen(true); setCurrentDropdownName(currentTable.dropdownName); setCurrentOption(option) }}>
                                        <DeleteOutline fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>


            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <DialogTitle>Delete Option</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this option?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
                    <Button
                        variant='contained'
                        style={{
                            borderRadius: 15,
                            backgroundColor: "#9B2735",
                            fontSize: "13px"
                        }}
                        onClick={handleDeleteOption}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={optionModalOpen} onClose={() => setOptionModalOpen(false)}>
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
                        {currentOption ? "Edit Option" : "Add Option"}
                    </Box>
                    <IconButton
                        children={<HighlightOff />}
                        color="inherit"
                        onClick={() => { setOptionModalOpen(false); setCurrentOption(null) }}
                        sx={{ transform: "translate(8px, -8px)" }}
                    />
                </DialogTitle>
                <DialogContent sx={{ flexDirection: 'column', display: 'flex' }}>
                    <TextField
                        label="Label"
                        value={keyValue.key}
                        sx={{ margin: "6px 3px" }}
                        onChange={e => setKeyValue({ ...keyValue, key: e.target.value })}
                    />
                    <TextField
                        label="Value"
                        value={keyValue.label}
                        sx={{ margin: "6px 3px" }}
                        onChange={e => setKeyValue({ ...keyValue, label: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' style={{
                        borderRadius: 15,
                        backgroundColor: "#9B2735",
                        fontSize: "13px"
                    }} onClick={() => handleSaveOption()}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default DropdownMasterComponent
