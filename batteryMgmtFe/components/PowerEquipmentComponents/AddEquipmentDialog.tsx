import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Grid, FormControl, InputLabel, Select, MenuItem, Typography, IconButton, Box, InputAdornment
} from '@mui/material';
import { HighlightOff } from '@mui/icons-material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import { toast } from 'react-toastify';
import { EquipmentData } from '@/pages/power-equipment';
import { useQuery } from 'react-query';
import { QrReader } from 'react-qr-reader';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation('common');

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
    const text = typeof result?.getText === 'function' ? result.getText() : result?.text;
    if (text) {
      set('qrCodeId', text.trim());
      setIsScanning(false);
    }
  };

  const { data: itemTypes = [] } = useQuery(['dropdown', 'itemType'], async () => {
    const res = await axios.get('/api/router?path=api/dropdownmaster/itemType');
    return res.data?.options || [];
  }, { refetchOnWindowFocus: false });
  const { data: manufacturers = [] } = useQuery(['dropdown', 'manufacturer'], async () => {
    const res = await axios.get('/api/router?path=api/dropdownmaster/manufacturer');
    return res.data?.options || [];
  }, { refetchOnWindowFocus: false });
  const { data: statuses = [] } = useQuery(['dropdown', 'powerEquipmentStatus'], async () => {
    const res = await axios.get('/api/router?path=api/dropdownmaster/powerEquipmentStatus');
    return res.data?.options || [];
  }, { refetchOnWindowFocus: false });
  const { data: assignationTypes = [] } = useQuery(['dropdown', 'assignationType'], async () => {
    const res = await axios.get('/api/router?path=api/dropdownmaster/assignationType');
    return res.data?.options || [];
  }, { refetchOnWindowFocus: false });
  const { data: inboundDocTypes = [] } = useQuery(['dropdown', 'inboundDocumentType'], async () => {
    const res = await axios.get('/api/router?path=api/dropdownmaster/inboundDocumentType');
    return res.data?.options || [];
  }, { refetchOnWindowFocus: false });
  const { data: outboundDocTypes = [] } = useQuery(['dropdown', 'outboundDocumentType'], async () => {
    const res = await axios.get('/api/router?path=api/dropdownmaster/outboundDocumentType');
    return res.data?.options || [];
  }, { refetchOnWindowFocus: false });

  const set = (field: keyof EquipmentData, value: any) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    try {
      const payload = { ...formData, dateOfArrival: dateOfArrival || undefined };
      if (isEdit) {
        await axios.put(`/api/router?path=api/power-equipment/${editData?.id}`, payload);
        toast.success(t('equipment.updatedSuccess'));
      } else {
        await axios.post('/api/router?path=api/power-equipment', payload);
        toast.success(t('equipment.createdSuccess'));
      }
      onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || t('equipment.errorOccurred'));
    }
  };

  const dropdownField = (label: string, field: keyof EquipmentData, options: any[]) => (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select value={(formData[field] as string) || ''} label={label} onChange={(e) => set(field, e.target.value)}>
        <MenuItem value=""><em>{t('common.none')}</em></MenuItem>
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
      value={(formData[field] as string) || ''}
      onChange={(e) => set(field, e.target.value)}
    />
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isEdit ? t('equipment.editPowerEquipment') : t('equipment.addPowerEquipment')}
        </Box>
        <IconButton
          children={<HighlightOff />}
          color="inherit"
          onClick={handleClose}
          sx={{ transform: 'translate(8px, -8px)' }}
        />
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label={t('equipment.qrCode')}
              size="small"
              fullWidth
              value={(formData.qrCodeId as string) || ''}
              onChange={(e) => set('qrCodeId', e.target.value)}
              disabled={isEdit}
              placeholder={t('equipment.scanOrEnterQr')}
              InputProps={{
                endAdornment: (
                  <>
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setIsScanning((s) => !s)}
                        disabled={isEdit}
                        title={t('equipment.scanQr')}
                      >
                        <QrCodeScannerIcon />
                      </IconButton>
                    </InputAdornment>
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => set('qrCodeId', '')}
                        disabled={isEdit}
                        title={t('common.clear')}
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
                  constraints={{ facingMode: 'environment' }}
                  containerStyle={{ width: '100%' }}
                />
                <Button size="small" sx={{ mt: 1 }} onClick={() => setIsScanning(false)}>
                  {t('common.closeScanner')}
                </Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>{dropdownField(t('equipment.itemType'), 'itemType', itemTypes)}</Grid>
          <Grid item xs={12} sm={6}>{dropdownField(t('equipment.manufacturer'), 'manufacturer', manufacturers)}</Grid>
          <Grid item xs={12} sm={6}>{textField(t('equipment.modelNumber'), 'modelNumber')}</Grid>
          <Grid item xs={12} sm={6}>{textField(t('equipment.serialNumber'), 'serialNumber')}</Grid>
          <Grid item xs={12} sm={6}>{textField(t('equipment.voltage'), 'voltage')}</Grid>
          <Grid item xs={12} sm={6}>{textField(t('equipment.ampHours'), 'ampHours')}</Grid>
          <Grid item xs={12} sm={6}>{dropdownField(t('equipment.powerEquipmentStatus'), 'powerEquipmentStatus', statuses)}</Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">{t('equipment.dateOfArrival')}</Typography>
            <br />
            <ReactDatePicker
              selected={dateOfArrival}
              onChange={(date) => setDateOfArrival(date)}
              dateFormat="MMM dd, yyyy"
              placeholderText={t('equipment.selectDate')}
              customInput={<TextField size="small" fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={6}>{dropdownField(t('equipment.assignationType'), 'assignationType', assignationTypes)}</Grid>
          <Grid item xs={12} sm={6}>{textField(t('equipment.assignedTo'), 'assignedTo')}</Grid>
          <Grid item xs={12} sm={6}>{textField(t('equipment.truckModelNumber'), 'truckModelNumber')}</Grid>
          <Grid item xs={12} sm={6}>{textField(t('equipment.truckSerialNumber'), 'truckSerialNumber')}</Grid>
          <Grid item xs={12} sm={6}>{dropdownField(t('equipment.inboundDocumentType'), 'inboundDocumentType', inboundDocTypes)}</Grid>
          <Grid item xs={12} sm={6}>{textField(t('equipment.inboundDocumentNumber'), 'inboundDocumentNumber')}</Grid>
          <Grid item xs={12} sm={6}>{textField(t('equipment.orderEntryNumber'), 'orderEntryNumber')}</Grid>
          <Grid item xs={12} sm={6}>{dropdownField(t('equipment.outboundDocumentType'), 'outboundDocumentType', outboundDocTypes)}</Grid>
          <Grid item xs={12} sm={6}>{textField(t('equipment.outboundDocumentNumber'), 'outboundDocumentNumber')}</Grid>
          <Grid item xs={12} sm={6}>{textField(t('equipment.customerName'), 'customerName')}</Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" style={{ borderRadius: 15, backgroundColor: '#9B2735', fontSize: '13px' }}>
          {isEdit ? t('common.update') : t('common.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEquipmentDialog;
