import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { QRCodeRepository } from "..";
import { QRCode } from "../entity/QRCode";

const generateQrCode = () => uuidv4();

export const createQrCodes = async (quantity: number) => {
  const qrCodes = Array(quantity)
    .fill(0)
    .map(() => {
      const qr = new QRCode();
      qr.code = generateQrCode();
      qr.inUse = false;
      qr.createdAt = new Date();
      return qr;
    });
  return await QRCodeRepository.save(qrCodes);
};

export const updateQRCodeInUseStatus = async (code: string, inUse: boolean) => {
  const qr = await QRCodeRepository.findOne({
    where: { code: code },
  });
  qr.inUse = inUse;
  await QRCodeRepository.save(qr);
};

export const getAllAvailableQrCodes = async () => {
  return await QRCodeRepository.find({
    where: {
      inUse: false,
    },
  });
};

export const getQrCodeService = async (code: string) => {
  return await QRCodeRepository.findOne({
    where: { code: code },
  });
};

export const getAllQrCodes = async () => {
  return await QRCodeRepository.find();
};

export const deleteQrCode = async (id: string) => {
  const qr = await QRCodeRepository.findOne({ where: { _id: new ObjectId(id) } as any });
  if (!qr) throw new Error("QR Code not found");
  await QRCodeRepository.remove(qr);
};
