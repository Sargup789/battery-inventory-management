import { Router } from "express";
import * as AuthController from "../controllers/AuthController";
import { authenticateJWT } from "../middleware/authMiddleware";

const authRouter = Router();

authRouter.post("/login", AuthController.login);
authRouter.post("/register", AuthController.register);
authRouter.post("/reset-password", AuthController.resetPassword);
authRouter.get("/users", authenticateJWT, AuthController.getUsers);
authRouter.put("/users/:id", authenticateJWT, AuthController.updateUser);
authRouter.delete("/:id", authenticateJWT, AuthController.deleteUser);

export default authRouter;
