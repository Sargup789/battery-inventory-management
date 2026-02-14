import React, { useEffect } from "react";
import { useQuery, UseQueryResult } from "react-query";
import axios from "axios";
import Layout from "@/components/general/Layout";
import LocationIndex from "@/components/LocationComponents";
import withLogin, { DecodedToken } from "@/components/general/withLogin";
import { toast } from "react-toastify";

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

const fetchLocations = async (): Promise<ZoneData[]> => {
  const response = await axios.get(`/api/router?path=api/locations`);
  const raw = response.data;
  const locationRows = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
  return locationRows.map(normalizeLocation);
};

const Zone = ({ roles }: DecodedToken) => {
  useEffect(() => {
    if (roles && roles !== "administrator") {
      // window.open('/', '_self')
    }
  }, [roles])
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);

  const {
    data: zones,
    isLoading,
    refetch,
  }: UseQueryResult<ZoneData[], unknown> = useQuery(["zones"], fetchLocations, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const deleteZone = async (id: string) => {
    try {
      await axios.delete(`/api/router?path=api/locations/${id}`);
      toast.success("Successfully deleted location");
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete location");
    }
  };

  return (
    <Layout>
      {isLoading || !zones ? (
        "Loading..."
      ) : (
        <LocationIndex zoneData={zones} deleteZone={deleteZone} refetch={refetch} setPage={setPage}
          setSize={setSize}
          page={page}
          size={size} />
      )}
    </Layout>
  );
};

export default withLogin(Zone);
