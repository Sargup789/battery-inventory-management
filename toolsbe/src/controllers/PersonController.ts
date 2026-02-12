import { Request, Response } from "express";
import * as personService from "../services/PersonService";

export const createPerson = async (req: Request, res: Response) => {
  try {
    const person = await personService.createPerson(req.body);
    res.json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPerson = async (req: Request, res: Response) => {
  try {
    const person = await personService.getPerson(req.params.id);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllPersons = async (req: Request, res: Response) => {
  try {
    const persons = await personService.getAllPersons();
    res.json(persons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePerson = async (req: Request, res: Response) => {
  try {
    const person = await personService.updatePerson(req.params.id, req.body);
    res.json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePerson = async (req: Request, res: Response) => {
  try {
    await personService.deletePerson(req.params.id);
    res.json({ message: "Person deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
