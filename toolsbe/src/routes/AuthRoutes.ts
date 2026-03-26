import { Router } from "express";
import * as AuthController from "../controllers/AuthController";
import { authenticateJWT } from "../middleware/authMiddleware";

const authRouter = Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.post("/reset-password", AuthController.resetUserPassword);
authRouter.post("/forgot-password", AuthController.forgotUserPassword);
authRouter.post(
  "/change-permission",
  authenticateJWT,
  AuthController.changeUserPermission
);
authRouter.get("/users", authenticateJWT, AuthController.getAllUsers);
authRouter.put("/users/:id", authenticateJWT, AuthController.updateUser);
authRouter.delete("/:id", authenticateJWT, AuthController.deleteUser);

export default authRouter;
