import { PersonRepository, ToolRepository } from "..";
import { Person } from "../entity/Person";
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

export const createPerson = async (
  personData: Partial<Person>
): Promise<Person> => {
  const person = new Person(personData);
  person.createdAt = new Date();
  person.updatedAt = new Date();
  return await PersonRepository.save(person);
};

export const deletePerson = async (id: string): Promise<void> => {
  await PersonRepository.deleteOne({ _id: new ObjectId(id) });
};

export const updatePerson = async (
  id: string,
  personData: Partial<Person>
): Promise<Person> => {
  const person = await PersonRepository.findOne({
    where: { _id: new ObjectId(id) } as any,
  });
  if (!person) throw new Error("Persona no encontrada");
  const updatedPerson = Object.assign(person, personData);
  updatedPerson.updatedAt = new Date();
  return await PersonRepository.save(updatedPerson);
};

export const getPerson = async (id: string): Promise<Person | null> => {
  const person = await PersonRepository.findOne({
    where: { _id: new ObjectId(id) } as any,
  });
  if (!person) return null;

  const personId = toEntityId((person as any)._id || (person as any).id);
  const toolsCount = await ToolRepository.count({
    where: { assignedPersonId: personId } as any,
  });

  return {
    ...(person as any),
    toolsCount,
  } as Person;
};

export interface PersonFilters {
  name?: string;
  employeeId?: string;
  designation?: string;
  email?: string;
  phoneNumber?: string;
  immediateBoss?: string;
}

export const getAllPersons = async (
  page: number = 1,
  size: number = 10,
  filters: PersonFilters = {}
): Promise<{ data: Person[]; totalCount: number }> => {
  const where: Record<string, any> = {};

  if (filters.name) {
    where.name = { $regex: filters.name, $options: "i" };
  }
  if (filters.employeeId) {
    where.employeeId = { $regex: filters.employeeId, $options: "i" };
  }
  if (filters.designation) {
    where.designation = { $regex: filters.designation, $options: "i" };
  }
  if (filters.email) {
    where.email = { $regex: filters.email, $options: "i" };
  }
  if (filters.phoneNumber) {
    where.phoneNumber = { $regex: filters.phoneNumber, $options: "i" };
  }
  if (filters.immediateBoss) {
    where.immediateBoss = { $regex: filters.immediateBoss, $options: "i" };
  }

  const persons = await PersonRepository.find({
    where,
    skip: (page - 1) * size,
    take: size,
    order: { updatedAt: "DESC" },
  });
  const totalCount = await PersonRepository.count(where);

  if (!persons.length) return { data: [], totalCount };

  const allTools = await ToolRepository.find();
  const personToolCountMap = new Map<string, number>();

  allTools.forEach((tool: any) => {
    const assignedPersonId = toEntityId(tool?.assignedPersonId);
    if (!assignedPersonId) return;
    personToolCountMap.set(
      assignedPersonId,
      (personToolCountMap.get(assignedPersonId) || 0) + 1
    );
  });

  const data = persons.map((person: any) => {
    const personId = toEntityId(person?._id || person?.id);
    return {
      ...person,
      toolsCount: personToolCountMap.get(personId) || 0,
    };
  }) as Person[];

  return { data, totalCount };
};

export const getPersonFilterOptions = async (): Promise<any> => {
  const designationData = await getDropdown("designation");
  const immediateBossData = await getDropdown("immediateBoss");
  const names = await PersonRepository.distinct("name", {});
  const employeeIds = await PersonRepository.distinct("employeeId", {});
  const designations = await PersonRepository.distinct("designation", {});
  const emails = await PersonRepository.distinct("email", {});
  const phoneNumbers = await PersonRepository.distinct("phoneNumber", {});
  const immediateBosses = await PersonRepository.distinct("immediateBoss", {});

  return {
    names: names.filter(Boolean),
    employeeIds: employeeIds.filter(Boolean),
    designationDropdown: designationData?.options?.map((o: any) => o.key) || [],
    designations: designations.filter(Boolean),
    emails: emails.filter(Boolean),
    phoneNumbers: phoneNumbers.filter(Boolean),
    immediateBossDropdown: immediateBossData?.options?.map((o: any) => o.key) || [],
    immediateBosses: immediateBosses.filter(Boolean),
  };
};
