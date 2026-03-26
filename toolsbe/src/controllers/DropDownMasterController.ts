import { Request, Response } from "express";
import * as DropdownMasterService from "../services/DropdownMasterService";

export const createDropdown = async (req: Request, res: Response) => {
  try {
    const dropdown = req.body;
    const newDropdown = await DropdownMasterService.createDropdown(dropdown);
    res.json(newDropdown);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDropdown = async (req: Request, res: Response) => {
  try {
    const { dropdownName } = req.params;
    const dropdownData = req.body;
    const updatedDropdown = await DropdownMasterService.updateDropdown(
      dropdownName,
      dropdownData
    );
    res.json(updatedDropdown);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllDropdowns = async (req: Request, res: Response) => {
  try {
    const dropdowns = await DropdownMasterService.getAllDropdowns();
    res.json(dropdowns);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getDropdown = async (req: Request, res: Response) => {
  try {
    const { dropdownName } = req.params;
    const dropdown = await DropdownMasterService.getDropdown(dropdownName);
    if (!dropdown) return res.status(404).json({ error: "Dropdown not found" });
    res.json(dropdown);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDropdown = async (req: Request, res: Response) => {
  try {
    const { dropdownName } = req.params;
    await DropdownMasterService.deleteDropdown(dropdownName);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
