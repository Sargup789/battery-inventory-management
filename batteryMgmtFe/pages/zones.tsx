import Layout from "@/components/general/Layout";
import ZonesIndex from "@/components/ZoneComponents";
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";
import React from "react";
import withLogin from "@/components/general/withLogin";
import { toast } from "react-toastify";
import { ZoneData } from "@/pages/index";

export interface ZoneApiResponse {
  totalCount: number;
  currentPage: number;
  data: ZoneData[];
}

const getEntityId = (item: any): string => {
  const candidate = item?.id ?? item?._id;
  if (typeof candidate === "string") return candidate;
  if (candidate && typeof candidate?.toHexString === "function") return candidate.toHexString();
  if (candidate && typeof candidate?.toString === "function") return candidate.toString();
  if (candidate && typeof candidate?.$oid === "string") return candidate.$oid;
  return "";
};

const normalizeZone = (raw: any): ZoneData => ({
  id: getEntityId(raw),
  name: raw?.name || "",
  identifier: raw?.identifier || "",
  locationType: raw?.locationType || "",
  city: raw?.city || "",
  state: raw?.state || "",
  parentZoneId: raw?.parentZoneId || null,
  equipmentCount: Number(raw?.equipmentCount ?? 0),
  subZones: Array.isArray(raw?.subZones) ? raw.subZones.map(normalizeZone) : [],
  createdAt: raw?.createdAt || "",
  updatedAt: raw?.updatedAt || "",
});

export const fetchZones = async (page = 1, size = 100): Promise<ZoneApiResponse> => {
  const response = await axios.get(`/api/router?path=api/zones`, { params: { page, size } });
  const raw = response.data;
  const rawData = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
  return {
    totalCount: Number(raw?.totalCount ?? rawData.length),
    currentPage: Number(raw?.currentPage ?? page),
    data: rawData.map(normalizeZone),
  };
};

const ZonesPage = () => {
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(100);

  const { data: zones, isLoading, refetch }: UseQueryResult<ZoneApiResponse, unknown> = useQuery(
    ["zones", page, size],
    () => fetchZones(page, size),
    { refetchOnWindowFocus: false, refetchOnReconnect: false, keepPreviousData: true }
  );

  const deleteZone = async (id: string) => {
    try {
      await axios.delete(`/api/router?path=api/zones/${id}`);
      toast.success("Zone deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete zone");
    }
  };

  return (
    <Layout>
      {isLoading ? "Loading..." : (
        <ZonesIndex
          zonesApiData={zones || { totalCount: 0, currentPage: 1, data: [] }}
          deleteZone={deleteZone}
          refetch={refetch}
          setPage={setPage}
          setSize={setSize}
          page={page}
          size={size}
        />
      )}
    </Layout>
  );
};

export default withLogin(ZonesPage);
