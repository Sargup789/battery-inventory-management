import { Router } from "express";
import * as PersonController from "../controllers/PersonController";
import { authenticateJWT } from "../middleware/authMiddleware";

const personRouter = Router();

// CRUD operations
personRouter.post("/", authenticateJWT, PersonController.createPerson);
personRouter.get("/", authenticateJWT, PersonController.getAllPersons);
personRouter.get("/filters", authenticateJWT, PersonController.getPersonFilterOptions);
personRouter.get("/:id", authenticateJWT, PersonController.getPerson);
personRouter.put("/:id", authenticateJWT, PersonController.updatePerson);
personRouter.delete("/:id", authenticateJWT, PersonController.deletePerson);

export default personRouter;
