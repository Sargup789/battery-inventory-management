import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import React from 'react'
import QRCode from 'react-qr-code';

interface PrintDialogProps {
    open: boolean;
    handleClose: () => void;
    code: string;
}

const PrintDialog: React.FC<PrintDialogProps> = ({ open, handleClose, code }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle className="print-hide">Print QR Code</DialogTitle>
            <DialogContent>
                <QRCode id={`print-qr-${code}`} value={code} size={512} /> {/* Increase size prop for larger QR code */}
            </DialogContent>
            <DialogActions className="print-hide">
                <Button onClick={handleClose}>Close</Button>
                <Button onClick={() => window.print()}>Print</Button>
            </DialogActions>
        </Dialog>
    );
}

export default PrintDialog