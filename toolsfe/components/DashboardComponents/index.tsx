import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import { ZoneData } from "@/pages/location";
import BuildIcon from "@mui/icons-material/Build";
import LocationOnIcon from "@mui/icons-material/LocationOn";

type Props = {
  dashboardData: ZoneData[];
  setPage: (page: number) => void;
  setSize: (size: number) => void;
  page: number;
  size: number;
};

const queryClient = new QueryClient();
const DashboardIndex = ({ dashboardData, setSize, setPage, page, size }: Props) => {
  const router = useRouter();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="m-6">
        <Typography align="right">
          <Button
            style={{
              borderRadius: 15,
              backgroundColor: "#9B2735",
              fontSize: "13px",
            }}
            variant="contained"
            onClick={() => router.push("/generate-qr")}
          >
            Generate QR Code
          </Button>
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {dashboardData.map((location) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={location.id}>
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
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                    <LocationOnIcon sx={{ color: "#9B2735", mr: 1 }} />
                    <Typography variant="h6" fontWeight={700} noWrap>
                      {location.name}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    <strong>Type:</strong> {location.type || "—"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    <strong>City:</strong> {location.city || "—"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>State:</strong> {location.state || "—"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: "1px solid #eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <BuildIcon sx={{ color: "#9B2735", mr: 0.5, fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      Tools Assigned
                    </Typography>
                  </Box>
                  <Typography variant="h4" fontWeight={800} color="#9B2735">
                    {location.toolsCount ?? 0}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </div>
    </QueryClientProvider>
  );
};

export default DashboardIndex;
