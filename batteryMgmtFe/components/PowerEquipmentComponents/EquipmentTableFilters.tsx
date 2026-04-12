import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { EquipmentFilters } from '@/pages/power-equipment';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useTranslation } from 'next-i18next';

type Props = {
  filters: EquipmentFilters;
  onFiltersChange: (filters: EquipmentFilters) => void;
};

const EquipmentTableFilters = ({ filters, onFiltersChange }: Props) => {
  const [local, setLocal] = useState<EquipmentFilters>(filters);
  const { t } = useTranslation('common');

  const { data: filterOptions } = useQuery('equipmentFilterOptions', async () => {
    const res = await axios.get('/api/router?path=api/power-equipment/filters');
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
        label={t('common.search')}
        size="small"
        value={local.search || ''}
        onChange={(e) => setLocal({ ...local, search: e.target.value })}
        sx={{ minWidth: 200 }}
      />
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>{t('equipment.status')}</InputLabel>
        <Select
          value={local.status || ''}
          label={t('equipment.status')}
          onChange={(e) => setLocal({ ...local, status: e.target.value })}
        >
          <MenuItem value="">{t('common.all')}</MenuItem>
          {(filterOptions?.statuses || []).map((s: string) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>{t('equipment.itemType')}</InputLabel>
        <Select
          value={local.itemType || ''}
          label={t('equipment.itemType')}
          onChange={(e) => setLocal({ ...local, itemType: e.target.value })}
        >
          <MenuItem value="">{t('common.all')}</MenuItem>
          {(filterOptions?.itemTypes || []).map((x: string) => (
            <MenuItem key={x} value={x}>{x}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>{t('equipment.manufacturer')}</InputLabel>
        <Select
          value={local.manufacturer || ''}
          label={t('equipment.manufacturer')}
          onChange={(e) => setLocal({ ...local, manufacturer: e.target.value })}
        >
          <MenuItem value="">{t('common.all')}</MenuItem>
          {(filterOptions?.manufacturers || []).map((m: string) => (
            <MenuItem key={m} value={m}>{m}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleApply} style={{ backgroundColor: '#9B2735' }}>{t('common.apply')}</Button>
      <Button variant="outlined" onClick={handleClear}>{t('common.clear')}</Button>
    </Box>
  );
};

export default EquipmentTableFilters;
