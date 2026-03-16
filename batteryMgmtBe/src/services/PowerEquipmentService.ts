import { PowerEquipmentRepository, ZoneRepository, QRCodeRepository, EquipmentEventRepository } from "..";
import { PowerEquipment, EquipmentStatus } from "../entity/PowerEquipment";
import { EquipmentEvent } from "../entity/EquipmentEvent";
import { ObjectId } from "mongodb";

const generateEquipmentId = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const toEntityId = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value?.toHexString === "function") return value.toHexString();
  if (typeof value?.toString === "function") return value.toString();
  if (typeof value?.$oid === "string") return value.$oid;
  return "";
};

const resolveEquipmentByRef = async (ref: string): Promise<PowerEquipment | null> => {
  if (!ref) return null;
  if (ObjectId.isValid(ref)) {
    const byDocId = await PowerEquipmentRepository.findOne({ where: { _id: new ObjectId(ref) } as any });
    if (byDocId) return byDocId;
  }
  return await PowerEquipmentRepository.findOne({ where: { equipmentId: ref } });
};

const resolveQrCode = async (qrCodeRef?: string): Promise<{ code: string; id: string } | null> => {
  if (!qrCodeRef) return null;
  const byCode = await QRCodeRepository.findOne({ where: { code: qrCodeRef } });
  if (byCode) {
    const qrId = toEntityId((byCode as any)._id);
    return { code: (byCode as any).code, id: qrId };
  }
  if (ObjectId.isValid(qrCodeRef)) {
    const byId = await QRCodeRepository.findOne({ where: { _id: new ObjectId(qrCodeRef) } as any });
    if (byId) {
      return { code: (byId as any).code, id: toEntityId((byId as any)._id) };
    }
  }
  return null;
};

const logEvent = async (equipmentId: string, eventType: string, data: Partial<EquipmentEvent>) => {
  const event = new EquipmentEvent();
  event.equipmentId = equipmentId;
  event.eventType = eventType;
  event.zoneId = data.zoneId || null;
  event.zoneName = data.zoneName || null;
  event.location = data.location || null;
  event.checkoutReason = data.checkoutReason || null;
  event.performedBy = data.performedBy || null;
  event.createdAt = new Date();
  await EquipmentEventRepository.save(event);
};

export const createEquipment = async (data: Partial<PowerEquipment>): Promise<PowerEquipment> => {
  const equipment = new PowerEquipment(data);
  const qr = await resolveQrCode(data.qrCodeId);
  equipment.equipmentId = data.equipmentId || generateEquipmentId();
  equipment.status = EquipmentStatus.Created;
  equipment.qrCodeId = qr?.code || data.qrCodeId || null;
  equipment.createdAt = new Date();
  equipment.updatedAt = new Date();

  const saved = await PowerEquipmentRepository.save(equipment);

  if (qr?.code) {
    const qrDoc = await QRCodeRepository.findOne({ where: { code: qr.code } });
    if (qrDoc && !(qrDoc as any).inUse) {
      (qrDoc as any).inUse = true;
      await QRCodeRepository.save(qrDoc as any);
    }
  }

  await logEvent(equipment.equipmentId, "created", { performedBy: data.lastUpdatedBy });
  return saved;
};

export const deleteEquipment = async (id: string): Promise<void> => {
  const equipment = await resolveEquipmentByRef(id);
  if (!equipment) throw new Error("Equipment not found");
  await PowerEquipmentRepository.deleteOne({ _id: (equipment as any)._id });
};

export const updateEquipment = async (id: string, data: Partial<PowerEquipment>): Promise<PowerEquipment> => {
  const equipment = await resolveEquipmentByRef(id);
  if (!equipment) throw new Error("Equipment not found");
  const updated = Object.assign(equipment, data);
  updated.updatedAt = new Date();
  return await PowerEquipmentRepository.save(updated);
};

export const getEquipment = async (id: string): Promise<PowerEquipment | null> => {
  return await resolveEquipmentByRef(id);
};

export const getEquipmentByQrCode = async (qrCodeId: string): Promise<PowerEquipment | null> => {
  const direct = await PowerEquipmentRepository.findOne({ where: { qrCodeId } });
  if (direct) return direct;
  const qr = await resolveQrCode(qrCodeId);
  if (!qr) return null;
  return await PowerEquipmentRepository.findOne({ where: { qrCodeId: qr.code } });
};

