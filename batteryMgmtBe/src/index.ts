import "dotenv/config";
import express from "express";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { DropdownMaster } from "./entity/DropDownMaster";
import { Zone } from "./entity/Zone";
import { QRCode } from "./entity/QRCode";
import { PowerEquipment } from "./entity/PowerEquipment";
import { EquipmentEvent } from "./entity/EquipmentEvent";
import { User } from "./entity/User";
import { authenticateJWT } from "./middleware/authMiddleware";
import authRouter from "./routes/AuthRoutes";
import dropdownMasterRouter from "./routes/DropdownMasterRouter";
import zoneRouter from "./routes/ZoneRoutes";
import qrCodeRouter from "./routes/QRCodeRoutes";
import powerEquipmentRouter from "./routes/PowerEquipmentRoutes";
import { ensureRequiredDropdownMasters } from "./services/DropdownMasterService";

export const appDataSource = new DataSource({
  type: "mongodb",
  url: process.env.MONGODB_URI,
  synchronize: true,
  logging: false,
  entities: ["src/entity/*.ts"],
  useUnifiedTopology: true,
});

export const Manager = appDataSource.manager;
export const PowerEquipmentRepository = appDataSource.getMongoRepository(PowerEquipment);
export const ZoneRepository = appDataSource.getMongoRepository(Zone);
export const QRCodeRepository = appDataSource.getMongoRepository(QRCode);
export const UserRepository = appDataSource.getMongoRepository(User);
export const DropdownMasterRepository = appDataSource.getMongoRepository(DropdownMaster);
export const EquipmentEventRepository = appDataSource.getMongoRepository(EquipmentEvent);

const main = async () => {
  const app = express();
  app.use(express.json());

  await appDataSource.initialize();
  await ensureRequiredDropdownMasters();

  app.use("/api/power-equipment", authenticateJWT, powerEquipmentRouter);
  app.use("/api/zones", authenticateJWT, zoneRouter);
  app.use("/api/qr-code", authenticateJWT, qrCodeRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/dropdownmaster", authenticateJWT, dropdownMasterRouter);

  app.listen(process.env.PORT || 8002);
  console.log(`Battery server started on port ${process.env.PORT || 8002}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
