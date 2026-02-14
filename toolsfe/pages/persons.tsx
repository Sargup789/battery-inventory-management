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

const fetchPersons = async (): Promise<PersonData[]> => {
  const response = await axios.get(`/api/router?path=api/persons`);
  const rows = Array.isArray(response.data)
    ? response.data
    : Array.isArray(response.data?.data)
      ? response.data.data
      : [];
  return rows.map(normalizePerson);
};

const Persons = ({ roles }: DecodedToken) => {
  useEffect(() => {
    if (roles && roles !== "administrator") {
      // window.open('/', '_self');
    }
  }, [roles]);

  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);

  const {
    data: persons,
    refetch,
    isLoading,
  }: UseQueryResult<PersonData[], unknown> = useQuery(["persons"], fetchPersons, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

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
        personData={persons}
        deletePerson={deletePerson}
        refetch={refetch}
        setPage={setPage}
        setSize={setSize}
        page={page}
        size={size}
      />
      )}
    </Layout>
  );
};

export default withLogin(Persons);
