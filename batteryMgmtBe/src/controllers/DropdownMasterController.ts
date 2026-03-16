import { Request, Response } from "express";
import * as service from "../services/DropdownMasterService";

export const createDropdown = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const dropdown = await service.createDropdown({ ...req.body, createdAt: now, updatedAt: now });
    res.json(dropdown);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDropdown = async (req: Request, res: Response) => {
  try {
    const dropdown = await service.getDropdown(req.params.dropdownName);
    if (!dropdown) return res.status(404).json({ error: "Dropdown not found" });
    res.json(dropdown);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllDropdowns = async (req: Request, res: Response) => {
  try {
    const dropdowns = await service.getAllDropdowns();
    res.json(dropdowns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDropdown = async (req: Request, res: Response) => {
  try {
    const dropdown = await service.updateDropdown(req.params.dropdownName, { ...req.body, updatedAt: new Date() });
    res.json(dropdown);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDropdown = async (req: Request, res: Response) => {
  try {
    await service.deleteDropdown(req.params.dropdownName);
    res.json({ message: "Dropdown deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
