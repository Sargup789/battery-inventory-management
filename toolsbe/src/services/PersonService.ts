import { PersonRepository } from "..";
import { Person } from "../entity/Person";
import { ObjectId } from "mongodb";

export const createPerson = async (
  personData: Partial<Person>
): Promise<Person> => {
  const person = new Person(personData);
  person.createdAt = new Date();
  person.updatedAt = new Date();
  return await PersonRepository.save(person);
};

export const deletePerson = async (id: string): Promise<void> => {
  await PersonRepository.delete({ _id: new ObjectId(id) } as any);
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
  return await PersonRepository.findOne({
    where: { _id: new ObjectId(id) } as any,
  });
};

export const getAllPersons = async (): Promise<Person[]> => {
  return await PersonRepository.find();
};
