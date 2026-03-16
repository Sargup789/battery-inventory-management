import { QRCodeRepository } from "..";
import { QRCode } from "../entity/QRCode";
import { ObjectId } from "mongodb";

export const createQRCode = async (code: string): Promise<QRCode> => {
  const qrCode = new QRCode();
  qrCode.code = code;
  qrCode.inUse = false;
  qrCode.createdAt = new Date();
  return await QRCodeRepository.save(qrCode);
};

export const getQRCode = async (id: string): Promise<QRCode | null> => {
  if (ObjectId.isValid(id)) {
    return await QRCodeRepository.findOne({ where: { _id: new ObjectId(id) } as any });
  }
  return await QRCodeRepository.findOne({ where: { code: id } });
};

export const getAllQRCodes = async (): Promise<QRCode[]> => {
  return await QRCodeRepository.find();
};
