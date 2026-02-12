export interface DropdownMaster {
  id: string;
  dropdownName: string;
  dropdownLabel: string;
  options: DropdownOption[];
  createdAt: Date;
  updatedAt: Date;
}
export interface DropdownOption {
  key: string;
  label: string;
}
export interface Checklist {
  id: string;
  question: string;
  options: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
