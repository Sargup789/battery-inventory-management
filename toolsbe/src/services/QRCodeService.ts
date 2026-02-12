import { ObjectId } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { QRCodeRepository } from "..";

const generateQrCode = () => uuidv4();

export const createQrCodes = async (quantity: number) => {
  const qrCodes = Array(quantity)
    .fill(0)
    .map(() => {
      return {
        code: generateQrCode(),
        inUse: false,
      };
    });
  const insertResult = await QRCodeRepository.insertMany(qrCodes);
  const insertedQrCodes = await QRCodeRepository.find({
    where: {
      _id: { $in: Object.values(insertResult.insertedIds) },
    },
  });
  return insertedQrCodes;
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
  await QRCodeRepository.deleteOne({
    where: {
      _id: new ObjectId(id),
    },
  });
};
