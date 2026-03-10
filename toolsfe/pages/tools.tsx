import TruckIndex from "@/components/ToolComponents"
import Layout from "@/components/general/Layout"
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";
import { ZoneData } from "./location";
import React from "react";
import withLogin from "@/components/general/withLogin";
import { toast } from "react-toastify";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

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
  status: "Created" | "Assigned" | "Checked-in" | "In-transit";
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

export interface ToolFilters {
  status?: string;
  supplier?: string;
  assignedLocation?: string;
  assignedPerson?: string;
  partNumber?: string;
  toolName?: string;
  search?: string;
}

export const fetchTools = async (page = 1, size = 10, filters: ToolFilters = {}): Promise<ToolApiResponse> => {
  const params: Record<string, any> = { page, size };
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params[key] = value;
  });

  const response = await axios.get(`/api/router?path=api/tools`, {
    params,
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

const Tools = () => {
  const { t } = useTranslation('common');
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const [filters, setFilters] = React.useState<ToolFilters>({});

  const {
    data: tools,
    isLoading,
    refetch,
  }: UseQueryResult<ToolApiResponse, unknown> = useQuery(
    ["tools", page, size, filters],
    () => fetchTools(page, size, filters),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      keepPreviousData: true,
    }
  );

  const handleFiltersChange = (newFilters: ToolFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const deleteTool = async (id: string) => {
    try {
      await axios.delete(`/api/router?path=api/tools/${id}`);
      toast.success(t('tool.deleteSuccess'));
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('tool.deleteFailed'));
    }
  };

  return (
    <Layout>

      {isLoading || !tools ? (
        t('common.loading')
      ) : (
        <TruckIndex
          toolApidata={tools}
          deleteTool={deleteTool}
          refetch={refetch}
          setPage={setPage}
          setSize={setSize}
          page={page}
          size={size}
          filters={filters}
          onFiltersChange={handleFiltersChange} />
      )}
    </Layout>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

export default withLogin(Tools)
