import {
  LocationRepository,
  PersonRepository,
  QRCodeRepository,
  ToolRepository,
} from "..";
import { Tool, ToolStatus } from "../entity/Tool";
import { ObjectId } from "mongodb";
import { getDropdown } from "./DropdownMasterService";

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

const resolveQrCode = async (
  qrCodeRef?: string
): Promise<{ code: string; id: string } | null> => {
  if (!qrCodeRef) return null;

  const byCode = await QRCodeRepository.findOne({
    where: { code: qrCodeRef },
  });
  if (byCode) {
    const qrId =
      typeof (byCode as any)?._id?.toHexString === "function"
        ? (byCode as any)._id.toHexString()
        : String((byCode as any)?._id || "");
    return { code: (byCode as any).code, id: qrId };
  }

  if (ObjectId.isValid(qrCodeRef)) {
    const byId = await QRCodeRepository.findOne({
      where: { _id: new ObjectId(qrCodeRef) } as any,
    });
    if (byId) {
      const qrId =
        typeof (byId as any)?._id?.toHexString === "function"
          ? (byId as any)._id.toHexString()
          : String((byId as any)?._id || "");
      return { code: (byId as any).code, id: qrId };
    }
  }

  return null;
};

export const createTool = async (
  toolData: Partial<Tool>
): Promise<Tool> => {
  const normalizedData = normalizeToolData(toolData);
  const tool = new Tool(normalizedData);
  const qr = await resolveQrCode(normalizedData.qrCodeId);
  tool.toolId = normalizedData.toolId || generateToolId();
  tool.status = ToolStatus.Created;
  tool.createdAt = new Date();
  tool.updatedAt = new Date();
  // Persist QR code value so scanner text (code) resolves tool directly.
  tool.qrCodeId = qr?.code || normalizedData.qrCodeId || null;
  const savedTool = await ToolRepository.save(tool);

  if (qr?.code) {
    const qrDoc = await QRCodeRepository.findOne({ where: { code: qr.code } });
    if (qrDoc && !(qrDoc as any).inUse) {
      (qrDoc as any).inUse = true;
      await QRCodeRepository.save(qrDoc as any);
    }
  }

  return savedTool;
};

export const deleteTool = async (id: string): Promise<void> => {
  const tool = await resolveToolByRef(id);
  if (!tool) throw new Error("Tool not found");
  await ToolRepository.deleteOne({ _id: (tool as any)._id });
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
  const directMatch = await ToolRepository.findOne({
    where: { qrCodeId },
  });
  if (directMatch) return directMatch;

  const qr = await resolveQrCode(qrCodeId);
  if (!qr) return null;

  const byResolvedCode = await ToolRepository.findOne({
    where: { qrCodeId: qr.code },
  });
  if (byResolvedCode) return byResolvedCode;

  return await ToolRepository.findOne({
    where: { qrCodeId: qr.id },
  });
};

export interface ToolFilters {
  status?: string;
  supplier?: string;
  assignedLocation?: string;
  assignedPerson?: string;
  partNumber?: string;
  toolName?: string;
  search?: string;
}

export const getAllTools = async (
  page: number = 1,
  size: number = 10,
  filters: ToolFilters = {}
): Promise<{ data: Tool[]; totalCount: number }> => {
  const where: Record<string, any> = {};

  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.supplier) {
    where.supplier = { $regex: filters.supplier, $options: "i" };
  }
  if (filters.assignedLocation) {
    where.assignedLocation = { $regex: filters.assignedLocation, $options: "i" };
  }
  if (filters.assignedPerson) {
    where.assignedPerson = { $regex: filters.assignedPerson, $options: "i" };
  }
  if (filters.partNumber) {
    where.partNumber = { $regex: filters.partNumber, $options: "i" };
  }
  if (filters.toolName) {
    where.toolName = { $regex: filters.toolName, $options: "i" };
  }
  if (filters.search) {
    const searchRegex = { $regex: filters.search, $options: "i" };
    where.$or = [
      { toolId: searchRegex },
      { toolName: searchRegex },
      { partNumber: searchRegex },
      { toolDescription: searchRegex },
      { assignedPerson: searchRegex },
      { assignedLocation: searchRegex },
    ];
  }

  const [data, totalCount] = await Promise.all([
    ToolRepository.find({
      where,
      skip: (page - 1) * size,
      take: size,
      order: { updatedAt: "DESC" },
    }),
    ToolRepository.count(where),
  ]);

  return { data, totalCount };
};

export const getToolFilterOptions = async (): Promise<any> => {
  const supplierData = await getDropdown("supplier");
  const statusData = await ToolRepository.distinct("status", {});
  const assignedLocations = await ToolRepository.distinct("assignedLocation", {});
  const assignedPersons = await ToolRepository.distinct("assignedPerson", {});
  const partNumbers = await ToolRepository.distinct("partNumber", {});
  const toolNames = await ToolRepository.distinct("toolName", {});
  const suppliers = await ToolRepository.distinct("supplier", {});

  return {
    statusData: statusData.filter(Boolean),
    supplierDropdown: supplierData?.options?.map((o: any) => o.key) || [],
    suppliers: suppliers.filter(Boolean),
    assignedLocations: assignedLocations.filter(Boolean),
    assignedPersons: assignedPersons.filter(Boolean),
    partNumbers: partNumbers.filter(Boolean),
    toolNames: toolNames.filter(Boolean),
  };
};

export const assignTool = async (
  toolId: string,
  locationId: string,
  personId: string,
  username?: string
): Promise<Tool> => {
  const tool = await getToolByToolId(toolId);
  if (!tool) throw new Error("Tool not found");

  const location =
    ObjectId.isValid(locationId)
      ? await LocationRepository.findOne({
          where: { _id: new ObjectId(locationId) } as any,
        })
      : null;
  const person =
    ObjectId.isValid(personId)
      ? await PersonRepository.findOne({
          where: { _id: new ObjectId(personId) } as any,
        })
      : null;

  tool.assignedLocationId = locationId;
  tool.zoneId = locationId;
  tool.assignedPersonId = personId;
  tool.assignedLocation = (location as any)?.name || locationId;
  tool.assignedLocationType = (location as any)?.type || "";
  tool.assignedLocationCity = (location as any)?.city || "";
  tool.assignedLocationState = (location as any)?.state || "";
  tool.assignedPerson = (person as any)?.name || personId;
  tool.assignedPersonDesignation = (person as any)?.designation || "";
  tool.assignedPersonEmail =
    (person as any)?.emailId || (person as any)?.email || "";
  tool.assignedPersonPhoneNumber = (person as any)?.phoneNumber || "";
  tool.status = ToolStatus.Assigned;
  tool.updatedAt = new Date();
  if (username) tool.lastUpdatedBy = username;

  return await ToolRepository.save(tool);
};

export const checkOutTool = async (
  toolRef: string,
  personId?: string,
  username?: string
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
  if (username) tool.lastUpdatedBy = username;

  return await ToolRepository.save(tool);
};

export const checkInTool = async (
  toolRef: string,
  personId?: string,
  zoneId?: string,
  location?: string,
  isRetailReady?: boolean,
  username?: string
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
  if (username) tool.lastUpdatedBy = username;

  return await ToolRepository.save(tool);
};

export const getToolStatus = async (toolId: string): Promise<Tool | null> => {
  return await getToolByToolId(toolId);
};
