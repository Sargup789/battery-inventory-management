import Layout from "@/components/general/Layout";
import PowerEquipmentIndex from "@/components/PowerEquipmentComponents";
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";
import React from "react";
import withLogin from "@/components/general/withLogin";
import { toast } from "react-toastify";

export interface EquipmentData {
  id: string;
  qrCodeId?: string;
  equipmentId: string;
  itemType?: string;
  manufacturer?: string;
  modelNumber?: string;
  serialNumber?: string;
  voltage?: string;
  ampHours?: string;
  status: string;
  dateOfArrival?: string;
  assignationType?: string;
  assignedTo?: string;
  truckModelNumber?: string;
  truckSerialNumber?: string;
  inboundDocumentType?: string;
  inboundDocumentNumber?: string;
  orderEntryNumber?: string;
  outboundDocumentType?: string;
  outboundDocumentNumber?: string;
  customerName?: string;
  zoneId?: string;
  zoneName?: string;
  zoneLocationType?: string;
  zoneCity?: string;
  zoneState?: string;
  location?: string;
  checkoutReason?: string;
  lastUpdatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EquipmentApiResponse {
  totalCount: number;
  currentPage: number;
  data: EquipmentData[];
}

export interface EquipmentFilters {
  status?: string;
  itemType?: string;
  manufacturer?: string;
  assignedTo?: string;
  search?: string;
}

const getEntityId = (item: any): string => {
  const candidate = item?.id ?? item?._id;
  if (typeof candidate === "string") return candidate;
  if (candidate && typeof candidate?.toHexString === "function") return candidate.toHexString();
  if (candidate && typeof candidate?.toString === "function") return candidate.toString();
  if (candidate && typeof candidate?.$oid === "string") return candidate.$oid;
  return "";
};

const normalizeEquipment = (raw: any): EquipmentData => ({
  id: getEntityId(raw),
  qrCodeId: raw?.qrCodeId || "",
  equipmentId: raw?.equipmentId || "",
  itemType: raw?.itemType || "",
  manufacturer: raw?.manufacturer || "",
  modelNumber: raw?.modelNumber || "",
  serialNumber: raw?.serialNumber || "",
  voltage: raw?.voltage || "",
  ampHours: raw?.ampHours || "",
  status: raw?.status || "created",
  dateOfArrival: raw?.dateOfArrival,
  assignationType: raw?.assignationType || "",
  assignedTo: raw?.assignedTo || "",
  truckModelNumber: raw?.truckModelNumber || "",
  truckSerialNumber: raw?.truckSerialNumber || "",
  inboundDocumentType: raw?.inboundDocumentType || "",
  inboundDocumentNumber: raw?.inboundDocumentNumber || "",
  orderEntryNumber: raw?.orderEntryNumber || "",
  outboundDocumentType: raw?.outboundDocumentType || "",
  outboundDocumentNumber: raw?.outboundDocumentNumber || "",
  customerName: raw?.customerName || "",
  zoneId: raw?.zoneId || "",
  zoneName: raw?.zoneName || "",
  zoneLocationType: raw?.zoneLocationType || "",
  zoneCity: raw?.zoneCity || "",
  zoneState: raw?.zoneState || "",
  location: raw?.location || "",
  checkoutReason: raw?.checkoutReason || "",
  lastUpdatedBy: raw?.lastUpdatedBy || "",
  createdAt: raw?.createdAt,
  updatedAt: raw?.updatedAt,
});

export const fetchEquipment = async (page = 1, size = 10, filters: EquipmentFilters = {}): Promise<EquipmentApiResponse> => {
  const params: Record<string, any> = { page, size };
  Object.entries(filters).forEach(([key, value]) => { if (value) params[key] = value; });

  const response = await axios.get(`/api/router?path=api/power-equipment`, { params });
  const raw = response.data;

  if (Array.isArray(raw)) {
    const normalized = raw.map(normalizeEquipment);
    return { totalCount: normalized.length, currentPage: page, data: normalized };
  }

  const rawData = Array.isArray(raw?.data) ? raw.data : [];
  return {
    totalCount: Number(raw?.totalCount ?? rawData.length),
    currentPage: Number(raw?.currentPage ?? page),
    data: rawData.map(normalizeEquipment),
  };
};

const PowerEquipmentPage = () => {
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const [filters, setFilters] = React.useState<EquipmentFilters>({});

  const { data: equipment, isLoading, refetch }: UseQueryResult<EquipmentApiResponse, unknown> = useQuery(
    ["equipment", page, size, filters],
    () => fetchEquipment(page, size, filters),
    { refetchOnWindowFocus: false, refetchOnReconnect: false, keepPreviousData: true }
  );

  const handleFiltersChange = (newFilters: EquipmentFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const deleteEquipment = async (id: string) => {
    try {
      await axios.delete(`/api/router?path=api/power-equipment/${id}`);
      toast.success("Equipment deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete equipment");
    }
  };

  return (
    <Layout>
      {isLoading || !equipment ? "Loading..." : (
        <PowerEquipmentIndex
          equipmentApiData={equipment}
          deleteEquipment={deleteEquipment}
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

export default withLogin(PowerEquipmentPage);
