import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import React from 'react';
import QRCode from 'react-qr-code';
import { useTranslation } from 'next-i18next';

interface PrintDialogProps {
  open: boolean;
  handleClose: () => void;
  code: string;
}

const PrintDialog: React.FC<PrintDialogProps> = ({ open, handleClose, code }) => {
  const { t } = useTranslation('common');

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className="print-hide">{t('qr.printQrCode')}</DialogTitle>
      <DialogContent>
        <QRCode id={`print-qr-${code}`} value={code} size={512} />
      </DialogContent>
      <DialogActions className="print-hide">
        <Button onClick={handleClose}>{t('qr.close')}</Button>
        <Button onClick={() => window.print()}>{t('qr.print')}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default PrintDialog;
