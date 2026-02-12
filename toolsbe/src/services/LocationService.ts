import { LocationRepository } from "..";
import { Location } from "../entity/Location";
import { ObjectId } from "mongodb";

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
  return await LocationRepository.findOne({
    where: { _id: new ObjectId(id) } as any,
  });
};

export const getAllLocations = async (): Promise<Location[]> => {
  return await LocationRepository.find();
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
