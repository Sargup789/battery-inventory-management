import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "..";
import { User, UserRole } from "../entity/User";
import { SECRET_KEY } from "../middleware/authMiddleware";

export const loginUser = async (username: string, password: string): Promise<string> => {
  const user = await UserRepository.findOne({ where: { username } });
  if (!user) throw new Error("User not found");
  const valid = await user.validatePassword(password);
  if (!valid) throw new Error("Invalid password");
  return jwt.sign({ username: user.username, roles: user.role }, SECRET_KEY, { expiresIn: "30d" });
};

export const registerUser = async (username: string, password: string, role: UserRole = UserRole.Administrator): Promise<User> => {
  const existing = await UserRepository.findOne({ where: { username } });
  if (existing) throw new Error("User already exists");
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, role, allowedApplication: "battery" });
  return await UserRepository.save(user);
};

export const resetPassword = async (username: string, oldPassword: string, newPassword: string): Promise<void> => {
  const user = await UserRepository.findOne({ where: { username } });
  if (!user) throw new Error("User not found");
  const valid = await user.validatePassword(oldPassword);
  if (!valid) throw new Error("Invalid old password");
  user.password = await bcrypt.hash(newPassword, 10);
  await UserRepository.save(user);
};

export const getUsers = async (): Promise<User[]> => {
  return await UserRepository.find();
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  const { ObjectId } = require("mongodb");
  const user = await UserRepository.findOne({ where: { _id: new ObjectId(id) } as any });
  if (!user) throw new Error("User not found");
  if (data.password) data.password = await bcrypt.hash(data.password, 10);
  const updated = Object.assign(user, data);
  return await UserRepository.save(updated);
};

export const deleteUser = async (id: string): Promise<void> => {
  const { ObjectId } = require("mongodb");
  await UserRepository.deleteOne({ _id: new ObjectId(id) });
};
