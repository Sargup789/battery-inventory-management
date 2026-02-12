import { Request, Response } from "express";
import * as toolService from "../services/ToolService";

export const createTool = async (req: Request, res: Response) => {
  try {
    const tool = await toolService.createTool(req.body);
    res.json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTool = async (req: Request, res: Response) => {
  try {
    const tool = await toolService.getTool(req.params.id);
    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }
    res.json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllTools = async (req: Request, res: Response) => {
  try {
    const tools = await toolService.getAllTools();
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateTool = async (req: Request, res: Response) => {
  try {
    const tool = await toolService.updateTool(req.params.id, req.body);
    res.json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTool = async (req: Request, res: Response) => {
  try {
    await toolService.deleteTool(req.params.id);
    res.json({ message: "Tool deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const assignTool = async (req: Request, res: Response) => {
  try {
    const { toolId, locationId, personId } = req.body;
    const tool = await toolService.assignTool(toolId, locationId, personId);
    res.json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const checkOutTool = async (req: Request, res: Response) => {
  try {
    const toolId = req.body.toolId || req.body.id;
    const { personId } = req.body;
    const tool = await toolService.checkOutTool(toolId, personId);
    res.json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const checkInTool = async (req: Request, res: Response) => {
  try {
    const toolId = req.body.toolId || req.body.id;
    const { personId, zoneId, location, isRetailReady } = req.body;
    const retailReadyValue =
      typeof isRetailReady === "string"
        ? isRetailReady.toLowerCase() === "true"
        : isRetailReady;
    const tool = await toolService.checkInTool(
      toolId,
      personId,
      zoneId,
      location,
      retailReadyValue
    );
    res.json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getToolStatus = async (req: Request, res: Response) => {
  try {
    const { toolId } = req.params;
    const tool = await toolService.getToolStatus(toolId);
    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }
    res.json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getToolByQrCode = async (req: Request, res: Response) => {
  try {
    const tool = await toolService.getToolByQrCodeId(req.params.qrCodeId);
    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    res.json({
      ...tool,
      zoneId: (tool as any).zoneId || (tool as any).assignedLocationId || null,
      location: (tool as any).location || (tool as any).assignedLocation || null,
      toolDescription: (tool as any).toolDescription || (tool as any).description,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
