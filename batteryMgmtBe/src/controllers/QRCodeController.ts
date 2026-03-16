import { Request, Response } from "express";
import * as service from "../services/QRCodeService";

export const createQRCode = async (req: Request, res: Response) => {
  try {
    const qrCode = await service.createQRCode(req.body.code);
    res.json(qrCode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getQRCode = async (req: Request, res: Response) => {
  try {
    const qrCode = await service.getQRCode(req.params.id);
    if (!qrCode) return res.status(404).json({ error: "QR Code not found" });
    res.json(qrCode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllQRCodes = async (req: Request, res: Response) => {
  try {
    const qrCodes = await service.getAllQRCodes();
    res.json(qrCodes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
