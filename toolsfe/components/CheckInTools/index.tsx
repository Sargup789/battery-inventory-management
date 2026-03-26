import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from 'next-i18next';
import { QrReader } from "react-qr-reader";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import { ToolData } from "@/pages/tools";
import { PersonData } from "../Persons/AddPersonDialog";
import ClearIcon from "@mui/icons-material/Clear";
import moment from "moment";

const CheckinForm: React.FC = () => {
  const { t } = useTranslation('common');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [toolDetails, setToolDetails] = useState<ToolData | null>(null);
  const [persons, setPersons] = useState<PersonData[]>([]);
  const [selectedPersonId, setSelectedPersonId] = useState("");

  React.useEffect(() => {
    axios
      .get("/api/router?path=api/persons")
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        setPersons(
          rows.map((person: any) => ({
            id:
              person?.id ||
              person?._id?.$oid ||
              person?._id?.toString?.() ||
              "",
            name: person?.name || "",
            employeeId: person?.employeeId || "",
            designation: person?.designation || "",
            emailId: person?.emailId || person?.email || "",
            phoneNumber: person?.phoneNumber || "",
            immediateBoss: person?.immediateBoss || "",
          }))
        );
      })
      .catch(() => toast.error(t('checkin.fetchPersonError')));
  }, []);

  const handleScan = async (result: any) => {
    const scannedCode = result?.text;
    if (!scannedCode) return;
    setQrCode(scannedCode);
    setIsScanning(false);

    try {
      const response = await axios.get(`/api/router?path=api/truck/qrCode/${scannedCode}`);
      setToolDetails(response.data);
      setSelectedPersonId(response.data?.assignedPersonId || "");
    } catch (error: any) {
      const errmsg = error?.response?.data?.message;
      toast.error(errmsg || t('checkin.fetchToolError'));
    }
  };

  const handleSubmit = async () => {
    if (!toolDetails?.id) {
      toast.error(t('checkin.toolNotFound'));
      return;
    }
    if (!selectedPersonId) {
      toast.error(t('checkin.selectPersonError'));
      return;
    }

    try {
      await axios.post(`/api/router?path=api/tools/check-in`, {
        toolId: toolDetails.id,
        personId: selectedPersonId,
      });
      toast.success(t('checkin.checkinSuccess'));
      setToolDetails(null);
      setQrCode(null);
      setSelectedPersonId("");
    } catch (error: any) {
      const errmsg = error?.response?.data?.message;
      toast.error(errmsg || t('checkin.somethingWrong'));
    }
  };

  return (
    <Box p={3} bgcolor="white" boxShadow={2}>
      <Typography variant="h5">{t('checkin.checkinTool')}</Typography>
      {isScanning ? (
        <div>
          <QrReader
            onResult={handleScan}
            constraints={{ facingMode: "environment" }}
            // @ts-ignore
            style={{ width: "40%", height: "40%" }}
          />
          <Button onClick={() => setIsScanning(false)}>{t('checkin.closeScanner')}</Button>
        </div>
      ) : (
        <TextField
          label={t('checkin.scanQrCode')}
          value={qrCode || ""}
          margin="normal"
          InputProps={{
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <Button onClick={() => setIsScanning(true)}>{t('common.scan')}</Button>
                </InputAdornment>
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setQrCode(null);
                      setToolDetails(null);
                      setSelectedPersonId("");
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              </>
            ),
          }}
          fullWidth
        />
      )}

      {toolDetails && (
        <Box mt={2} display="flex" flexDirection="column">
          <Typography variant="h4">{t('checkin.toolDetails')}</Typography>
          <br />
          <Typography variant="body1">{t('checkin.qrCodeId')}: {toolDetails.qrCodeId}</Typography>
          <Typography variant="body1">{t('tool.toolId')}: {toolDetails.toolId}</Typography>
          <Typography variant="body1">{t('tool.partNumber')}: {toolDetails.partNumber}</Typography>
          <Typography variant="body1">{t('tool.toolName')}: {toolDetails.toolName}</Typography>
          <Typography variant="body1">{t('checkin.description')}: {toolDetails.toolDescription}</Typography>
          <Typography variant="body1">{t('tool.supplier')}: {toolDetails.supplier}</Typography>
          <Typography variant="body1">{t('common.status')}: {toolDetails.status}</Typography>
          <Typography variant="body1">
            {t('tool.assignedPerson')}: {toolDetails.assignedPerson || t('common.na')}
          </Typography>
          <Typography variant="body1">
            {t('tool.assignedLocation')}: {toolDetails.assignedLocation || t('common.na')}
          </Typography>
          <Typography variant="body1">
            {t('checkin.createdAt')}:{" "}
            {toolDetails.createdAt
              ? moment(toolDetails.createdAt).format("MMM DD, YYYY")
              : t('common.na')}
          </Typography>
          <Typography variant="body1">
            {t('checkin.updatedAt')}:{" "}
            {toolDetails.updatedAt
              ? moment(toolDetails.updatedAt).format("MMM DD, YYYY")
              : t('common.na')}
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel id="checkin-person-label">{t('checkin.selectPerson')}</InputLabel>
            <Select
              labelId="checkin-person-label"
              label={t('checkin.selectPerson')}
              value={selectedPersonId}
              onChange={(e) => setSelectedPersonId(e.target.value as string)}
            >
              {persons.map((person) => (
                <MenuItem key={person.id} value={person.id}>
                  {person.name} ({person.designation})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="button"
            variant="contained"
            color="primary"
            style={{ marginTop: "15px" }}
            onClick={handleSubmit}
          >
            {t('checkin.checkinButton')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CheckinForm;
