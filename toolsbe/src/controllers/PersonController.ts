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
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;
    const filters: personService.PersonFilters = {};

    if (req.query.name) filters.name = req.query.name as string;
    if (req.query.employeeId) filters.employeeId = req.query.employeeId as string;
    if (req.query.designation) filters.designation = req.query.designation as string;
    if (req.query.email) filters.email = req.query.email as string;
    if (req.query.phoneNumber) filters.phoneNumber = req.query.phoneNumber as string;
    if (req.query.immediateBoss) filters.immediateBoss = req.query.immediateBoss as string;

    const result = await personService.getAllPersons(page, size, filters);
    res.json({
      data: result.data,
      totalCount: result.totalCount,
      currentPage: page,
      pageSize: size,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPersonFilterOptions = async (req: Request, res: Response) => {
  try {
    const filterOptions = await personService.getPersonFilterOptions();
    res.json(filterOptions);
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