export interface EquipmentFilters {
  status?: string;
  itemType?: string;
  manufacturer?: string;
  assignedTo?: string;
  search?: string;
}

export const getAllEquipment = async (
  page: number = 1,
  size: number = 10,
  filters: EquipmentFilters = {}
): Promise<{ data: PowerEquipment[]; totalCount: number }> => {
  const where: Record<string, any> = {};
  if (filters.status) where.status = filters.status;
  if (filters.itemType) where.itemType = { $regex: filters.itemType, $options: "i" };
  if (filters.manufacturer) where.manufacturer = { $regex: filters.manufacturer, $options: "i" };
  if (filters.assignedTo) where.assignedTo = { $regex: filters.assignedTo, $options: "i" };
  if (filters.search) {
    const regex = { $regex: filters.search, $options: "i" };
    where.$or = [
      { equipmentId: regex },
      { modelNumber: regex },
      { serialNumber: regex },
      { manufacturer: regex },
      { itemType: regex },
      { assignedTo: regex },
      { customerName: regex },
    ];
  }

  const [data, totalCount] = await Promise.all([
    PowerEquipmentRepository.find({ where, skip: (page - 1) * size, take: size, order: { updatedAt: "DESC" } }),
    PowerEquipmentRepository.count(where),
  ]);

  return { data, totalCount };
};

export const getEquipmentFilterOptions = async (): Promise<any> => {
  const statuses = await PowerEquipmentRepository.distinct("status", {});
  const itemTypes = await PowerEquipmentRepository.distinct("itemType", {});
  const manufacturers = await PowerEquipmentRepository.distinct("manufacturer", {});

  return {
    statuses: statuses.filter(Boolean),
    itemTypes: itemTypes.filter(Boolean),
    manufacturers: manufacturers.filter(Boolean),
  };
};

export const checkOutEquipment = async (
  ref: string,
  checkoutReason: string,
  username?: string
): Promise<PowerEquipment> => {
  const equipment = await resolveEquipmentByRef(ref);
  if (!equipment) throw new Error("Equipment not found");

  equipment.status = checkoutReason; // status IS the checkout reason
  equipment.checkoutReason = checkoutReason;
  equipment.zoneId = null;
  equipment.zoneName = null;
  equipment.location = null;
  equipment.updatedAt = new Date();
  if (username) equipment.lastUpdatedBy = username;

  await logEvent(equipment.equipmentId, "checked-out", { checkoutReason, performedBy: username });
  return await PowerEquipmentRepository.save(equipment);
};

export const checkInEquipment = async (
  ref: string,
  zoneId?: string,
  location?: string,
  username?: string
): Promise<PowerEquipment> => {
  const equipment = await resolveEquipmentByRef(ref);
  if (!equipment) throw new Error("Equipment not found");

  let zoneName = "";
  let zoneLocationType = "";
  let zoneCity = "";
  let zoneState = "";

  if (zoneId && ObjectId.isValid(zoneId)) {
    const zone = await ZoneRepository.findOne({ where: { _id: new ObjectId(zoneId) } as any });
    if (zone) {
      zoneName = (zone as any).name || "";
      zoneLocationType = (zone as any).locationType || "";
      zoneCity = (zone as any).city || "";
      zoneState = (zone as any).state || "";
    }
  }

  if (zoneId) {
    equipment.zoneId = zoneId;
    equipment.zoneName = zoneName;
    equipment.zoneLocationType = zoneLocationType;
    equipment.zoneCity = zoneCity;
    equipment.zoneState = zoneState;
  }
  if (location !== undefined) equipment.location = location;

  equipment.status = EquipmentStatus.CheckedIn;
  equipment.checkoutReason = null;
  equipment.updatedAt = new Date();
  if (username) equipment.lastUpdatedBy = username;

  await logEvent(equipment.equipmentId, "checked-in", { zoneId, zoneName, location, performedBy: username });
  return await PowerEquipmentRepository.save(equipment);
};

export const getEquipmentStatus = async (ref: string): Promise<{ equipment: PowerEquipment; events: EquipmentEvent[] } | null> => {
  const equipment = await resolveEquipmentByRef(ref);
  if (!equipment) return null;
  const events = await EquipmentEventRepository.find({ where: { equipmentId: equipment.equipmentId } as any });
  return { equipment, events };
};
