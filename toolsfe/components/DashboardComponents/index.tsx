import { Button, Typography } from "@mui/material";
import DashboardTable from "./DashboardTable";
import { useRouter } from "next/router";
import { QueryClient, QueryClientProvider } from "react-query";
import { ZoneData } from "@/pages/location";

type Props = {
    dashboardData: ZoneData[];
    setPage: (page: number) => void
    setSize: (size: number) => void
    page: number
    size: number
};

const queryClient = new QueryClient();
const DashboardIndex = ({ dashboardData, setSize, setPage, page, size }: Props) => {
    const router = useRouter()
    return (
        <QueryClientProvider client={queryClient}>
            <div className="m-6">
                <Typography align='right'>
                    <Button
                        style={{
                            borderRadius: 15,
                            backgroundColor: "#9B2735",
                            fontSize: "13px"
                        }}
                        variant="contained"
                        onClick={() => router.push('/generate-qr')}
                    >
                        Generate QR Code
                    </Button>
                </Typography>
                <DashboardTable
                    dashboardData={dashboardData}
                    setPage={setPage}
                    setSize={setSize}
                    page={page}
                    size={size}
                />
            </div>
        </QueryClientProvider>
    )
}

export default DashboardIndex