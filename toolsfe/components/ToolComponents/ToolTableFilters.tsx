import { Box, FormControl, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import ClearIcon from '@mui/icons-material/Clear';
import React from 'react';
import { UseQueryResult, useQuery } from 'react-query';
import { ToolFilters } from '@/pages/tools';

export interface ToolFiltersData {
  statusData: string[];
  supplierDropdown: string[];
  suppliers: string[];
  assignedLocations: string[];
  assignedPersons: string[];
  partNumbers: string[];
  toolNames: string[];
}

type Props = {
  filtersState: ToolFilters;
  setFilterState: (values: ToolFilters) => void;
}

const fetchFilterOptions = async (): Promise<ToolFiltersData> => {
  const response = await axios.get(`/api/router?path=api/tools/filters`);
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

const ToolTableFilters = ({ filtersState, setFilterState }: Props) => {

  const {
    data: filters,
  }: UseQueryResult<ToolFiltersData, unknown> = useQuery(["toolFilters"], () => fetchFilterOptions(), {
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
          label="Status"
          values={filters?.statusData}
          selectedValue={filtersState?.status}
          onFilterChange={(value) => handleFilterStateChange('status', value)}
          onClearClick={() => handleClearClick('status')}
        />
        <FilterFormControl
          label="Supplier"
          values={filters?.suppliers?.length ? filters.suppliers : filters?.supplierDropdown}
          selectedValue={filtersState?.supplier}
          onFilterChange={(value) => handleFilterStateChange('supplier', value)}
          onClearClick={() => handleClearClick('supplier')}
        />
        <FilterFormControl
          label="Assigned Location"
          values={filters?.assignedLocations}
          selectedValue={filtersState?.assignedLocation}
          onFilterChange={(value) => handleFilterStateChange('assignedLocation', value)}
          onClearClick={() => handleClearClick('assignedLocation')}
        />
      </Box>
      <br />
      <Box sx={{ display: 'flex', width: '100%' }}>
        <FilterFormControl
          label="Assigned Person"
          values={filters?.assignedPersons}
          selectedValue={filtersState?.assignedPerson}
          onFilterChange={(value) => handleFilterStateChange('assignedPerson', value)}
          onClearClick={() => handleClearClick('assignedPerson')}
        />
        <FilterFormControl
          label="Part Number"
          values={filters?.partNumbers}
          selectedValue={filtersState?.partNumber}
          onFilterChange={(value) => handleFilterStateChange('partNumber', value)}
          onClearClick={() => handleClearClick('partNumber')}
        />
        <FilterFormControl
          label="Tool Name"
          values={filters?.toolNames}
          selectedValue={filtersState?.toolName}
          onFilterChange={(value) => handleFilterStateChange('toolName', value)}
          onClearClick={() => handleClearClick('toolName')}
        />
      </Box>
    </div>
  )
}

export default ToolTableFilters;
