import { Request, Response } from "express";
import * as service from "../services/PowerEquipmentService";

export const createEquipment = async (req: Request & { user?: any }, res: Response) => {
  try {
    const equipment = await service.createEquipment({ ...req.body, lastUpdatedBy: req.user?.username || "" });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEquipment = async (req: Request, res: Response) => {
  try {
    const equipment = await service.getEquipment(req.params.id);
    if (!equipment) return res.status(404).json({ error: "Equipment not found" });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllEquipment = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;
    const filters: service.EquipmentFilters = {};
    if (req.query.status) filters.status = req.query.status as string;
    if (req.query.itemType) filters.itemType = req.query.itemType as string;
    if (req.query.manufacturer) filters.manufacturer = req.query.manufacturer as string;
    if (req.query.assignedTo) filters.assignedTo = req.query.assignedTo as string;
    if (req.query.search) filters.search = req.query.search as string;

    const result = await service.getAllEquipment(page, size, filters);
    res.json({ data: result.data, totalCount: result.totalCount, currentPage: page, pageSize: size });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEquipment = async (req: Request & { user?: any }, res: Response) => {
  try {
    const equipment = await service.updateEquipment(req.params.id, { ...req.body, lastUpdatedBy: req.user?.username || "" });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEquipment = async (req: Request, res: Response) => {
  try {
    await service.deleteEquipment(req.params.id);
    res.json({ message: "Equipment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const checkOutEquipment = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { equipmentId, checkoutReason } = req.body;
    if (!checkoutReason) return res.status(400).json({ error: "checkoutReason is required" });
    const equipment = await service.checkOutEquipment(equipmentId, checkoutReason, req.user?.username);
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const checkInEquipment = async (req: Request & { user?: any }, res: Response) => {
  try {
    const { equipmentId, zoneId, location } = req.body;
    const equipment = await service.checkInEquipment(equipmentId, zoneId, location, req.user?.username);
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEquipmentByQrCode = async (req: Request, res: Response) => {
  try {
    const equipment = await service.getEquipmentByQrCode(req.params.qrCodeId);
    if (!equipment) return res.status(404).json({ error: "Equipment not found" });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEquipmentFilterOptions = async (req: Request, res: Response) => {
  try {
    const options = await service.getEquipmentFilterOptions();
    res.json(options);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEquipmentStatus = async (req: Request, res: Response) => {
  try {
    const result = await service.getEquipmentStatus(req.params.ref);
    if (!result) return res.status(404).json({ error: "Equipment not found" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
