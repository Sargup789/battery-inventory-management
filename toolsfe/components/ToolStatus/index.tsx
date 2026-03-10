import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from 'next-i18next';
import { QrReader } from "react-qr-reader";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { toast } from "react-toastify";
import { ToolData } from "@/pages/tools";
import moment from "moment";

const CheckToolStatusForm: React.FC = () => {
  const { t } = useTranslation('common');
  const [qrCode, setQrCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [tool, setTool] = useState<ToolData | null>(null);

  const handleScan = async (result: any) => {
    const scannedCode = result?.text;
    if (!scannedCode) return;
    setQrCode(scannedCode);
    setIsScanning(false);
    try {
      const response = await axios.get(`/api/router?path=api/truck/qrCode/${scannedCode}`);
      setTool(response.data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('toolStatus.fetchError'));
    }
  };

  return (
    <Box p={3} bgcolor="white" boxShadow={2}>
      <Typography variant="h5">{t('toolStatus.checkToolStatus')}</Typography>
      {isScanning ? (
        <div>
          <QrReader
            onResult={handleScan}
            constraints={{ facingMode: "environment" }}
            // @ts-ignore
            style={{ width: "40%", height: "40%" }}
          />
          <Button onClick={() => setIsScanning(false)}>{t('toolStatus.closeScanner')}</Button>
        </div>
      ) : (
        <TextField
          label={t('toolStatus.scanQrCode')}
          value={qrCode}
          margin="normal"
          fullWidth
          InputProps={{
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <Button onClick={() => setIsScanning(true)}>{t('common.scan')}</Button>
                </InputAdornment>
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setQrCode("");
                      setTool(null);
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              </>
            ),
          }}
        />
      )}

      {tool && (
        <Box mt={2} display="flex" flexDirection="column" gap={1}>
          <Typography variant="h6">{t('toolStatus.toolDetails')}</Typography>
          <Typography>{t('toolStatus.qrCodeId')}: {tool.qrCodeId || t('common.na')}</Typography>
          <Typography>{t('tool.toolId')}: {tool.toolId || t('common.na')}</Typography>
          <Typography>{t('tool.partNumber')}: {tool.partNumber || t('common.na')}</Typography>
          <Typography>{t('tool.toolName')}: {tool.toolName || t('common.na')}</Typography>
          <Typography>{t('tool.toolDescription')}: {tool.toolDescription || t('common.na')}</Typography>
          <Typography>{t('tool.supplier')}: {tool.supplier || t('common.na')}</Typography>
          <Typography>{t('common.status')}: {tool.status || t('common.na')}</Typography>
          <Typography>{t('tool.assignedPerson')}: {(tool as any).assignedPerson || t('common.na')}</Typography>
          <Typography>
            {t('tool.personDesignation')}: {(tool as any).assignedPersonDesignation || t('common.na')}
          </Typography>
          <Typography>{t('tool.personEmail')}: {(tool as any).assignedPersonEmail || t('common.na')}</Typography>
          <Typography>
            {t('tool.personPhone')}: {(tool as any).assignedPersonPhoneNumber || t('common.na')}
          </Typography>
          <Typography>{t('tool.assignedLocation')}: {(tool as any).assignedLocation || t('common.na')}</Typography>
          <Typography>
            {t('tool.locationType')}: {(tool as any).assignedLocationType || t('common.na')}
          </Typography>
          <Typography>
            {t('tool.locationCity')}: {(tool as any).assignedLocationCity || t('common.na')}
          </Typography>
          <Typography>
            {t('tool.locationState')}: {(tool as any).assignedLocationState || t('common.na')}
          </Typography>
          <Typography>
            {t('toolStatus.createdAt')}:{" "}
            {tool.createdAt ? moment(tool.createdAt).format("MMM DD, YYYY HH:mm") : t('common.na')}
          </Typography>
          <Typography>
            {t('toolStatus.updatedAt')}:{" "}
            {tool.updatedAt ? moment(tool.updatedAt).format("MMM DD, YYYY HH:mm") : t('common.na')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CheckToolStatusForm;
