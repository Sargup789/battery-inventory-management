import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { HighlightOff } from "@mui/icons-material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ClearIcon from "@mui/icons-material/Clear";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { Field, Form } from "react-final-form";
import { QrReader } from "react-qr-reader";
import axios from "axios";
import { DropdownMaster } from "../types";

type ToolFormValues = {
    qrCodeId: string;
    toolId: string;
    partNumber: string;
    toolName: string;
    toolDescription?: string;
    supplier: string;
};

interface ToolDialogProps {
    open: boolean;
    handleClose: () => void;
    isViewMode: boolean;
    // kept for compatibility with current callers
    toolDialogData: any;
    onSubmit: (values: any) => void;
}

function generateToolId(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let out = "";
    for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
}

function extractQrCodeFromText(text: string): string {
    // Supports either a plain code (e.g. "QR123") or JSON (e.g. {"qrCodeId":"QR123"} / {"code":"QR123"})
    const trimmed = (text ?? "").trim();
    if (!trimmed) return "";
    try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === "object") {
            if (typeof parsed.qrCodeId === "string") return parsed.qrCodeId.trim();
            if (typeof parsed.code === "string") return parsed.code.trim();
            if (typeof parsed.id === "string") return parsed.id.trim();
        }
    } catch {
        // ignore
    }
    return trimmed;
}

