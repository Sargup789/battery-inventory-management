import { Request, Response } from "express";
import * as service from "../services/ZoneService";

export const createZone = async (req: Request, res: Response) => {
  try {
    const zone = await service.createZone(req.body);
    res.json(zone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getZone = async (req: Request, res: Response) => {
  try {
    const zone = await service.getZone(req.params.id);
    if (!zone) return res.status(404).json({ error: "Zone not found" });
    res.json(zone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllZones = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 100;
    const filters: service.ZoneFilters = {};
    if (req.query.name) filters.name = req.query.name as string;
    if (req.query.locationType) filters.locationType = req.query.locationType as string;
    if (req.query.city) filters.city = req.query.city as string;
    if (req.query.state) filters.state = req.query.state as string;

    const result = await service.getAllZones(page, size, filters);
    res.json({ data: result.data, totalCount: result.totalCount, currentPage: page, pageSize: size });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateZone = async (req: Request, res: Response) => {
  try {
    const zone = await service.updateZone(req.params.id, req.body);
    res.json(zone);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteZone = async (req: Request, res: Response) => {
  try {
    await service.deleteZone(req.params.id);
    res.json({ message: "Zone deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
