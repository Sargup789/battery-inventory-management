import { LocationRepository, ToolRepository } from "..";
import { Location } from "../entity/Location";
import { ObjectId } from "mongodb";
import { getDropdown } from "./DropdownMasterService";

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
  const existing = await LocationRepository.findOne({
    where: {
      name: locationData.name,
      type: locationData.type,
      city: locationData.city,
      state: locationData.state,
    } as any,
  });
  if (existing) {
    throw new Error("DUPLICATE_LOCATION");
  }
  const location = new Location(locationData);
  location.createdAt = new Date();
  location.updatedAt = new Date();
  return await LocationRepository.save(location);
};

export const deleteLocation = async (id: string): Promise<void> => {
  await LocationRepository.deleteOne({ _id: new ObjectId(id) });
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

export interface LocationFilters {
  name?: string;
  type?: string;
  city?: string;
  state?: string;
}

export const getAllLocations = async (
  page: number = 1,
  size: number = 10,
  filters: LocationFilters = {}
): Promise<{ data: Location[]; totalCount: number }> => {
  const where: Record<string, any> = {};

  if (filters.name) {
    where.name = { $regex: filters.name, $options: "i" };
  }
  if (filters.type) {
    where.type = { $regex: filters.type, $options: "i" };
  }
  if (filters.city) {
    where.city = { $regex: filters.city, $options: "i" };
  }
  if (filters.state) {
    where.state = { $regex: filters.state, $options: "i" };
  }

  const locations = await LocationRepository.find({
    where,
    skip: (page - 1) * size,
    take: size,
    order: { updatedAt: "DESC" },
  });
  const totalCount = await LocationRepository.count(where);

  if (!locations.length) return { data: [], totalCount };

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

  const data = locations.map((location: any) => {
    const locationId = toEntityId(location?._id || location?.id);
    return {
      ...location,
      toolsCount: locationToolCountMap.get(locationId) || 0,
    };
  }) as Location[];

  return { data, totalCount };
};

export const getLocationFilterOptions = async (): Promise<any> => {
  const locationNameData = await getDropdown("locationName");
  const locationTypeData = await getDropdown("locationType");
  const cityData = await getDropdown("city");
  const stateData = await getDropdown("state");
  const names = await LocationRepository.distinct("name", {});
  const types = await LocationRepository.distinct("type", {});
  const cities = await LocationRepository.distinct("city", {});
  const states = await LocationRepository.distinct("state", {});

  return {
    locationNameDropdown: locationNameData?.options?.map((o: any) => o.key) || [],
    names: names.filter(Boolean),
    locationTypeDropdown: locationTypeData?.options?.map((o: any) => o.key) || [],
    types: types.filter(Boolean),
    cityDropdown: cityData?.options?.map((o: any) => o.key) || [],
    cities: cities.filter(Boolean),
    stateDropdown: stateData?.options?.map((o: any) => o.key) || [],
    states: states.filter(Boolean),
  };
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
