import { Router } from "express";
import * as ctrl from "../controllers/ZoneController";

const zoneRouter = Router();

zoneRouter.post("/", ctrl.createZone);
zoneRouter.get("/", ctrl.getAllZones);
zoneRouter.get("/:id", ctrl.getZone);
zoneRouter.put("/:id", ctrl.updateZone);
zoneRouter.delete("/:id", ctrl.deleteZone);

export default zoneRouter;
