import { Router } from "express";
import * as ctrl from "../controllers/QRCodeController";

const qrCodeRouter = Router();

qrCodeRouter.post("/", ctrl.createQRCode);
qrCodeRouter.get("/", ctrl.getAllQRCodes);
qrCodeRouter.get("/:id", ctrl.getQRCode);

export default qrCodeRouter;
