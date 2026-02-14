import DashboardIndex from "@/components/DashboardComponents"
import Layout from '@/components/general/Layout'
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";
import { ZoneData } from "./location";
import { useState } from "react";
import withLogin from "@/components/general/withLogin";

const fetchZones = async (page = 1, size = 10) => {
  const response = await axios.get(`/api/router?path=api/locations`, {
    params: {
      page,
      size
    }
  });
  return response.data;
};


const index = () => {

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);


  const {
    data: zones,
    isLoading,
  }: UseQueryResult<ZoneData[], unknown> = useQuery(["zones", page, size], () => fetchZones(page, size), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });


  return (
    <Layout>
      {isLoading || !zones ? (
        "Loading..."
      ) : (
        <DashboardIndex dashboardData={zones} setPage={setPage}
          setSize={setSize}
          page={page}
          size={size} />
      )}    </Layout>
  )
}

export default withLogin(index)
