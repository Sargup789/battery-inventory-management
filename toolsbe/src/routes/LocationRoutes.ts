import { Router } from "express";
import * as LocationController from "../controllers/LocationController";
import { authenticateJWT } from "../middleware/authMiddleware";

const locationRouter = Router();

// CRUD operations
locationRouter.post("/", authenticateJWT, LocationController.createLocation);
locationRouter.get("/", authenticateJWT, LocationController.getAllLocations);
locationRouter.get(
  "/:id/availableLocations",
  authenticateJWT,
  LocationController.getAvailableLocations
);
locationRouter.get("/:id", authenticateJWT, LocationController.getLocation);
locationRouter.put("/:id", authenticateJWT, LocationController.updateLocation);
locationRouter.delete("/:id", authenticateJWT, LocationController.deleteLocation);

export default locationRouter;
