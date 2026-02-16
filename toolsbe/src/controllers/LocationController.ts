import { Request, Response } from "express";
import * as locationService from "../services/LocationService";

export const createLocation = async (req: Request, res: Response) => {
  try {
    const location = await locationService.createLocation(req.body);
    res.json(location);
  } catch (err) {
    if (err.message === "DUPLICATE_LOCATION") {
      return res.status(409).json({ error: "This location already exists" });
    }
    res.status(500).json({ error: err.message });
  }
};

export const getLocation = async (req: Request, res: Response) => {
  try {
    const location = await locationService.getLocation(req.params.id);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllLocations = async (req: Request, res: Response) => {
  try {
    const locations = await locationService.getAllLocations();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const location = await locationService.updateLocation(req.params.id, req.body);
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteLocation = async (req: Request, res: Response) => {
  try {
    await locationService.deleteLocation(req.params.id);
    res.json({ message: "Location deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAvailableLocations = async (req: Request, res: Response) => {
  try {
    const locations = await locationService.getAvailableLocations(req.params.id);
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
