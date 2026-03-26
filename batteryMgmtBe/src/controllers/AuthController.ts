import { Request, Response } from "express";
import { User } from "../entity/User";
import * as authService from "../services/AuthService";

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.registerUser(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const token = await authService.loginUser(
      req.body.username,
      req.body.password
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const resetUserPassword = async (req: Request, res: Response) => {
  try {
    const user = await authService.resetPassword(
      req.body.username,
      req.body.oldPassword,
      req.body.newPassword
    );
    res.json({ message: "Password reset successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const forgotUserPassword = async (req: Request, res: Response) => {
  try {
    const result = await authService.forgotPassword(req.body.username);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changeUserPermission = async (
  req: Request & { user?: User },
  res: Response
) => {
  try {
    const user = await authService.changeUserRole(
      req.user,
      req.body.username,
      req.body.newRole
    );
    res.json({ message: `Role changed to ${user.role}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;

    const result = await authService.getAllUsers(page, size);

    res.json({
      data: result.users,
      totalCount: result.totalCount,
      currentPage: page,
      pageSize: size,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await authService.deleteUser(req.params.id);
    res.json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await authService.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
