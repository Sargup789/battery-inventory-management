import { Request, Response } from "express";
import * as QrCodeService from "../services/QRCodeService";

export const createQrCodes = async (req: Request, res: Response) => {
  const quantity = req.body.quantity;
  const qrCodes = await QrCodeService.createQrCodes(quantity);
  res.json(qrCodes);
};

export const getQrCode = async (req: Request, res: Response) => {
  const id = req.params.id;
  const qrCode = await QrCodeService.getQrCodeService(id);
  res.json(qrCode);
};

export const getAllQrCodes = async (req: Request, res: Response) => {
  const qrCodes = await QrCodeService.getAllQrCodes();
  res.json(qrCodes);
};

export const deleteQrCode = async (req: Request, res: Response) => {
  const id = req.params.id;
  await QrCodeService.deleteQrCode(id);
  res.json({ message: "QR code deleted" });
};

export const getAllAvailableQrCodesController = async (
  req: Request,
  res: Response
) => {
  const qrCodes = await QrCodeService.getAllAvailableQrCodes();
  res.json(qrCodes);
};
