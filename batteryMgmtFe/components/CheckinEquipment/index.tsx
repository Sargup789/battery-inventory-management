import React, { useState } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';
import {
  TextField, Button, Box, Typography, IconButton, InputAdornment,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { toast } from 'react-toastify';
import ClearIcon from '@mui/icons-material/Clear';
import moment from 'moment';
import { useQuery } from 'react-query';
import { ZoneData } from '@/pages/index';
import { useTranslation } from 'next-i18next';

const CheckinEquipment: React.FC = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [equipmentDetails, setEquipmentDetails] = useState<any | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [location, setLocation] = useState('');
  const { t } = useTranslation('common');

  const { data: zones = [] } = useQuery('allZones', async () => {
    const res = await axios.get('/api/router?path=api/zones', { params: { size: 200 } });
    const raw = res.data;
    const rows = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
    return rows.map((z: any) => ({
      id: z?.id || z?._id?.$oid || z?._id?.toString?.() || '',
      name: z?.name || '',
    })) as ZoneData[];
  }, { refetchOnWindowFocus: false });

  const handleScan = async (result: any) => {
    const scannedCode = result?.text;
    if (!scannedCode) return;
    setQrCode(scannedCode);
    setIsScanning(false);
    try {
      const response = await axios.get(`/api/router?path=api/power-equipment/qr-code/${scannedCode}`);
      setEquipmentDetails(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.error || t('checkstatus.notFound'));
    }
  };

  const handleCheckin = async () => {
    if (!equipmentDetails?.equipmentId) {
      toast.error(t('checkin.noEquipmentSelected'));
      return;
    }
    if (!selectedZoneId) {
      toast.error(t('checkin.selectZone'));
      return;
    }
    try {
      await axios.post('/api/router?path=api/power-equipment/check-in', {
        equipmentId: equipmentDetails.equipmentId,
        zoneId: selectedZoneId,
        location: location || undefined,
      });
      toast.success(t('checkin.success'));
      setEquipmentDetails(null);
      setQrCode(null);
      setSelectedZoneId('');
      setLocation('');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || t('checkin.failed'));
    }
  };

  const handleClear = () => {
    setQrCode(null);
    setEquipmentDetails(null);
    setSelectedZoneId('');
    setLocation('');
  };

  const Row = ({ label, value }: { label: string; value: any }) => (
    <Typography variant="body1">{label}: {value || '—'}</Typography>
  );

  return (
    <Box p={3} bgcolor="white" boxShadow={2} borderRadius={2}>
      <Typography variant="h5" fontWeight={700} mb={2}>{t('checkin.title')}</Typography>

      {isScanning ? (
        <Box>
          <div style={{ width: '40%' }}>
            <QrReader onResult={handleScan} constraints={{ facingMode: 'environment' }} />
          </div>
          <Button onClick={() => setIsScanning(false)}>{t('common.closeScanner')}</Button>
        </Box>
      ) : (
        <TextField
          label={t('checkin.scanQrCode')}
          value={qrCode || ''}
          margin="normal"
          fullWidth
          onChange={(e) => setQrCode(e.target.value)}
          InputProps={{
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <Button onClick={() => setIsScanning(true)}>{t('common.scan')}</Button>
                </InputAdornment>
                <InputAdornment position="end">
                  <IconButton onClick={handleClear}><ClearIcon /></IconButton>
                </InputAdornment>
              </>
            ),
          }}
        />
      )}

      {equipmentDetails && (
        <Box mt={2}>
          <Typography variant="h6" fontWeight={700} mb={1}>{t('checkin.equipmentDetails')}</Typography>
          <Row label={t('equipment.equipmentId')} value={equipmentDetails.equipmentId} />
          <Row label={t('equipment.itemType')} value={equipmentDetails.itemType} />
          <Row label={t('equipment.manufacturer')} value={equipmentDetails.manufacturer} />
          <Row label={t('equipment.modelNumber')} value={equipmentDetails.modelNumber} />
          <Row label={t('equipment.serialNumber')} value={equipmentDetails.serialNumber} />
          <Row label={t('equipment.voltage')} value={equipmentDetails.voltage} />
          <Row label={t('equipment.ampHours')} value={equipmentDetails.ampHours} />
          <Row label={t('equipment.status')} value={equipmentDetails.status} />
          <Row label={t('equipment.equipmentStatus')} value={equipmentDetails.powerEquipmentStatus} />
          <Row label={t('equipment.dateOfArrival')} value={equipmentDetails.dateOfArrival ? moment(equipmentDetails.dateOfArrival).format('MMM DD, YYYY') : '—'} />
          <Row label={t('equipment.assignationType')} value={equipmentDetails.assignationType} />
          <Row label={t('equipment.assignedTo')} value={equipmentDetails.assignedTo} />
          <Row label={t('equipment.truckModelNumber')} value={equipmentDetails.truckModelNumber} />
          <Row label={t('equipment.truckSerialNumber')} value={equipmentDetails.truckSerialNumber} />
          <Row label={t('equipment.checkoutReason')} value={equipmentDetails.checkoutReason} />
          <Row label={t('equipment.inboundDocType')} value={equipmentDetails.inboundDocumentType} />
          <Row label={t('equipment.inboundDocNumber')} value={equipmentDetails.inboundDocumentNumber} />
          <Row label={t('equipment.orderEntryNumber')} value={equipmentDetails.orderEntryNumber} />
          <Row label={t('equipment.outboundDocType')} value={equipmentDetails.outboundDocumentType} />
          <Row label={t('equipment.outboundDocNumber')} value={equipmentDetails.outboundDocumentNumber} />
          <Row label={t('equipment.customerName')} value={equipmentDetails.customerName} />
          <Row label={t('equipment.zone')} value={equipmentDetails.zoneName} />
          <Row label={t('equipment.zoneLocationType')} value={equipmentDetails.zoneLocationType} />
          <Row label={t('equipment.zoneCity')} value={equipmentDetails.zoneCity} />
          <Row label={t('equipment.zoneState')} value={equipmentDetails.zoneState} />
          <Row label={t('equipment.location')} value={equipmentDetails.location} />
          <Row label={t('equipment.lastUpdatedBy')} value={equipmentDetails.lastUpdatedBy} />

          <FormControl fullWidth margin="normal">
            <InputLabel>{t('checkin.zoneLabel')}</InputLabel>
            <Select
              value={selectedZoneId}
              label={t('checkin.zoneLabel')}
              onChange={(e) => setSelectedZoneId(e.target.value)}
            >
              <MenuItem value=""><em>{t('checkin.zonePlaceholder')}</em></MenuItem>
              {zones.map((zone: any) => (
                <MenuItem key={zone.id} value={zone.id}>{zone.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label={t('checkin.locationOptional')}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            margin="normal"
            placeholder={t('checkin.locationPlaceholder')}
          />

          <Button
            variant="contained"
            style={{ marginTop: '15px', borderRadius: 15, backgroundColor: '#9B2735', fontSize: '13px' }}
            onClick={handleCheckin}
          >
            {t('checkin.title')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CheckinEquipment;
