import Layout from '@/components/general/Layout';
import DashboardIndex from '@/components/DashboardComponents';
import axios from 'axios';
import { UseQueryResult, useQuery } from 'react-query';
import { useState } from 'react';
import withLogin from '@/components/general/withLogin';

export interface ZoneData {
  id: string;
  name: string;
  identifier?: string;
  locationType?: string;
  city?: string;
  state?: string;
  parentZoneId?: string;
  equipmentCount?: number;
  subZones?: ZoneData[];
  createdAt?: string;
  updatedAt?: string;
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

const fetchZones = async (page = 1, size = 100) => {
  const response = await axios.get(`/api/router?path=api/zones`, { params: { page, size } });
  const raw = response.data;
  const rows = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
  return rows.map(normalizeZone);
};

const index = () => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(100);

  const { data: zones, isLoading }: UseQueryResult<ZoneData[], unknown> = useQuery(
    ["zones", page, size],
    () => fetchZones(page, size),
    { refetchOnWindowFocus: false, refetchOnReconnect: false }
  );

  return (
    <Layout>
      {isLoading ? "Loading..." : (
        <DashboardIndex dashboardData={zones || []} setPage={setPage} setSize={setSize} page={page} size={size} />
      )}
    </Layout>
  );
}

export default withLogin(index);
