import TruckIndex from "@/components/ToolComponents"
import Layout from "@/components/general/Layout"
import axios from "axios";
import { UseQueryResult, useQuery } from "react-query";
import { ZoneData } from "./location";
import React from "react";
import withLogin from "@/components/general/withLogin";

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
  status: "Created" | "Assigned" | "Checked-in" | "In-transit";
  assignedPerson?: string;
  assignedLocation?: string;
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

export const fetchTools = async (page = 1, size = 10, filters = {}) => {
  console.log("fetchTools", process.env.ROOT_URL);
  const response = await axios.get(`/api/router?path=api/tools`, {
    params: {
      ...filters,
      page,
      size
    }
  });
  return response.data;
};

// Legacy function name for backward compatibility
export const fetchTrucks = fetchTools;


// Mock data for testing UI
const mockToolsData: ToolApiResponse = {
  totalCount: 4,
  page: 1,
  currentPage: 1,
  data: [
    {
      id: "1",
      qrCodeId: "QR001",
      toolId: "TL001A",
      partNumber: "PN-12345",
      toolName: "Cordless Drill",
      toolDescription: "18V Lithium-Ion Cordless Drill with Battery",
      supplier: "DeWalt",
      status: "Created",
      createdAt: "2026-01-15",
      updatedAt: "2026-01-15",
    },
    {
      id: "2",
      qrCodeId: "QR002",
      toolId: "TL002B",
      partNumber: "PN-67890",
      toolName: "Angle Grinder",
      toolDescription: "4.5 inch Electric Angle Grinder",
      supplier: "Makita",
      status: "Assigned",
      assignedPerson: "John Doe",
      assignedLocation: "Warehouse A",
      createdAt: "2026-01-16",
      updatedAt: "2026-01-20",
    },
    {
      id: "3",
      qrCodeId: "QR003",
      toolId: "TL003C",
      partNumber: "PN-11111",
      toolName: "Impact Wrench",
      toolDescription: "1/2 inch Electric Impact Wrench",
      supplier: "Milwaukee",
      status: "Checked-in",
      assignedPerson: "Jane Smith",
      assignedLocation: "Workshop B",
      createdAt: "2026-01-18",
      updatedAt: "2026-02-10",
    },
    {
      id: "4",
      qrCodeId: "QR004",
      toolId: "TL004D",
      partNumber: "PN-22222",
      toolName: "Circular Saw",
      toolDescription: "7.25 inch Circular Saw with Laser Guide",
      supplier: "Bosch",
      status: "In-transit",
      assignedPerson: "Mike Johnson",
      assignedLocation: "Site C",
      createdAt: "2026-02-01",
      updatedAt: "2026-02-11",
    },
  ],
};

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

  // Using mock data instead of API call
  const [tools, setTools] = React.useState<ToolApiResponse>(mockToolsData);
  const [isLoading] = React.useState(false);

  const refetch = () => {
    console.log("Refetch called");
  };

  const deleteTool = async (id: string) => {
    // Mock delete - filter out from state
    setTools((prev) => ({
      ...prev,
      data: prev.data.filter((t) => t.id !== id),
      totalCount: prev.totalCount - 1,
    }));
    console.log("Deleted tool:", id);
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