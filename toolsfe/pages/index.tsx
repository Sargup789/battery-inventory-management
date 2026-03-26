import DashboardIndex from "@/components/DashboardComponents"
import Layout from '@/components/general/Layout'
import axios from "axios";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { UseQueryResult, useQuery } from "react-query";
import { ZoneData } from "./location";
import { useState } from "react";
import withLogin from "@/components/general/withLogin";

const getEntityId = (item: any): string => {
  const candidate = item?.id ?? item?._id;
  if (typeof candidate === "string") return candidate;
  if (candidate && typeof candidate?.toHexString === "function") return candidate.toHexString();
  if (candidate && typeof candidate?.toString === "function") return candidate.toString();
  if (candidate && typeof candidate?.$oid === "string") return candidate.$oid;
  return "";
};

const normalizeLocation = (raw: any): ZoneData => ({
  id: getEntityId(raw),
  name: raw?.name || "",
  description: raw?.description || "",
  type: raw?.type || "",
  city: raw?.city || "",
  state: raw?.state || "",
  toolsCount: Number(raw?.toolsCount ?? 0),
  maxCapacity: String(raw?.maxCapacity ?? "0"),
  occupiedLocations: Array.isArray(raw?.occupiedLocations) ? raw.occupiedLocations : [],
  isActive: typeof raw?.isActive === "boolean" ? raw.isActive : true,
  isFinalZone: Boolean(raw?.isFinalZone),
  locationPrefix: raw?.locationPrefix || "",
  isParentZone: Boolean(raw?.isParentZone),
  isSubZone: Boolean(raw?.isSubZone),
  parentZoneId: raw?.parentZoneId ?? null,
  createdAt: raw?.createdAt || "",
  updatedAt: raw?.updatedAt || "",
  subZones: Array.isArray(raw?.subZones) ? raw.subZones.map(normalizeLocation) : null,
});

const fetchZones = async (page = 1, size = 10) => {
  const response = await axios.get(`/api/router?path=api/locations`, {
    params: {
      page,
      size
    }
  });
  const raw = response.data;
  const rows = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
  return rows.map(normalizeLocation);
};


const index = () => {
  const { t } = useTranslation('common');
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
        t('common.loading')
      ) : (
        <DashboardIndex dashboardData={zones} setPage={setPage}
          setSize={setSize}
          page={page}
          size={size} />
      )}    </Layout>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default withLogin(index)
