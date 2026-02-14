import React, { useState } from "react";
import axios from "axios";
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
            designation: person?.designation || "",
            emailId: person?.emailId || person?.email || "",
            phoneNumber: person?.phoneNumber || "",
            immediateBoss: person?.immediateBoss || "",
          }))
        );
      })
      .catch(() => toast.error("Error fetching persons."));
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
      toast.error(errmsg || "Error fetching tool details.");
    }
  };

  const handleSubmit = async () => {
    if (!toolDetails?.id) {
      toast.error("Tool not found.");
      return;
    }
    if (!selectedPersonId) {
      toast.error("Please select person.");
      return;
    }

    try {
      await axios.post(`/api/router?path=api/tools/check-in`, {
        toolId: toolDetails.id,
        personId: selectedPersonId,
      });
      toast.success("Check-in successful.");
      setToolDetails(null);
      setQrCode(null);
      setSelectedPersonId("");
    } catch (error: any) {
      const errmsg = error?.response?.data?.message;
      toast.error(errmsg || "Something went wrong");
    }
  };

  return (
    <Box p={3} bgcolor="white" boxShadow={2}>
      <Typography variant="h5">Check-in Tool</Typography>
      {isScanning ? (
        <div>
          <QrReader
            onResult={handleScan}
            constraints={{ facingMode: "environment" }}
            // @ts-ignore
            style={{ width: "40%", height: "40%" }}
          />
          <Button onClick={() => setIsScanning(false)}>Close Scanner</Button>
        </div>
      ) : (
        <TextField
          label="Scan QR Code"
          value={qrCode || ""}
          margin="normal"
          InputProps={{
            endAdornment: (
              <>
                <InputAdornment position="end">
                  <Button onClick={() => setIsScanning(true)}>Scan</Button>
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
          <Typography variant="h4">Tool Details:</Typography>
          <br />
          <Typography variant="body1">QR Code ID: {toolDetails.qrCodeId}</Typography>
          <Typography variant="body1">Tool ID: {toolDetails.toolId}</Typography>
          <Typography variant="body1">Part Number: {toolDetails.partNumber}</Typography>
          <Typography variant="body1">Tool Name: {toolDetails.toolName}</Typography>
          <Typography variant="body1">Description: {toolDetails.toolDescription}</Typography>
          <Typography variant="body1">Supplier: {toolDetails.supplier}</Typography>
          <Typography variant="body1">Status: {toolDetails.status}</Typography>
          <Typography variant="body1">
            Assigned Person: {toolDetails.assignedPerson || "N/A"}
          </Typography>
          <Typography variant="body1">
            Assigned Location: {toolDetails.assignedLocation || "N/A"}
          </Typography>
          <Typography variant="body1">
            Created At:{" "}
            {toolDetails.createdAt
              ? moment(toolDetails.createdAt).format("MMM DD, YYYY")
              : "N/A"}
          </Typography>
          <Typography variant="body1">
            Updated At:{" "}
            {toolDetails.updatedAt
              ? moment(toolDetails.updatedAt).format("MMM DD, YYYY")
              : "N/A"}
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel id="checkin-person-label">Select Person</InputLabel>
            <Select
              labelId="checkin-person-label"
              label="Select Person"
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
            Check-in Tool
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CheckinForm;
