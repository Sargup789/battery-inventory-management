import { HighlightOff } from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    Select,
    MenuItem,
    TextField,
} from "@mui/material";
import { Form, Field } from "react-final-form";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from 'next-i18next';
import { DropdownMaster } from "../types";

export interface PersonData {
    id?: string;
    name: string;
    employeeId: string;
    designation: string;
    emailId: string;
    phoneNumber: string;
    immediateBoss: string;
    toolsCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

interface PersonDialogProps {
    open: boolean;
    handleClose: () => void;
    personDialogData: PersonData | {};
    persons: PersonData[];
    onSubmit: (values: PersonData) => void;
}

function normalizeKey(s: string): string {
    return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findDropdown(dropdowns: DropdownMaster[], aliases: string[]) {
    const normalizedAliases = aliases.map(normalizeKey);
    return dropdowns.find((d) => {
        const dn = normalizeKey(d.dropdownName);
        const dl = normalizeKey(d.dropdownLabel);
        return normalizedAliases.includes(dn) || normalizedAliases.includes(dl);
    });
}

function getOptionLabel(
    options: Array<{ key: string; label: string }> | undefined,
    selected: string
): string {
    const match = (options || []).find((opt) => opt.key === selected);
    return match?.label || selected;
}

const AddPersonDialog: React.FC<PersonDialogProps> = ({
    open,
    handleClose,
    personDialogData,
    persons: _persons,
    onSubmit,
}) => {
    const { t } = useTranslation('common');
    const isEditMode = Object.keys(personDialogData).length > 0;
    const [dropdowns, setDropdowns] = useState<DropdownMaster[]>([]);

    const getAllDropdowns = async () => {
        const response = await axios.get(`/api/router?path=api/dropdownmaster`);
        return response.data;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dropdownData = await getAllDropdowns();
                setDropdowns(Array.isArray(dropdownData) ? dropdownData : []);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error("Failed to fetch dropdown master:", error);
            }
        };
        fetchData();
    }, []);

    const designationDropdown = useMemo(
        () =>
            findDropdown(dropdowns, [
                "designation",
                "person designation",
                "designation master",
                "role",
                "title",
            ]),
        [dropdowns]
    );

    const immediateBossDropdown = useMemo(
        () =>
            findDropdown(dropdowns, [
                "immediateBoss",
                "immediate boss",
                "immediate boss master",
            ]),
        [dropdowns]
    );

    const validate = (values: PersonData) => {
        const errors: Partial<Record<keyof PersonData, string>> = {};
        if (!values.name) errors.name = t('common.required');
        if (!values.employeeId) errors.employeeId = t('common.required');
        if (!values.designation) errors.designation = t('common.required');
        if (!values.emailId) {
            errors.emailId = t('common.required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailId)) {
            errors.emailId = t('person.invalidEmail');
        }
        if (!values.phoneNumber) {
            errors.phoneNumber = t('common.required');
        } else if (!/^\d{10}$/.test(values.phoneNumber.replace(/\D/g, ""))) {
            errors.phoneNumber = t('person.mustBe10Digits');
        }
        return errors;
    };

    return (
        <Dialog maxWidth="sm" fullWidth open={open} onClose={handleClose}>
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
                    {isEditMode ? t('common.edit') : t('common.add')} {t('person.person')}
                </Box>
                <IconButton
                    children={<HighlightOff />}
                    color="inherit"
                    onClick={handleClose}
                    sx={{ transform: "translate(8px, -8px)" }}
                />
            </DialogTitle>
            <DialogContent>
                <Form
                    initialValues={{
                        id: (personDialogData as any)?.id ?? undefined,
                        name: (personDialogData as any)?.name ?? "",
                        employeeId: (personDialogData as any)?.employeeId ?? "",
                        designation: (personDialogData as any)?.designation ?? "",
                        emailId: (personDialogData as any)?.emailId ?? "",
                        phoneNumber: (personDialogData as any)?.phoneNumber ?? "",
                        immediateBoss: (personDialogData as any)?.immediateBoss ?? "",
                    }}
                    validate={validate}
                    onSubmit={(values: any) => onSubmit(values as PersonData)}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Box
                                sx={{
                                    my: 3,
                                    mx: 1,
                                    display: "grid",
                                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                    gap: 3,
                                }}
                            >
                                {isEditMode && (
                                    <Field name="id">
                                        {({ input }) => <input type="hidden" {...input} />}
                                    </Field>
                                )}
                                     <Field name="employeeId">
                                    {({ input, meta }) => (
                                        <Box>
                                            <Typography className="label">{t('person.employeeId')}</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder={t('person.enterEmployeeId')}
                                                error={meta.touched && !!meta.error}
                                                helperText={meta.touched && meta.error ? meta.error : " "}
                                            />
                                        </Box>
                                    )}
                                </Field>
                                <Field name="name">
                                    {({ input, meta }) => (
                                        <Box>
                                            <Typography className="label">{t('common.name')}</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder={t('person.enterName')}
                                                error={meta.touched && !!meta.error}
                                                helperText={meta.touched && meta.error ? meta.error : " "}
                                            />
                                        </Box>
                                    )}
                                </Field>
                                <Field name="designation">
                                    {({ input, meta }) => (
                                        <Box>
                                            <Typography className="label">{t('person.designation')}</Typography>
                                            <Select
                                                {...input}
                                                fullWidth
                                                size="small"
                                                displayEmpty
                                                error={meta.touched && !!meta.error}
                                                renderValue={(selected) =>
                                                    selected
                                                        ? getOptionLabel(designationDropdown?.options, selected as string)
                                                        : t('person.selectDesignation')
                                                }
                                            >
                                                <MenuItem value="">
                                                    <em>{t('person.selectDesignation')}</em>
                                                </MenuItem>
                                                {(designationDropdown?.options ?? []).map((opt) => (
                                                    <MenuItem key={opt.key} value={opt.key}>
                                                        {opt.key}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {meta.touched && meta.error && (
                                                <Typography variant="caption" color="error">
                                                    {meta.error}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </Field>

                                <Field name="emailId">
                                    {({ input, meta }) => (
                                        <Box>
                                            <Typography className="label">{t('person.emailId')}</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                type="email"
                                                placeholder={t('person.enterEmail')}
                                                error={meta.touched && !!meta.error}
                                                helperText={meta.touched && meta.error ? meta.error : " "}
                                            />
                                        </Box>
                                    )}
                                </Field>

                                <Field name="phoneNumber">
                                    {({ input, meta }) => (
                                        <Box>
                                            <Typography className="label">{t('person.phoneNumber')}</Typography>
                                            <TextField
                                                {...input}
                                                fullWidth
                                                size="small"
                                                placeholder={t('person.enterPhone')}
                                                error={meta.touched && !!meta.error}
                                                helperText={meta.touched && meta.error ? meta.error : " "}
                                            />
                                        </Box>
                                    )}
                                </Field>

                                <Field name="immediateBoss">
                                    {({ input, meta }) => (
                                        <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
                                            <Typography className="label">{t('person.immediateBoss')}</Typography>
                                            <Select
                                                {...input}
                                                fullWidth
                                                size="small"
                                                displayEmpty
                                                error={meta.touched && !!meta.error}
                                                renderValue={(selected) =>
                                                    selected
                                                        ? getOptionLabel(immediateBossDropdown?.options, selected as string)
                                                        : t('person.selectImmediateBoss')
                                                }
                                            >
                                                <MenuItem value="">
                                                    <em>{t('person.selectImmediateBoss')}</em>
                                                </MenuItem>
                                                {(immediateBossDropdown?.options ?? []).map((opt) => (
                                                    <MenuItem key={opt.key} value={opt.key}>
                                                        {opt.key}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Box>
                                    )}
                                </Field>
                            </Box>
                            <DialogActions>
                                <Button
                                    style={{
                                        borderRadius: 15,
                                        backgroundColor: "#9B2735",
                                        fontSize: "13px",
                                    }}
                                    variant="contained"
                                    type="submit"
                                >
                                    {t('common.save')}
                                </Button>
                            </DialogActions>
                        </form>
                    )}
                />
            </DialogContent>
        </Dialog>
    );
};

export default AddPersonDialog;
