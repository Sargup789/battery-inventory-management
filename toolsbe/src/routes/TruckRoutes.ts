import { Router } from "express";
import * as ToolController from "../controllers/ToolController";
import { authenticateJWT } from "../middleware/authMiddleware";

const truckRouter = Router();

// Legacy compatibility route used by existing frontend pages.
truckRouter.get(
  "/qrCode/:qrCodeId",
  authenticateJWT,
  ToolController.getToolByQrCode
);

export default truckRouter;
