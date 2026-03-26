import { ZoneData } from "@/pages/location";
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
} from "@mui/material";
import { Form, Field } from "react-final-form";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from 'next-i18next';
import { DropdownMaster } from "../types";

interface ZoneDialogProps {
  open: boolean;
  handleClose: () => void;
  locationDialogData: ZoneData | {};
  parentZones: ZoneData[];
  onSubmit: (values: ZoneData) => void;
}

type LocationFormValues = {
  id?: string;
  name: string;
  type: string;
  city: string;
  state: string;
};

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

const AddLocationDialog: React.FC<ZoneDialogProps> = ({
  open,
  handleClose,
  locationDialogData,
  parentZones: _parentZones,
  onSubmit,
}) => {
  const { t } = useTranslation('common');
  const isEditMode = Object.keys(locationDialogData).length > 0;
  const [dropdowns, setDropdowns] = useState<DropdownMaster[]>([]);

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

  const locationNameDropdown = useMemo(
    () =>
      findDropdown(dropdowns, [
        "location name",
        "locationname",
        "location",
        "name",
      ]),
    [dropdowns]
  );
  const locationTypeDropdown = useMemo(
    () =>
      findDropdown(dropdowns, [
        "location type",
        "locationtype",
        "type",
      ]),
    [dropdowns]
  );
  const cityDropdown = useMemo(
    () => findDropdown(dropdowns, ["city", "location city"]),
    [dropdowns]
  );
  const stateDropdown = useMemo(
    () => findDropdown(dropdowns, ["state", "location state"]),
    [dropdowns]
  );

  const getDefaultPayload = (values: LocationFormValues) => {
    // Keep backend compatibility (existing API still expects ZoneData-like shape),
    // while only exposing Name/Type/City/State fields in the UI.
    const existing = locationDialogData as Partial<ZoneData>;
    return {
      ...(existing || {}),
      ...values,
      description: existing.description ?? "",
      maxCapacity: existing.maxCapacity ?? "",
      occupiedLocations: existing.occupiedLocations ?? [],
      isActive: existing.isActive ?? true,
      isFinalZone: existing.isFinalZone ?? false,
      locationPrefix: existing.locationPrefix ?? "",
      isParentZone: existing.isParentZone ?? false,
      isSubZone: existing.isSubZone ?? false,
      parentZoneId: existing.parentZoneId ?? null,
      isRetailReady: (existing as any).isRetailReady ?? false,
      subZones: existing.subZones ?? null,
    } as ZoneData;
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
          {isEditMode ? t('common.edit') : t('common.add')} {t('location.location')}
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
            id: (locationDialogData as any)?.id ?? undefined,
            name: (locationDialogData as any)?.name ?? "",
            type: (locationDialogData as any)?.type ?? "",
            city: (locationDialogData as any)?.city ?? "",
            state: (locationDialogData as any)?.state ?? "",
          }}
          validate={(values: LocationFormValues) => {
            const errors: Partial<Record<keyof LocationFormValues, string>> = {};
            if (!values.name) errors.name = t('common.required');
            if (!values.type) errors.type = t('common.required');
            if (!values.city) errors.city = t('common.required');
            if (!values.state) errors.state = t('common.required');
            return errors;
          }}
          onSubmit={(values: any) => onSubmit(getDefaultPayload(values as LocationFormValues))}
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
                    {({ input }) => (
                      <input type="hidden" {...input} />
                    )}
                  </Field>
                )}
                <Field name="name">
                  {({ input, meta }) => (
                    <Box>
                      <Typography className="label">{t('common.name')}</Typography>
                      <Select
                        {...input}
                        fullWidth
                        size="small"
                        displayEmpty
                        error={meta.touched && !!meta.error}
                        renderValue={(selected) =>
                          selected
                            ? String(selected)
                            : t('location.selectName')
                        }
                      >
                        <MenuItem value="">
                          <em>{t('location.selectName')}</em>
                        </MenuItem>
                        {(locationNameDropdown?.options ?? []).map((opt) => (
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

                <Field name="type">
                  {({ input, meta }) => (
                    <Box>
                      <Typography className="label">{t('common.type')}</Typography>
                      <Select
                        {...input}
                        fullWidth
                        size="small"
                        displayEmpty
                        error={meta.touched && !!meta.error}
                        renderValue={(selected) =>
                          selected
                            ? getOptionLabel(locationTypeDropdown?.options, selected as string)
                            : t('location.selectType')
                        }
                      >
                        <MenuItem value="">
                          <em>{t('location.selectType')}</em>
                        </MenuItem>
                        {(locationTypeDropdown?.options ?? []).map((opt) => (
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

                <Field name="city">
                  {({ input, meta }) => (
                    <Box>
                      <Typography className="label">{t('common.city')}</Typography>
                      <Select
                        {...input}
                        fullWidth
                        size="small"
                        displayEmpty
                        error={meta.touched && !!meta.error}
                        renderValue={(selected) =>
                          selected
                            ? getOptionLabel(cityDropdown?.options, selected as string)
                            : t('location.selectCity')
                        }
                      >
                        <MenuItem value="">
                          <em>{t('location.selectCity')}</em>
                        </MenuItem>
                        {(cityDropdown?.options ?? []).map((opt) => (
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

                <Field name="state">
                  {({ input, meta }) => (
                    <Box>
                      <Typography className="label">{t('common.state')}</Typography>
                      <Select
                        {...input}
                        fullWidth
                        size="small"
                        displayEmpty
                        error={meta.touched && !!meta.error}
                        renderValue={(selected) =>
                          selected
                            ? getOptionLabel(stateDropdown?.options, selected as string)
                            : t('location.selectState')
                        }
                      >
                        <MenuItem value="">
                          <em>{t('location.selectState')}</em>
                        </MenuItem>
                        {(stateDropdown?.options ?? []).map((opt) => (
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
              </Box>
              <DialogActions>
                <Button
                  style={{
                    borderRadius: 15,
                    backgroundColor: "#9B2735",
                    fontSize: "13px"
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

export default AddLocationDialog;
