import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { ZoneData } from "@/pages/index";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import LocationOnIcon from "@mui/icons-material/LocationOn";

type Props = {
  dashboardData: ZoneData[];
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  page: number;
  size: number;
};

const DashboardIndex = ({ dashboardData }: Props) => {
  const router = useRouter();
  // Only show top-level zones (no parent)
  const topLevelZones = (dashboardData || []).filter((z) => !z.parentZoneId);

  return (
    <div className="m-6">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700}>Zone Overview</Typography>
        <Button
          style={{ borderRadius: 15, backgroundColor: "#9B2735", fontSize: "13px" }}
          variant="contained"
          onClick={() => router.push("/generate-qr")}
        >
          Generate QR Code
        </Button>
      </Box>

      <Grid container spacing={3}>
        {topLevelZones.map((zone) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={zone.id}>
            <Box
              sx={{
                p: 3,
                bgcolor: "white",
                borderRadius: 3,
                boxShadow: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
              }}
            >
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                  <LocationOnIcon sx={{ color: "#9B2735", mr: 1 }} />
                  <Typography variant="h6" fontWeight={700} noWrap>{zone.name}</Typography>
                </Box>
                {zone.identifier && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    <strong>Identifier:</strong> {zone.identifier}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  <strong>Location Type:</strong> {zone.locationType || "—"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  <strong>City:</strong> {zone.city || "—"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>State:</strong> {zone.state || "—"}
                </Typography>
              </Box>

              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <BatteryChargingFullIcon sx={{ color: "#9B2735", mr: 0.5, fontSize: 20 }} />
                  <Typography variant="body2" color="text.secondary">Equipment</Typography>
                </Box>
                <Typography variant="h4" fontWeight={800} color="#9B2735">
                  {zone.equipmentCount ?? 0}
                </Typography>
              </Box>

              {zone.subZones && zone.subZones.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {zone.subZones.length} sub-zone{zone.subZones.length > 1 ? 's' : ''}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default DashboardIndex;
