import React, { useEffect } from "react";
import { useQuery, UseQueryResult } from "react-query";
import axios from "axios";
import Layout from "@/components/general/Layout";
import LocationIndex from "@/components/LocationComponents";
import withLogin, { DecodedToken } from "@/components/general/withLogin";

export interface ZoneData {
  id: string;
  name: string;
  description: string;
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

// Mock data for testing UI
const mockLocationsData: ZoneData[] = [
  {
    id: "1",
    name: "Warehouse A",
    description: "Main storage warehouse",
    maxCapacity: "1000",
    occupiedLocations: ["A1", "A2", "A3"],
    isActive: true,
    isFinalZone: true,
    locationPrefix: "WH-A",
    isParentZone: false,
    isSubZone: false,
    parentZoneId: null,
    createdAt: "2026-01-10",
    updatedAt: "2026-01-10",
    subZones: null,
  },
  {
    id: "2",
    name: "Workshop B",
    description: "Tool maintenance workshop",
    maxCapacity: "500",
    occupiedLocations: ["B1", "B2"],
    isActive: true,
    isFinalZone: true,
    locationPrefix: "WS-B",
    isParentZone: false,
    isSubZone: false,
    parentZoneId: null,
    createdAt: "2026-01-12",
    updatedAt: "2026-01-12",
    subZones: null,
  },
  {
    id: "3",
    name: "Site C",
    description: "Construction site location",
    maxCapacity: "200",
    occupiedLocations: ["C1"],
    isActive: true,
    isFinalZone: true,
    locationPrefix: "ST-C",
    isParentZone: false,
    isSubZone: false,
    parentZoneId: null,
    createdAt: "2026-01-15",
    updatedAt: "2026-02-05",
    subZones: null,
  },
];

const Zone = ({ roles }: DecodedToken) => {
  useEffect(() => {
    if (roles && roles !== "administrator") {
      // window.open('/', '_self')
    }
  }, [roles])
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);

  // Using mock data instead of API call
  const [zones, setZones] = React.useState<ZoneData[]>(mockLocationsData);
  const [isLoading] = React.useState(false);

  const refetch = () => {
    console.log("Refetch called");
  };

  const deleteZone = async (id: string) => {
    // Mock delete - filter out from state
    setZones((prev) => prev.filter((z) => z.id !== id));
    console.log("Deleted location:", id);
  };

  console.log(zones, "zones");

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
