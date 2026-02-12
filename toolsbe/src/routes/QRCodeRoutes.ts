import { Router } from "express";
import {
  createQrCodes,
  deleteQrCode,
  getAllAvailableQrCodesController,
  getAllQrCodes,
  getQrCode,
} from "../controllers/QRCodeController";

const qrCodeRouter = Router();

qrCodeRouter.post("/", createQrCodes);
qrCodeRouter.get("/all", getAllAvailableQrCodesController);
qrCodeRouter.get("/:id", getQrCode);
qrCodeRouter.get("/", getAllQrCodes);
qrCodeRouter.delete("/:id", deleteQrCode);

export default qrCodeRouter;
