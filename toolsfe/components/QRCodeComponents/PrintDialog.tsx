import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import React from 'react'
import { useTranslation } from 'next-i18next';
import QRCode from 'react-qr-code';

interface PrintDialogProps {
    open: boolean;
    handleClose: () => void;
    code: string;
}

const PrintDialog: React.FC<PrintDialogProps> = ({ open, handleClose, code }) => {
    const { t } = useTranslation('common');
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle className="print-hide">{t('qrPrint.printQrCode')}</DialogTitle>
            <DialogContent>
                <QRCode id={`print-qr-${code}`} value={code} size={512} /> {/* Increase size prop for larger QR code */}
            </DialogContent>
            <DialogActions className="print-hide">
                <Button onClick={handleClose}>{t('common.close')}</Button>
                <Button onClick={() => window.print()}>{t('common.print')}</Button>
            </DialogActions>
        </Dialog>
    );
}

export default PrintDialog