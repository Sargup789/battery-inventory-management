import { Box, FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import ClearIcon from '@mui/icons-material/Clear';
import React from 'react';
import { UseQueryResult, useQuery } from 'react-query';
import { PersonFilters } from '@/pages/persons';

export interface PersonFiltersData {
    names: string[];
    designationDropdown: string[];
    designations: string[];
    emails: string[];
    phoneNumbers: string[];
    immediateBossDropdown: string[];
    immediateBosses: string[];
}

type Props = {
    filtersState: PersonFilters;
    setFilterState: (values: PersonFilters) => void;
}

const fetchFilterOptions = async (): Promise<PersonFiltersData> => {
    const response = await axios.get(`/api/router?path=api/persons/filters`);
    return response.data;
};

type FilterFormControlProps = {
    label: string;
    values: string[] | undefined;
    selectedValue: string | undefined;
    onFilterChange: (value: string) => void;
    onClearClick: () => void;
}

const FilterFormControl = ({ label, values, selectedValue, onFilterChange, onClearClick }: FilterFormControlProps) => (
    <FormControl sx={{ width: '50%', marginRight: '10px' }}>
        <InputLabel className="label" size='small'>{label}</InputLabel>
        <Select
            fullWidth
            size='small'
            label={label}
            onChange={(e: any) => onFilterChange(e.target.value)}
            value={selectedValue || ""}
            endAdornment={
                <IconButton sx={{ display: selectedValue ? "" : "none" }}
                    onClick={onClearClick}>
                    <ClearIcon />
                </IconButton>
            }>
            {values && values.map((value, index) =>
                <MenuItem key={index} value={value}>
                    {value}
                </MenuItem>
            )}
        </Select>
    </FormControl>
)

const PersonTableFilters = ({ filtersState, setFilterState }: Props) => {

    const {
        data: filters,
    }: UseQueryResult<PersonFiltersData, unknown> = useQuery(["personFilters"], () => fetchFilterOptions(), {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const handleFilterStateChange = (key: string, value: any) => {
        const newState: any = { ...filtersState };
        newState[key] = value;
        setFilterState(newState);
    }

    const handleClearClick = (key: string) => {
        const newState: any = { ...filtersState };
        newState[key] = undefined;
        setFilterState(newState);
    }

    return (
        <div style={{ padding: '10px' }}>
            <Box sx={{ display: 'flex', width: '100%' }}>
                <FilterFormControl
                    label="Name"
                    values={filters?.names}
                    selectedValue={filtersState?.name}
                    onFilterChange={(value) => handleFilterStateChange('name', value)}
                    onClearClick={() => handleClearClick('name')}
                />
                <FilterFormControl
                    label="Designation"
                    values={filters?.designations?.length ? filters.designations : filters?.designationDropdown}
                    selectedValue={filtersState?.designation}
                    onFilterChange={(value) => handleFilterStateChange('designation', value)}
                    onClearClick={() => handleClearClick('designation')}
                />
                <FilterFormControl
                    label="Email"
                    values={filters?.emails}
                    selectedValue={filtersState?.email}
                    onFilterChange={(value) => handleFilterStateChange('email', value)}
                    onClearClick={() => handleClearClick('email')}
                />
            </Box>
            <br />
            <Box sx={{ display: 'flex', width: '100%' }}>
                <FilterFormControl
                    label="Phone Number"
                    values={filters?.phoneNumbers}
                    selectedValue={filtersState?.phoneNumber}
                    onFilterChange={(value) => handleFilterStateChange('phoneNumber', value)}
                    onClearClick={() => handleClearClick('phoneNumber')}
                />
                <FilterFormControl
                    label="Immediate Boss"
                    values={filters?.immediateBosses?.length ? filters.immediateBosses : filters?.immediateBossDropdown}
                    selectedValue={filtersState?.immediateBoss}
                    onFilterChange={(value) => handleFilterStateChange('immediateBoss', value)}
                    onClearClick={() => handleClearClick('immediateBoss')}
                />
            </Box>
        </div>
    )
}

export default PersonTableFilters;
