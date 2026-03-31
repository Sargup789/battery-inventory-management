import { ZoneRepository, PowerEquipmentRepository } from "..";
import { Zone } from "../entity/Zone";
import { ObjectId } from "mongodb";

const toEntityId = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value?.toHexString === "function") return value.toHexString();
  if (typeof value?.toString === "function") return value.toString();
  if (typeof value?.$oid === "string") return value.$oid;
  return "";
};

export const createZone = async (zoneData: Partial<Zone>): Promise<Zone> => {
  const zone = new Zone(zoneData);
  zone.createdAt = new Date();
  zone.updatedAt = new Date();
  return await ZoneRepository.save(zone);
};

export const deleteZone = async (id: string): Promise<void> => {
  const zone = await ZoneRepository.findOne({ where: { _id: new ObjectId(id) } as any });
  if (!zone) throw new Error("Zone not found");
  await ZoneRepository.remove(zone);
};

export const updateZone = async (id: string, zoneData: Partial<Zone>): Promise<Zone> => {
  const zone = await ZoneRepository.findOne({ where: { _id: new ObjectId(id) } as any });
  if (!zone) throw new Error("Zone not found");
  const updatedZone = Object.assign(zone, zoneData);
  updatedZone.updatedAt = new Date();
  return await ZoneRepository.save(updatedZone);
};

export const getZone = async (id: string): Promise<Zone | null> => {
  const zone = await ZoneRepository.findOne({ where: { _id: new ObjectId(id) } as any });
  if (!zone) return null;
  const zoneId = toEntityId((zone as any)._id || (zone as any).id);
  const equipmentCount = await PowerEquipmentRepository.count({ where: { zoneId } as any });
  return { ...(zone as any), equipmentCount } as Zone;
};

export interface ZoneFilters {
  name?: string;
  locationType?: string;
  city?: string;
  state?: string;
}

export const getAllZones = async (
  page: number = 1,
  size: number = 100,
  filters: ZoneFilters = {}
): Promise<{ data: any[]; totalCount: number }> => {
  const where: Record<string, any> = {};
  if (filters.name) where.name = { $regex: filters.name, $options: "i" };
  if (filters.locationType) where.locationType = { $regex: filters.locationType, $options: "i" };
  if (filters.city) where.city = { $regex: filters.city, $options: "i" };
  if (filters.state) where.state = { $regex: filters.state, $options: "i" };

  const zones = await ZoneRepository.find({ where, skip: (page - 1) * size, take: size, order: { updatedAt: "DESC" } });
  const totalCount = await ZoneRepository.count(where);

  if (!zones.length) return { data: [], totalCount };

  const allEquipment = await PowerEquipmentRepository.find();
  const zoneEquipmentMap = new Map<string, number>();
  allEquipment.forEach((eq: any) => {
    const zId = toEntityId(eq?.zoneId);
    if (!zId) return;
    zoneEquipmentMap.set(zId, (zoneEquipmentMap.get(zId) || 0) + 1);
  });

  // Build sub-zones map
  const subZonesMap = new Map<string, any[]>();
  zones.forEach((zone: any) => {
    if (zone.parentZoneId) {
      const parentId = zone.parentZoneId;
      if (!subZonesMap.has(parentId)) subZonesMap.set(parentId, []);
      subZonesMap.get(parentId).push(zone);
    }
  });

  const data = zones.map((zone: any) => {
    const zId = toEntityId(zone?._id || zone?.id);
    const subZones = subZonesMap.get(zId) || [];
    return {
      ...zone,
      equipmentCount: zoneEquipmentMap.get(zId) || 0,
      subZones: subZones.map((sz: any) => {
        const szId = toEntityId(sz?._id || sz?.id);
        return { ...sz, equipmentCount: zoneEquipmentMap.get(szId) || 0 };
      }),
    };
  });

  return { data, totalCount };
};
