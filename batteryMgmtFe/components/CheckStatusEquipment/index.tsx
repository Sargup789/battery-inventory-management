import React, { useState } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';
import {
  Box, Typography, TextField, InputAdornment, Button, IconButton, Chip, Divider, Paper
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useTranslation } from 'next-i18next';

const CheckStatusEquipment: React.FC = () => {
  const [qrCode, setQrCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const { t } = useTranslation('common');

  const handleScan = async (scanResult: any) => {
    const scannedCode = scanResult?.text;
    if (!scannedCode) return;
    setQrCode(scannedCode);
    setIsScanning(false);
    try {
      const response = await axios.get(`/api/router?path=api/power-equipment/status/${encodeURIComponent(scannedCode)}`);
      setResult(response.data);
    } catch (error: any) {
      setResult(null);
      toast.error(error?.response?.data?.error || t('checkstatus.notFound'));
    }
  };

  const handleClear = () => {
    setQrCode('');
    setResult(null);
  };

  const eq = result?.equipment;
  const events = result?.events || [];

  const getStatusColor = (status: string) => {
    if (status === 'created') return 'default';
    if (status === 'checked-in') return 'success';
    return 'warning';
  };

  return (
    <Box p={3} bgcolor="white" boxShadow={2}>
      <Typography variant="h5">{t('checkstatus.title')}</Typography>
      {isScanning ? (
        <div>
          <QrReader
            onResult={handleScan}
            constraints={{ facingMode: 'environment' }}
            // @ts-ignore
            style={{ width: '40%', height: '40%' }}
          />
          <Button onClick={() => setIsScanning(false)}>{t('common.closeScanner')}</Button>
        </div>
      ) : (
        <TextField
          label={t('checkstatus.scanQrCode')}
          value={qrCode}
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
                  <IconButton onClick={handleClear}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              </>
            ),
          }}
        />
      )}

      {eq && (
        <Box mt={2} display="flex" flexDirection="column" gap={1}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6">{t('checkstatus.equipmentDetails')}</Typography>
            <Chip label={eq.status} color={getStatusColor(eq.status) as any} />
          </Box>

          <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography>{t('checkstatus.qrCode')}: {eq.qrCodeId || t('common.na')}</Typography>
            <Typography>{t('equipment.equipmentId')}: {eq.equipmentId || t('common.na')}</Typography>
            <Typography>{t('equipment.itemType')}: {eq.itemType || t('common.na')}</Typography>
            <Typography>{t('equipment.manufacturer')}: {eq.manufacturer || t('common.na')}</Typography>
            <Typography>{t('equipment.modelNumber')}: {eq.modelNumber || t('common.na')}</Typography>
            <Typography>{t('equipment.serialNumber')}: {eq.serialNumber || t('common.na')}</Typography>
            <Typography>{t('equipment.voltage')}: {eq.voltage || t('common.na')}</Typography>
            <Typography>{t('equipment.ampHours')}: {eq.ampHours || t('common.na')}</Typography>
            <Typography>{t('equipment.powerEquipmentStatus')}: {eq.powerEquipmentStatus || t('common.na')}</Typography>
            <Typography>{t('equipment.assignationType')}: {eq.assignationType || t('common.na')}</Typography>
            <Typography>{t('equipment.assignedTo')}: {eq.assignedTo || t('common.na')}</Typography>
            <Typography>{t('equipment.customerName')}: {eq.customerName || t('common.na')}</Typography>
            <Typography>{t('equipment.orderEntryNumber')}: {eq.orderEntryNumber || t('common.na')}</Typography>
            <Divider sx={{ my: 1 }} />
            {eq.status === 'checked-in' && (
              <>
                <Typography>{t('equipment.zone')}: {eq.zoneName || t('common.na')}</Typography>
                <Typography>{t('equipment.locationType')}: {eq.zoneLocationType || t('common.na')}</Typography>
                <Typography>{t('equipment.zoneCity')}: {eq.zoneCity || t('common.na')}</Typography>
                <Typography>{t('equipment.zoneState')}: {eq.zoneState || t('common.na')}</Typography>
                <Typography>{t('equipment.location')}: {eq.location || t('common.na')}</Typography>
              </>
            )}
            {eq.checkoutReason && (
              <Typography>{t('equipment.checkoutReason')}: {eq.checkoutReason}</Typography>
            )}
            <Divider sx={{ my: 1 }} />
            <Typography>{t('checkstatus.created')}: {eq.createdAt ? moment(eq.createdAt).format('MMM DD, YYYY HH:mm') : t('common.na')}</Typography>
            <Typography>{t('checkstatus.updated')}: {eq.updatedAt ? moment(eq.updatedAt).format('MMM DD, YYYY HH:mm') : t('common.na')}</Typography>
          </Paper>

          {events.length > 0 && (
            <Box>
              <Typography variant="h6" fontWeight={700} mb={1}>{t('checkstatus.eventHistory')}</Typography>
              {events.map((event: any, idx: number) => (
                <Paper key={idx} variant="outlined" sx={{ p: 1.5, mb: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip label={event.eventType} size="small" />
                    <Typography variant="caption" color="text.secondary">
                      {moment(event.createdAt).format('MMM DD, YYYY HH:mm')}
                    </Typography>
                  </Box>
                  {event.zoneName && <Typography variant="body2">{t('equipment.zone')}: {event.zoneName}</Typography>}
                  {event.location && <Typography variant="body2">{t('equipment.location')}: {event.location}</Typography>}
                  {event.checkoutReason && <Typography variant="body2">{t('checkstatus.reason')}: {event.checkoutReason}</Typography>}
                  {event.performedBy && <Typography variant="body2">{t('checkstatus.by')}: {event.performedBy}</Typography>}
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CheckStatusEquipment;
