import { ToolRepository } from "..";
import { Tool, ToolStatus } from "../entity/Tool";
import { ObjectId } from "mongodb";

// Generate 6 character alphanumeric Tool ID
const generateToolId = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const normalizeToolData = (toolData: Partial<Tool>): Partial<Tool> => {
  const normalized = { ...toolData } as any;

  if (!normalized.description && normalized.toolDescription) {
    normalized.description = normalized.toolDescription;
  }
  if (!normalized.toolDescription && normalized.description) {
    normalized.toolDescription = normalized.description;
  }

  if (!normalized.zoneId && normalized.assignedLocationId) {
    normalized.zoneId = normalized.assignedLocationId;
  }
  if (!normalized.assignedLocationId && normalized.zoneId) {
    normalized.assignedLocationId = normalized.zoneId;
  }

  if (!normalized.location && normalized.assignedLocation) {
    normalized.location = normalized.assignedLocation;
  }
  if (!normalized.assignedLocation && normalized.location) {
    normalized.assignedLocation = normalized.location;
  }

  return normalized;
};

const resolveToolByRef = async (toolRef: string): Promise<Tool | null> => {
  if (!toolRef) return null;

  if (ObjectId.isValid(toolRef)) {
    const byDocId = await ToolRepository.findOne({
      where: { _id: new ObjectId(toolRef) } as any,
    });
    if (byDocId) return byDocId;
  }

  return await ToolRepository.findOne({
    where: { toolId: toolRef },
  });
};

export const createTool = async (
  toolData: Partial<Tool>
): Promise<Tool> => {
  const normalizedData = normalizeToolData(toolData);
  const tool = new Tool(normalizedData);
  tool.toolId = normalizedData.toolId || generateToolId();
  tool.status = ToolStatus.Created;
  tool.createdAt = new Date();
  tool.updatedAt = new Date();
  return await ToolRepository.save(tool);
};

export const deleteTool = async (id: string): Promise<void> => {
  const tool = await resolveToolByRef(id);
  if (!tool) throw new Error("Tool not found");
  await ToolRepository.delete({ _id: (tool as any)._id } as any);
};

export const updateTool = async (
  id: string,
  toolData: Partial<Tool>
): Promise<Tool> => {
  const tool = await resolveToolByRef(id);
  if (!tool) throw new Error("Tool not found");
  const normalizedData = normalizeToolData(toolData);
  const updatedTool = Object.assign(tool, normalizedData);
  updatedTool.updatedAt = new Date();
  return await ToolRepository.save(updatedTool);
};

export const getTool = async (id: string): Promise<Tool | null> => {
  return await resolveToolByRef(id);
};

export const getToolByToolId = async (toolId: string): Promise<Tool | null> => {
  return await resolveToolByRef(toolId);
};

export const getToolByQrCodeId = async (
  qrCodeId: string
): Promise<Tool | null> => {
  return await ToolRepository.findOne({
    where: { qrCodeId },
  });
};

export const getAllTools = async (): Promise<Tool[]> => {
  return await ToolRepository.find();
};

export const assignTool = async (
  toolId: string,
  locationId: string,
  personId: string
): Promise<Tool> => {
  const tool = await getToolByToolId(toolId);
  if (!tool) throw new Error("Tool not found");

  tool.assignedLocationId = locationId;
  tool.zoneId = locationId;
  tool.assignedPersonId = personId;
  tool.assignedLocation = locationId;
  tool.assignedPerson = personId;
  tool.status = ToolStatus.Assigned;
  tool.updatedAt = new Date();

  return await ToolRepository.save(tool);
};

export const checkOutTool = async (
  toolRef: string,
  personId?: string
): Promise<Tool> => {
  const tool = await resolveToolByRef(toolRef);
  if (!tool) throw new Error("Tool not found");

  if (personId && tool.assignedPersonId && tool.assignedPersonId !== personId) {
    throw new Error("Only the assigned person can check out this tool");
  }

  tool.status = ToolStatus.InTransit;
  tool.zoneId = null;
  tool.location = null;
  tool.updatedAt = new Date();

  return await ToolRepository.save(tool);
};

export const checkInTool = async (
  toolRef: string,
  personId?: string,
  zoneId?: string,
  location?: string,
  isRetailReady?: boolean
): Promise<Tool> => {
  const tool = await resolveToolByRef(toolRef);
  if (!tool) throw new Error("Tool not found");

  if (personId && tool.assignedPersonId && tool.assignedPersonId !== personId) {
    throw new Error("Only the assigned person can check in this tool");
  }

  if (zoneId) {
    tool.zoneId = zoneId;
    tool.assignedLocationId = zoneId;
  }
  if (location) {
    tool.location = location;
    tool.assignedLocation = location;
  }
  if (typeof isRetailReady === "boolean") {
    tool.isRetailReady = isRetailReady;
  }

  tool.status = ToolStatus.CheckedIn;
  tool.updatedAt = new Date();

  return await ToolRepository.save(tool);
};

export const getToolStatus = async (toolId: string): Promise<Tool | null> => {
  return await getToolByToolId(toolId);
};
