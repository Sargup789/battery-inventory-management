export interface DropdownOption {
    key: string;
    label: string;
}

export interface DropdownMaster {
    dropdownName: string;
    dropdownLabel: string;
    options: DropdownOption[];
}
