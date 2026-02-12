import React, { useEffect, useState } from "react";
// import { useQuery, UseQueryResult } from "react-query";
// import axios from "axios";
import Layout from "@/components/general/Layout";
import PersonIndex from "@/components/Persons";
import withLogin, { DecodedToken } from "@/components/general/withLogin";
import { PersonData } from "@/components/Persons/AddPersonDialog";

// Mock data for testing UI
const mockPersonsData: PersonData[] = [
  {
    id: "1",
    name: "John Doe",
    designation: "Manager",
    emailId: "john.doe@example.com",
    phoneNumber: "1234567890",
    immediateBoss: "",
  },
  {
    id: "2",
    name: "Jane Smith",
    designation: "Engineer",
    emailId: "jane.smith@example.com",
    phoneNumber: "9876543210",
    immediateBoss: "John Doe",
  },
  {
    id: "3",
    name: "Mike Johnson",
    designation: "Technician",
    emailId: "mike.johnson@example.com",
    phoneNumber: "5551234567",
    immediateBoss: "Jane Smith",
  },
  {
    id: "4",
    name: "Sarah Williams",
    designation: "Supervisor",
    emailId: "sarah.williams@example.com",
    phoneNumber: "5559876543",
    immediateBoss: "John Doe",
  },
];

const Persons = ({ roles }: DecodedToken) => {
  useEffect(() => {
    if (roles && roles !== "administrator") {
      // window.open('/', '_self');
    }
  }, [roles]);

  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(10);
  const [persons, setPersons] = useState<PersonData[]>(mockPersonsData);

  const deletePerson = async (id: string) => {
    // Mock delete - just filter out from state
    setPersons((prev) => prev.filter((p) => p.id !== id));
    console.log("Deleted person:", id);
  };

  const refetch = () => {
    // Mock refetch - just log for now
    console.log("Refetch called");
  };

  return (
    <Layout>
      <PersonIndex
        personData={persons}
        deletePerson={deletePerson}
        refetch={refetch}
        setPage={setPage}
        setSize={setSize}
        page={page}
        size={size}
      />
    </Layout>
  );
};

export default withLogin(Persons);