const AddToolDialog: React.FC<ToolDialogProps> = ({
    open,
    handleClose,
    isViewMode,
    toolDialogData,
    onSubmit,
}) => {
    const isEditMode = useMemo(() => Object.keys(toolDialogData || {}).length > 0, [toolDialogData]);
    const [isScanning, setIsScanning] = useState(false);
    const [dropdowns, setDropdowns] = useState<DropdownMaster[]>([]);

    const supplierDropdown = useMemo(() => {
        return dropdowns.find((d) => {
            const name = (d.dropdownName || "").toLowerCase();
            const label = (d.dropdownLabel || "").toLowerCase();
            return name === "supplier" || label === "supplier";
        });
    }, [dropdowns]);

    const getAllDropdowns = async () => {
        const response = await axios.get(`/api/router?path=api/dropdownmaster`);
        return response.data;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dropdownData = await getAllDropdowns();
                setDropdowns(dropdownData);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Failed to fetch dropdown master:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!open) {
            setIsScanning(false);
        }
    }, [open]);

    const initialValues: ToolFormValues = {
        qrCodeId: isEditMode ? (toolDialogData?.qrCodeId ?? "") : "",
        toolId: isEditMode ? (toolDialogData?.toolId ?? "") : generateToolId(),
        partNumber: toolDialogData?.partNumber ?? "",
        toolName: toolDialogData?.toolName ?? "",
        toolDescription: toolDialogData?.toolDescription ?? "",
        supplier: toolDialogData?.supplier ?? "",
    };

    const handleScanResult = (setValue: (field: keyof ToolFormValues, value: any) => void) => (result: any, error: any) => {
        if (result?.text) {
            const scanned = extractQrCodeFromText(result.text);
            if (scanned) {
                setValue("qrCodeId", scanned);
                setIsScanning(false);
            }
        }
        if (error) {
            // eslint-disable-next-line no-console
            console.info(error);
        }
    };

    const customHandleClose = () => {
        setIsScanning(false);
        handleClose();
    };

    const validate = (values: ToolFormValues) => {
        const errors: Partial<Record<keyof ToolFormValues, string>> = {};
        if (!values.qrCodeId) errors.qrCodeId = "Required";
        if (!values.toolId) errors.toolId = "Required";
        if (!values.partNumber) errors.partNumber = "Required";
        if (!values.toolName) errors.toolName = "Required";
        if (!values.supplier) errors.supplier = "Required";
        return errors;
    };

    return (
        <Dialog maxWidth="md" fullWidth open={open} onClose={customHandleClose}>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    {isEditMode ? "Edit" : "Add"} Tool
                </Box>
                <IconButton
                    children={<HighlightOff />}
                    color="inherit"
                    onClick={customHandleClose}
                    sx={{ transform: "translate(8px, -8px)" }}
                />
            </DialogTitle>

            <DialogContent>
                <Form<ToolFormValues>
                    initialValues={initialValues}
                    validate={validate}
                    onSubmit={(values) => onSubmit(values as any)}
                    render={({ handleSubmit, form, submitting, values }) => (
                        <form onSubmit={handleSubmit}>
                            <Box
                                sx={{
                                    my: 3,
                                    mx: 1,
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                                    gap: 3,
                                }}
                            >
                                <Field<string> name="qrCodeId">
                                    {({ input, meta }) => (
                                        <Box>
                                            <Typography className="label">Scanned QR Code</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                disabled={isViewMode || isEditMode}
                                                placeholder="Scan QR Code"
                                                error={meta.touched && !!meta.error}
                                                helperText={meta.touched && meta.error ? meta.error : " "}
                                                InputProps={{
                                                    endAdornment: (
                                                        <>
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onClick={() => setIsScanning((s) => !s)}
                                                                    disabled={isViewMode || isEditMode}
                                                                    title="Scan QR"
                                                                >
                                                                    <QrCodeScannerIcon />
                                                                </IconButton>
                                                            </InputAdornment>
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onClick={() => form.change("qrCodeId", "")}
                                                                    disabled={isViewMode || isEditMode}
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
                                                <Box sx={{ mt: 2 }}>
                                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                                        Scan QR Code to fill Scanned QR Code
                                                    </Typography>
                                                    <QrReader
                                                        onResult={handleScanResult((field, val) => form.change(field, val))}
                                                        constraints={{ facingMode: "environment" }}
                                                        // @ts-ignore
                                                        style={{ width: "100%" }}
                                                    />
                                                    <Button sx={{ mt: 1 }} onClick={() => setIsScanning(false)}>
                                                        Close Scanner
                                                    </Button>
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </Field>

                                <Field<string> name="toolId">
                                    {({ input, meta }) => (
                                        <Box>
                                            <Typography className="label">Tool ID</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                disabled
                                                placeholder="Auto-generated"
                                                error={meta.touched && !!meta.error}
                                                helperText={meta.touched && meta.error ? meta.error : "6-character alphanumeric"}
                                                InputProps={{
                                                    endAdornment: (
                                                        <>
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onClick={() => form.change("toolId", generateToolId())}
                                                                    disabled={isViewMode || isEditMode}
                                                                    title="Generate new Tool ID"
                                                                >
                                                                    <AutorenewIcon />
                                                                </IconButton>
                                                            </InputAdornment>
                                                            <InputAdornment position="end">
                                                                <IconButton
                                                                    onClick={() => form.change("toolId", "")}
                                                                    disabled={isViewMode || isEditMode}
                                                                    title="Clear"
                                                                >
                                                                    <ClearIcon />
                                                                </IconButton>
                                                            </InputAdornment>
                                                        </>
                                                    ),
                                                }}
                                            />
                                        </Box>
                                    )}
                                </Field>

                                <Field<string> name="partNumber">
                                    {({ input, meta }) => (
                                        <Box>
                                            <Typography className="label">Part Number</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                disabled={isViewMode}
                                                placeholder="Enter part number"
                                                error={meta.touched && !!meta.error}
                                                helperText={meta.touched && meta.error ? meta.error : " "}
                                            />
                                        </Box>
                                    )}
                                </Field>

                                <Field<string> name="toolName">
                                    {({ input, meta }) => (
                                        <Box>
                                            <Typography className="label">Tool Name</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                disabled={isViewMode}
                                                placeholder="Enter tool name"
                                                error={meta.touched && !!meta.error}
                                                helperText={meta.touched && meta.error ? meta.error : " "}
                                            />
                                        </Box>
                                    )}
                                </Field>

                                <Field<string> name="supplier">
                                    {({ input, meta }) => (
                                        <Box>
                                            <Typography className="label">Supplier</Typography>
                                            <FormControl fullWidth size="small" error={meta.touched && !!meta.error}>
                                                <Select
                                                    {...input}
                                                    disabled={isViewMode}
                                                    displayEmpty
                                                    renderValue={(selected) => (selected ? (selected as string) : "Select supplier")}
                                                >
                                                    <MenuItem value="">
                                                        <em>Select supplier</em>
                                                    </MenuItem>
                                                    {(supplierDropdown?.options ?? []).map((opt) => (
                                                        <MenuItem key={opt.key} value={opt.key}>
                                                            {opt.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            {meta.touched && meta.error ? (
                                                <Typography variant="caption" color="error">
                                                    {meta.error}
                                                </Typography>
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">
                                                    From Dropdown Master
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </Field>

                                <Grid item xs={12} sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
                                    <Field<string> name="toolDescription">
                                        {({ input }) => (
                                            <Box>
                                                <Typography className="label">Tool Description</Typography>
                                                <TextField
                                                    {...input}
                                                    fullWidth
                                                    size="small"
                                                    disabled={isViewMode}
                                                    placeholder="Enter tool description"
                                                    multiline
                                                    minRows={3}
                                                />
                                            </Box>
                                        )}
                                    </Field>
                                </Grid>
                            </Box>

                            <DialogActions>
                                {!isViewMode && (
                                    <Button
                                        style={{
                                            borderRadius: 15,
                                            backgroundColor: "#9B2735",
                                            fontSize: "13px",
                                        }}
                                        variant="contained"
                                        type="submit"
                                        disabled={submitting}
                                    >
                                        Save
                                    </Button>
                                )}
                            </DialogActions>
                        </form>
                    )}
                />
            </DialogContent>
        </Dialog>
    );
};

export default AddToolDialog;

