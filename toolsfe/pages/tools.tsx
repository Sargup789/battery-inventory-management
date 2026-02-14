import TruckIndex from "@/components/ToolComponents"
import Layout from "@/components/general/Layout"
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";
import { ZoneData } from "./location";
import React from "react";
import withLogin from "@/components/general/withLogin";
import { toast } from "react-toastify";

type ConditionValue = {
  condition: ">" | "=" | "<";
  value: string | null;
};

export interface FiltersState {
  zoneId: null | string,
  make: null | string,
  model: null | string,
  manufacturedYear: null | ConditionValue,
  hourMeter: null | ConditionValue,
  serialNumber: null | string,
  stockNumber: null | string,
  fuelType: null | string,
  isRetailReady: null | boolean,
  status: null | string,
  arrivalDate: null | string
  batteryMake: null | string,
  batteryModel: null | string,
  allocation: null | string,
  price: null | ConditionValue
};

export interface ToolApiResponse {
  totalCount: number;
  page: number;
  currentPage: number;
  data: ToolData[];
}

export interface ToolData {
  id: string;
  qrCodeId: string;
  toolId: string;
  partNumber: string;
  toolName: string;
  toolDescription: string;
  supplier: string;
  status: "Created" | "Assigned" | "Checked-in" | "In-transit" | "Sold";
  assignedPerson?: string;
  assignedPersonDesignation?: string;
  assignedPersonEmail?: string;
  assignedPersonPhoneNumber?: string;
  assignedLocation?: string;
  assignedLocationType?: string;
  assignedLocationCity?: string;
  assignedLocationState?: string;
  location?: LocationData;
  locationId?: string;
  person?: PersonData;
  personId?: string;
  lastUpdatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Legacy truck data interface for backward compatibility
export interface TruckData extends ToolData {
  arrivalDate?: string;
  manufacturedYear?: string;
  model?: string;
  make?: string;
  hourMeter?: string;
  serialNumber?: string;
  stockNumber?: string;
  fuelType?: string;
  allocation?: string;
  price?: string;
  batteryMake?: string;
  batteryModel?: string;
  isRetailReady?: boolean;
  zone?: ZoneData;
  zoneId?: string;
}

export interface TruckApiResponse extends ToolApiResponse { }

export interface LocationData {
  id: string;
  name: string;
  type: string;
  city: string;
  state: string;
  toolsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PersonData {
  id: string;
  name: string;
  designation: string;
  emailId: string;
  phoneNumber: string;
  immediateBoss: string;
  toolsCount?: number;
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

const normalizeStatus = (status: string): ToolData["status"] => {
  const value = String(status || "").toLowerCase();
  if (value === "created") return "Created";
  if (value === "assigned") return "Assigned";
  if (value === "checked-in") return "Checked-in";
  if (value === "in-transit") return "In-transit";
  if (value === "sold") return "Sold";
  return "Created";
};

const normalizeTool = (rawTool: any): ToolData => ({
  id: getEntityId(rawTool),
  qrCodeId: rawTool?.qrCodeId || "",
  toolId: rawTool?.toolId || "",
  partNumber: rawTool?.partNumber || "",
  toolName: rawTool?.toolName || "",
  toolDescription: rawTool?.toolDescription || rawTool?.description || "",
  supplier: rawTool?.supplier || "",
  status: normalizeStatus(rawTool?.status),
  assignedPerson: rawTool?.assignedPerson || "",
  assignedPersonDesignation: rawTool?.assignedPersonDesignation || "",
  assignedPersonEmail: rawTool?.assignedPersonEmail || "",
  assignedPersonPhoneNumber: rawTool?.assignedPersonPhoneNumber || "",
  assignedLocation: rawTool?.assignedLocation || rawTool?.location || "",
  assignedLocationType: rawTool?.assignedLocationType || "",
  assignedLocationCity: rawTool?.assignedLocationCity || "",
  assignedLocationState: rawTool?.assignedLocationState || "",
  locationId: rawTool?.locationId || rawTool?.zoneId || rawTool?.assignedLocationId,
  personId: rawTool?.personId || rawTool?.assignedPersonId,
  lastUpdatedBy: rawTool?.lastUpdatedBy || "",
  createdAt: rawTool?.createdAt,
  updatedAt: rawTool?.updatedAt,
});

export const fetchTools = async (page = 1, size = 10, filters = {}): Promise<ToolApiResponse> => {
  const response = await axios.get(`/api/router?path=api/tools`, {
    params: {
      ...filters,
      page,
      size
    }
  });

  const raw = response.data;
  if (Array.isArray(raw)) {
    const normalized = raw.map(normalizeTool);
    const start = (page - 1) * size;
    return {
      totalCount: normalized.length,
      page,
      currentPage: page,
      data: normalized.slice(start, start + size),
    };
  }

  const rawData = Array.isArray(raw?.data) ? raw.data : [];
  const normalizedData = rawData.map(normalizeTool);
  return {
    totalCount: Number(raw?.totalCount ?? normalizedData.length),
    page: Number(raw?.page ?? page),
    currentPage: Number(raw?.currentPage ?? page),
    data: normalizedData,
  };
};

// Legacy function name for backward compatibility
export const fetchTrucks = fetchTools;

const Tools = () => {
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const [filtersState, setFilterState] = React.useState<FiltersState>({
    zoneId: null,
    make: null,
    model: null,
    manufacturedYear: { condition: "=", value: null },
    stockNumber: null,
    serialNumber: null,
    fuelType: null,
    isRetailReady: null,
    allocation: null,
    price: { condition: "=", value: null },
    status: null,
    hourMeter: { condition: "=", value: null },
    arrivalDate: null,
    batteryMake: null,
    batteryModel: null,
  })

  const {
    data: tools,
    isLoading,
    refetch,
  }: UseQueryResult<ToolApiResponse, unknown> = useQuery(
    ["tools", page, size, JSON.stringify(filtersState)],
    () => fetchTools(page, size, filtersState),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      keepPreviousData: true,
    }
  );

  const deleteTool = async (id: string) => {
    try {
      await axios.delete(`/api/router?path=api/tools/${id}`);
      toast.success("Successfully deleted tool");
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete tool");
    }
  };

  return (
    <Layout>

      {isLoading || !tools ? (
        "Loading..."
      ) : (
        <TruckIndex
          toolApidata={tools}
          deleteTool={deleteTool}
          refetch={refetch}
          setPage={setPage}
          setSize={setSize}
          filtersState={filtersState}
          setFilterState={setFilterState}
          page={page}
          size={size} />
      )}
    </Layout>
  )
}

export default withLogin(Tools)
