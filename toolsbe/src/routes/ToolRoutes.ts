import { Router } from "express";
import * as ToolController from "../controllers/ToolController";
import { authenticateJWT } from "../middleware/authMiddleware";

const toolRouter = Router();

// CRUD operations
toolRouter.post("/", authenticateJWT, ToolController.createTool);
toolRouter.get("/", authenticateJWT, ToolController.getAllTools);
toolRouter.get("/filters", authenticateJWT, ToolController.getToolFilterOptions);
toolRouter.get("/status/:toolId", authenticateJWT, ToolController.getToolStatus);
toolRouter.get("/qr-code/:qrCodeId", authenticateJWT, ToolController.getToolByQrCode);

// Tool operations
toolRouter.post("/assign", authenticateJWT, ToolController.assignTool);
toolRouter.post("/check-out", authenticateJWT, ToolController.checkOutTool);
toolRouter.post("/check-in", authenticateJWT, ToolController.checkInTool);
toolRouter.get("/:id", authenticateJWT, ToolController.getTool);
toolRouter.put("/:id", authenticateJWT, ToolController.updateTool);
toolRouter.delete("/:id", authenticateJWT, ToolController.deleteTool);

export default toolRouter;
