import { Box, FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import ClearIcon from '@mui/icons-material/Clear';
import React from 'react';
import { useTranslation } from 'next-i18next';
import { UseQueryResult, useQuery } from 'react-query';
import { LocationFilters } from '@/pages/location';

export interface LocationFiltersData {
    locationNameDropdown: string[];
    names: string[];
    locationTypeDropdown: string[];
    types: string[];
    cityDropdown: string[];
    cities: string[];
    stateDropdown: string[];
    states: string[];
}

type Props = {
    filtersState: LocationFilters;
    setFilterState: (values: LocationFilters) => void;
}

const fetchFilterOptions = async (): Promise<LocationFiltersData> => {
    const response = await axios.get(`/api/router?path=api/locations/filters`);
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

const LocationTableFilters = ({ filtersState, setFilterState }: Props) => {
    const { t } = useTranslation('common');

    const {
        data: filters,
    }: UseQueryResult<LocationFiltersData, unknown> = useQuery(["locationFilters"], () => fetchFilterOptions(), {
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
                    label={t('common.name')}
                    values={filters?.names?.length ? filters.names : filters?.locationNameDropdown}
                    selectedValue={filtersState?.name}
                    onFilterChange={(value) => handleFilterStateChange('name', value)}
                    onClearClick={() => handleClearClick('name')}
                />
                <FilterFormControl
                    label={t('common.type')}
                    values={filters?.types?.length ? filters.types : filters?.locationTypeDropdown}
                    selectedValue={filtersState?.type}
                    onFilterChange={(value) => handleFilterStateChange('type', value)}
                    onClearClick={() => handleClearClick('type')}
                />
                <FilterFormControl
                    label={t('common.city')}
                    values={filters?.cities?.length ? filters.cities : filters?.cityDropdown}
                    selectedValue={filtersState?.city}
                    onFilterChange={(value) => handleFilterStateChange('city', value)}
                    onClearClick={() => handleClearClick('city')}
                />
                <FilterFormControl
                    label={t('common.state')}
                    values={filters?.states?.length ? filters.states : filters?.stateDropdown}
                    selectedValue={filtersState?.state}
                    onFilterChange={(value) => handleFilterStateChange('state', value)}
                    onClearClick={() => handleClearClick('state')}
                />
            </Box>
        </div>
    )
}

export default LocationTableFilters;
