import { PersonRepository, ToolRepository } from "..";
import { Person } from "../entity/Person";
import { ObjectId } from "mongodb";

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
  if (!person) throw new Error("Person not found");
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

export const getAllPersons = async (): Promise<Person[]> => {
  const persons = await PersonRepository.find();
  if (!persons.length) return [];

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

  return persons.map((person: any) => {
    const personId = toEntityId(person?._id || person?.id);
    return {
      ...person,
      toolsCount: personToolCountMap.get(personId) || 0,
    };
  }) as Person[];
};
