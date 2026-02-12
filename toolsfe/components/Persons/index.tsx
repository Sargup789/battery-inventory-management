import { Button, Typography } from "@mui/material";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import AddPersonDialog, { PersonData } from "./AddPersonDialog";
import PersonTable from "./PersonTable";
import axios from "axios";
import { toast } from "react-toastify";

type Props = {
    personData: PersonData[];
    deletePerson: (id: string) => void;
    refetch: () => void;
    setPage: (page: number) => void;
    setSize: (size: number) => void;
    page: number;
    size: number;
};

const queryClient = new QueryClient();

const PersonIndex = ({
    personData,
    deletePerson,
    refetch,
    setPage,
    setSize,
    page,
    size,
}: Props) => {
    const [addPersonDialogOpen, setAddPersonDialogOpen] = useState(false);
    const [personDialogData, setPersonDialogData] = useState<PersonData | {}>({});

    const editPerson = (person: PersonData) => {
        setPersonDialogData(person);
        setAddPersonDialogOpen(true);
    };

    const handleClose = () => {
        setAddPersonDialogOpen(false);
        setPersonDialogData({});
    };

    const onSubmit = async (data: PersonData) => {
        if (Object.keys(personDialogData).length > 0) {
            const { id, ...rest } = data;
            try {
                const response = await axios.put(
                    `/api/router?path=api/persons/${id}`,
                    rest
                );
                toast.success("Successfully updated person");
                console.log(response.data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to update person");
            }
        } else {
            try {
                const response = await axios.post(`/api/router?path=api/persons`, data);
                toast.success("Successfully created person");
                console.log(response.data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to create person");
            }
        }
        handleClose();
        refetch();
    };

    return (
        <QueryClientProvider client={queryClient}>
            <div className="m-6">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                    <Button
                        style={{
                            borderRadius: 15,
                            backgroundColor: "#9B2735",
                            fontSize: "13px"
                        }}
                        variant="contained"
                        onClick={() => setAddPersonDialogOpen(true)}
                    >
                        Add Person
                    </Button>
                </div>
                <PersonTable
                    personData={personData}
                    deletePerson={deletePerson}
                    editPerson={editPerson}
                    setPage={setPage}
                    setSize={setSize}
                    page={page}
                    size={size}
                />
                <AddPersonDialog
                    open={addPersonDialogOpen}
                    personDialogData={personDialogData}
                    handleClose={handleClose}
                    persons={personData}
                    onSubmit={onSubmit}
                />
            </div>
        </QueryClientProvider>
    );
};

export default PersonIndex;
