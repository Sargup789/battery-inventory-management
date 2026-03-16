import { Router } from "express";
import * as ctrl from "../controllers/PowerEquipmentController";

const powerEquipmentRouter = Router();

powerEquipmentRouter.post("/", ctrl.createEquipment);
powerEquipmentRouter.get("/", ctrl.getAllEquipment);
powerEquipmentRouter.get("/filters", ctrl.getEquipmentFilterOptions);
powerEquipmentRouter.get("/qr-code/:qrCodeId", ctrl.getEquipmentByQrCode);
powerEquipmentRouter.get("/status/:ref", ctrl.getEquipmentStatus);
powerEquipmentRouter.post("/check-out", ctrl.checkOutEquipment);
powerEquipmentRouter.post("/check-in", ctrl.checkInEquipment);
powerEquipmentRouter.get("/:id", ctrl.getEquipment);
powerEquipmentRouter.put("/:id", ctrl.updateEquipment);
powerEquipmentRouter.delete("/:id", ctrl.deleteEquipment);

export default powerEquipmentRouter;
