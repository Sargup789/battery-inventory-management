import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField,
  Grid, FormControl, InputLabel, Select, MenuItem, IconButton, Box
} from '@mui/material';
import { HighlightOff } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ZoneData } from '@/pages/index';
import { useQuery } from 'react-query';
import { useTranslation } from 'next-i18next';

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
  const { t } = useTranslation('common');

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({ parentZoneId: parentZoneId || undefined });
    }
  }, [editData, parentZoneId, open]);

  const { data: locationTypes = [] } = useQuery(['dropdown', 'locationType'], async () => {
    const res = await axios.get('/api/router?path=api/dropdownmaster/locationType');
    return res.data?.options || [];
  }, { refetchOnWindowFocus: false });

  const { data: cities = [] } = useQuery(['dropdown', 'city'], async () => {
    const res = await axios.get('/api/router?path=api/dropdownmaster/city');
    return res.data?.options || [];
  }, { refetchOnWindowFocus: false });

  const { data: states = [] } = useQuery(['dropdown', 'state'], async () => {
    const res = await axios.get('/api/router?path=api/dropdownmaster/state');
    return res.data?.options || [];
  }, { refetchOnWindowFocus: false });

  const set = (field: keyof ZoneData, value: any) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await axios.put(`/api/router?path=api/zones/${editData?.id}`, formData);
        toast.success(t('zone.updatedSuccess'));
      } else {
        await axios.post('/api/router?path=api/zones', formData);
        toast.success(t('zone.createdSuccess'));
      }
      onSuccess();
      handleClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || t('equipment.errorOccurred'));
    }
  };

  const topLevelZones = (allZones || []).filter((z) => !z.parentZoneId && z.id !== editData?.id);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isEdit ? t('zone.editZone') : parentZoneId ? t('zone.addSubZone') : t('zone.addZone')}
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
            <TextField label={t('zone.name')} size="small" fullWidth value={formData.name || ''} onChange={(e) => set('name', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label={t('zone.identifier')} size="small" fullWidth value={formData.identifier || ''} onChange={(e) => set('identifier', e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('zone.locationType')}</InputLabel>
              <Select value={formData.locationType || ''} label={t('zone.locationType')} onChange={(e) => set('locationType', e.target.value)}>
                <MenuItem value=""><em>{t('common.none')}</em></MenuItem>
                {locationTypes.map((o: any) => <MenuItem key={o.key} value={o.key}>{o.label || o.key}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('zone.city')}</InputLabel>
              <Select value={formData.city || ''} label={t('zone.city')} onChange={(e) => set('city', e.target.value)}>
                <MenuItem value=""><em>{t('common.none')}</em></MenuItem>
                {cities.map((o: any) => <MenuItem key={o.key} value={o.key}>{o.label || o.key}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('zone.state')}</InputLabel>
              <Select value={formData.state || ''} label={t('zone.state')} onChange={(e) => set('state', e.target.value)}>
                <MenuItem value=""><em>{t('common.none')}</em></MenuItem>
                {states.map((o: any) => <MenuItem key={o.key} value={o.key}>{o.label || o.key}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('zone.parentZone')}</InputLabel>
              <Select value={formData.parentZoneId || ''} label={t('zone.parentZone')} onChange={(e) => set('parentZoneId', e.target.value || null)}>
                <MenuItem value=""><em>{t('zone.noneTopLevel')}</em></MenuItem>
                {topLevelZones.map((z) => <MenuItem key={z.id} value={z.id}>{z.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleSubmit}
          variant="contained"
          style={{ borderRadius: 15, backgroundColor: '#9B2735', fontSize: '13px' }}
        >
          {isEdit ? t('common.update') : t('common.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddZoneDialog;
