import { LocationRepository, ToolRepository } from "..";
import { Location } from "../entity/Location";
import { ObjectId } from "mongodb";

const toEntityId = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value?.toHexString === "function") return value.toHexString();
  if (typeof value?.toString === "function") return value.toString();
  if (typeof value?.$oid === "string") return value.$oid;
  return "";
};

export const createLocation = async (
  locationData: Partial<Location>
): Promise<Location> => {
  const location = new Location(locationData);
  location.createdAt = new Date();
  location.updatedAt = new Date();
  return await LocationRepository.save(location);
};

export const deleteLocation = async (id: string): Promise<void> => {
  await LocationRepository.delete({ _id: new ObjectId(id) } as any);
};

export const updateLocation = async (
  id: string,
  locationData: Partial<Location>
): Promise<Location> => {
  const location = await LocationRepository.findOne({
    where: { _id: new ObjectId(id) } as any,
  });
  if (!location) throw new Error("Location not found");
  const updatedLocation = Object.assign(location, locationData);
  updatedLocation.updatedAt = new Date();
  return await LocationRepository.save(updatedLocation);
};

export const getLocation = async (id: string): Promise<Location | null> => {
  const location = await LocationRepository.findOne({
    where: { _id: new ObjectId(id) } as any,
  });
  if (!location) return null;

  const locationId = toEntityId((location as any)._id || (location as any).id);
  const toolsCount = await ToolRepository.count({
    where: { assignedLocationId: locationId } as any,
  });

  return {
    ...(location as any),
    toolsCount,
  } as Location;
};

export const getAllLocations = async (): Promise<Location[]> => {
  const locations = await LocationRepository.find();
  if (!locations.length) return [];

  const allTools = await ToolRepository.find();
  const locationToolCountMap = new Map<string, number>();

  allTools.forEach((tool: any) => {
    const assignedLocationId = toEntityId(tool?.assignedLocationId);
    if (!assignedLocationId) return;
    locationToolCountMap.set(
      assignedLocationId,
      (locationToolCountMap.get(assignedLocationId) || 0) + 1
    );
  });

  return locations.map((location: any) => {
    const locationId = toEntityId(location?._id || location?.id);
    return {
      ...location,
      toolsCount: locationToolCountMap.get(locationId) || 0,
    };
  }) as Location[];
};

export const getAvailableLocations = async (id: string): Promise<string[]> => {
  const location = await getLocation(id);
  if (!location) throw new Error("Location not found");

  const prefix = (location.name || "LOC")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);

  return [`${prefix}-01`, `${prefix}-02`, `${prefix}-03`];
};
