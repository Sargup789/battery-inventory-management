import React, { useEffect } from "react";
import { useQuery, UseQueryResult } from "react-query";
import axios from "axios";
import Layout from "@/components/general/Layout";
import LocationIndex from "@/components/LocationComponents";
import withLogin, { DecodedToken } from "@/components/general/withLogin";
import { toast } from "react-toastify";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export interface ZoneData {
  id: string;
  name: string;
  description: string;
  type?: string;
  city?: string;
  state?: string;
  toolsCount?: number;
  maxCapacity?: string;
  occupiedLocations: string[];
  isActive: boolean;
  isFinalZone: boolean;
  locationPrefix: string;
  isParentZone: boolean;
  isSubZone: boolean;
  parentZoneId: string | null;
  createdAt: string;
  updatedAt: string;
  subZones: ZoneData[] | null
}

const getEntityId = (item: any): string => {
  const candidate = item?.id ?? item?._id;
  if (typeof candidate === "string") return candidate;
  if (candidate && typeof candidate?.toHexString === "function") return candidate.toHexString();
  if (candidate && typeof candidate?.toString === "function") return candidate.toString();
  if (candidate && typeof candidate?.$oid === "string") return candidate.$oid;
  return "";
};

const normalizeLocation = (raw: any): ZoneData => {
  const rawSubZones = Array.isArray(raw?.subZones) ? raw.subZones : null;
  return {
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
    subZones: rawSubZones ? rawSubZones.map(normalizeLocation) : null,
  };
};

export interface LocationFilters {
  name?: string;
  type?: string;
  city?: string;
  state?: string;
}

export interface LocationApiResponse {
  totalCount: number;
  currentPage: number;
  data: ZoneData[];
}

const fetchLocations = async (page = 1, size = 10, filters: LocationFilters = {}): Promise<LocationApiResponse> => {
  const params: Record<string, any> = { page, size };
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params[key] = value;
  });

  const response = await axios.get(`/api/router?path=api/locations`, { params });
  const raw = response.data;

  if (Array.isArray(raw)) {
    const normalized = raw.map(normalizeLocation);
    const start = (page - 1) * size;
    return {
      totalCount: normalized.length,
      currentPage: page,
      data: normalized.slice(start, start + size),
    };
  }

  const rawData = Array.isArray(raw?.data) ? raw.data : [];
  return {
    totalCount: Number(raw?.totalCount ?? rawData.length),
    currentPage: Number(raw?.currentPage ?? page),
    data: rawData.map(normalizeLocation),
  };
};

const Zone = ({ roles }: DecodedToken) => {
  const { t } = useTranslation('common');
  useEffect(() => {
    if (roles && roles !== "administrator") {
      // window.open('/', '_self')
    }
  }, [roles])
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const [filters, setFilters] = React.useState<LocationFilters>({});

  const {
    data: zones,
    isLoading,
    refetch,
  }: UseQueryResult<LocationApiResponse, unknown> = useQuery(
    ["zones", page, size, filters],
    () => fetchLocations(page, size, filters),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      keepPreviousData: true,
    }
  );

  const handleFiltersChange = (newFilters: LocationFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const deleteZone = async (id: string) => {
    try {
      await axios.delete(`/api/router?path=api/locations/${id}`);
      toast.success(t('location.deleteSuccess'));
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('location.deleteFailed'));
    }
  };

  return (
    <Layout>
      {isLoading || !zones ? (
        t('common.loading')
      ) : (
        <LocationIndex
          locationApiData={zones}
          deleteZone={deleteZone}
          refetch={refetch}
          setPage={setPage}
          setSize={setSize}
          page={page}
          size={size}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      )}
    </Layout>
  );
};

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default withLogin(Zone);
