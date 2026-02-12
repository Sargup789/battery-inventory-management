import { DropdownMasterRepository } from "..";
import { DropdownMaster } from "../entity/DropDownMaster";

export const createDropdown = async (
  dropdown: DropdownMaster
): Promise<DropdownMaster> => {
  if (!dropdown.options) dropdown.options = [];
  return await DropdownMasterRepository.save(dropdown);
};

export const deleteDropdown = async (dropdownName: string): Promise<void> => {
  await DropdownMasterRepository.delete({ dropdownName });
};

export const updateDropdown = async (
  dropdownName: string,
  dropdownData: Partial<DropdownMaster>
): Promise<DropdownMaster> => {
  const dropdown = await DropdownMasterRepository.findOne({
    where: { dropdownName },
  });
  if (!dropdown) throw new Error("Dropdown not found");
  const updatedDropdown = Object.assign(dropdown, dropdownData);
  return await DropdownMasterRepository.save(updatedDropdown);
};

export const getDropdown = async (
  dropdownName: string
): Promise<DropdownMaster | null> => {
  return await DropdownMasterRepository.findOne({
    where: { dropdownName },
  });
};

export const getAllDropdowns = async (): Promise<DropdownMaster[]> => {
  return await DropdownMasterRepository.find();
};
