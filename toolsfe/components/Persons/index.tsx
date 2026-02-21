import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import AddPersonDialog, { PersonData } from "./AddPersonDialog";
import PersonTable from "./PersonTable";
import { PersonApiResponse, PersonFilters } from "@/pages/persons";
import PersonTableFilters from "./PersonTableFilters";
import axios from "axios";
import { toast } from "react-toastify";

type Props = {
    personApiData: PersonApiResponse;
    deletePerson: (id: string) => void;
    refetch: () => void;
    setPage: (page: number) => void;
    setSize: (size: number) => void;
    page: number;
    size: number;
    filters: PersonFilters;
    onFiltersChange: (filters: PersonFilters) => void;
};

const queryClient = new QueryClient();

const PersonIndex = ({
    personApiData,
    deletePerson,
    refetch,
    setPage,
    setSize,
    page,
    size,
    filters,
    onFiltersChange,
}: Props) => {
    const [addPersonDialogOpen, setAddPersonDialogOpen] = useState(false);
    const [personDialogData, setPersonDialogData] = useState<PersonData | {}>({});
    const [showFilters, setShowFilters] = useState(false);

    const editPerson = (person: PersonData) => {
        setPersonDialogData(person);
        setAddPersonDialogOpen(true);
    };

    const handleClose = () => {
        setAddPersonDialogOpen(false);
        setPersonDialogData({});
    };

    const onSubmit = async (data: PersonData) => {
        const payload = {
            ...data,
            email: data.emailId,
            emailId: data.emailId,
        };
        if (Object.keys(personDialogData).length > 0) {
            const { id, ...rest } = data;
            try {
                await axios.put(
                    `/api/router?path=api/persons/${id}`,
                    {
                        ...rest,
                        email: rest.emailId,
                        emailId: rest.emailId,
                    }
                );
                toast.success("Successfully updated person");
            } catch (error) {
                console.error(error);
                toast.error("Failed to update person");
            }
        } else {
            try {
                await axios.post(`/api/router?path=api/persons`, payload);
                toast.success("Successfully created person");
            } catch (error) {
                console.error(error);
                toast.error("Failed to create person");
            }
        }
        handleClose();
        refetch();
    };

    const hasActiveFilters = Object.values(filters).some((v) => !!v);

    return (
        <QueryClientProvider client={queryClient}>
            <div className="m-6">
                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <Button
                        style={{
                            borderRadius: 15,
                            backgroundColor: "#9B2735",
                            fontSize: "13px"
                        }}
                        variant="contained"
                        onClick={() => setShowFilters(prev => !prev)}
                    >
                        {showFilters ? "Hide Filters" : "Show Filters"}
                    </Button>
                    <Typography align='left' style={{ display: 'flex', alignItems: 'center' }}>
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
                    </Typography>
                </Box>
                {(showFilters || hasActiveFilters) && (
                    <Box sx={{ background: 'white', width: '100%', marginBottom: '16px' }}>
                        <PersonTableFilters filtersState={filters} setFilterState={onFiltersChange} />
                    </Box>
                )}
                <PersonTable
                    personData={personApiData.data}
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
                    persons={personApiData.data}
                    onSubmit={onSubmit}
                />
            </div>
        </QueryClientProvider>
    );
};

export default PersonIndex;
