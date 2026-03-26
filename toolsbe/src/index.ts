import "dotenv/config";
import express from "express";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { DropdownMaster } from "./entity/DropDownMaster";
import { Location } from "./entity/Location";
import { Person } from "./entity/Person";
import { QRCode } from "./entity/QRCode";
import { Tool } from "./entity/Tool";
import { User } from "./entity/User";
import { authenticateJWT } from "./middleware/authMiddleware";
import authRouter from "./routes/AuthRoutes";
import dropdownMasterRouter from "./routes/DropdownMasterRouter";
import locationRouter from "./routes/LocationRoutes";
import personRouter from "./routes/PersonRoutes";
import qrCodeRouter from "./routes/QRCodeRoutes";
import toolRouter from "./routes/ToolRoutes";
import truckRouter from "./routes/TruckRoutes";
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
export const ToolRepository = appDataSource.getMongoRepository(Tool);
export const LocationRepository = appDataSource.getMongoRepository(Location);
export const PersonRepository = appDataSource.getMongoRepository(Person);
export const QRCodeRepository = appDataSource.getMongoRepository(QRCode);
export const UserRepository = appDataSource.getMongoRepository(User);
export const DropdownMasterRepository =
  appDataSource.getMongoRepository(DropdownMaster);

const main = async () => {
  const app = express();
  app.use(express.json());

  await appDataSource.initialize();
  await ensureRequiredDropdownMasters();
  app.use("/api/tools", authenticateJWT, toolRouter);
  app.use("/api/truck", authenticateJWT, truckRouter);
  app.use("/api/locations", authenticateJWT, locationRouter);
  app.use("/api/persons", authenticateJWT, personRouter);
  app.use("/api/qr-code", authenticateJWT, qrCodeRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/dropdownmaster", authenticateJWT, dropdownMasterRouter);

  app.listen(process.env.PORT || 8000);

  console.log(`Express server has started on port ${process.env.PORT || 8000}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
