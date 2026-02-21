import React, { useEffect } from "react";
import { UseQueryResult, useQuery } from "react-query";
import axios from "axios";
import Layout from "@/components/general/Layout";
import PersonIndex from "@/components/Persons";
import withLogin, { DecodedToken } from "@/components/general/withLogin";
import { PersonData } from "@/components/Persons/AddPersonDialog";
import { toast } from "react-toastify";

const getEntityId = (item: any): string => {
  const candidate = item?.id ?? item?._id;
  if (typeof candidate === "string") return candidate;
  if (candidate && typeof candidate?.toHexString === "function") return candidate.toHexString();
  if (candidate && typeof candidate?.toString === "function") return candidate.toString();
  if (candidate && typeof candidate?.$oid === "string") return candidate.$oid;
  return "";
};

const normalizePerson = (rawPerson: any): PersonData => ({
  id: getEntityId(rawPerson),
  name: rawPerson?.name || "",
  designation: rawPerson?.designation || "",
  emailId: rawPerson?.emailId || rawPerson?.email || "",
  phoneNumber: rawPerson?.phoneNumber || "",
  immediateBoss: rawPerson?.immediateBoss || "",
  toolsCount: Number(rawPerson?.toolsCount ?? 0),
  createdAt: rawPerson?.createdAt,
  updatedAt: rawPerson?.updatedAt,
});

export interface PersonFilters {
  name?: string;
  designation?: string;
  email?: string;
  phoneNumber?: string;
  immediateBoss?: string;
}

export interface PersonApiResponse {
  totalCount: number;
  currentPage: number;
  data: PersonData[];
}

const fetchPersons = async (page = 1, size = 10, filters: PersonFilters = {}): Promise<PersonApiResponse> => {
  const params: Record<string, any> = { page, size };
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params[key] = value;
  });

  const response = await axios.get(`/api/router?path=api/persons`, { params });
  const raw = response.data;

  if (Array.isArray(raw)) {
    const normalized = raw.map(normalizePerson);
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
    data: rawData.map(normalizePerson),
  };
};

const Persons = ({ roles }: DecodedToken) => {
  useEffect(() => {
    if (roles && roles !== "administrator") {
      // window.open('/', '_self');
    }
  }, [roles]);

  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const [filters, setFilters] = React.useState<PersonFilters>({});

  const {
    data: persons,
    refetch,
    isLoading,
  }: UseQueryResult<PersonApiResponse, unknown> = useQuery(
    ["persons", page, size, filters],
    () => fetchPersons(page, size, filters),
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      keepPreviousData: true,
    }
  );

  const handleFiltersChange = (newFilters: PersonFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const deletePerson = async (id: string) => {
    try {
      await axios.delete(`/api/router?path=api/persons/${id}`);
      toast.success("Successfully deleted person");
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete person");
    }
  };

  return (
    <Layout>
      {isLoading || !persons ? "Loading..." : (
      <PersonIndex
        personApiData={persons}
        deletePerson={deletePerson}
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

export default withLogin(Persons);
