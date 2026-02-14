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

const normalizeKey = (value: string): string =>
  (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");

export const ensureRequiredDropdownMasters = async (): Promise<void> => {
  const required = [
    { dropdownName: "supplier", dropdownLabel: "Supplier" },
    { dropdownName: "locationName", dropdownLabel: "Location Name" },
    { dropdownName: "locationType", dropdownLabel: "Location Type" },
    { dropdownName: "city", dropdownLabel: "City" },
    { dropdownName: "state", dropdownLabel: "State" },
    { dropdownName: "designation", dropdownLabel: "Designation" },
  ];

  const existing = await DropdownMasterRepository.find();
  const existingKeys = new Set<string>();

  existing.forEach((item) => {
    existingKeys.add(normalizeKey(item.dropdownName));
    existingKeys.add(normalizeKey(item.dropdownLabel));
  });

  const now = new Date();
  const toCreate: Partial<DropdownMaster>[] = required
    .filter((item) => {
      const nameKey = normalizeKey(item.dropdownName);
      const labelKey = normalizeKey(item.dropdownLabel);
      return !existingKeys.has(nameKey) && !existingKeys.has(labelKey);
    })
    .map((item) => ({
      ...item,
      options: [],
      createdAt: now,
      updatedAt: now,
    }));

  if (toCreate.length > 0) {
    await DropdownMasterRepository.save(toCreate as DropdownMaster[]);
  }
};
