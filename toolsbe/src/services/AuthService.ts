import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { User } from "../entity/User";
import { UserRepository } from "../index";
import { SECRET_KEY } from "../middleware/authMiddleware";

export const registerUser = async (userData) => {
  const existingUser = await UserRepository.findOne({
    where: { username: userData.username },
  });
  if (existingUser) {
    throw new Error("Username already exists.");
  }

  const saltRounds = 10;
  userData.password = await bcrypt.hash(userData.password, saltRounds);
  return UserRepository.save(new User(userData));
};

export const loginUser = async (username, password) => {
  const user = await UserRepository.findOne({ where: { username: username } });
  if (!user) {
    throw new Error("User not found.");
  }

  const validPassword = await user.validatePassword(password);
  if (!validPassword) {
    throw new Error("Invalid password.");
  }

  // Generate JWT
  const payload = {
    username: user.username,
    roles: user.role,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "365d" });
  return token;
};

export const resetPassword = async (username, oldPassword, newPassword) => {
  const user = await UserRepository.findOne({ where: { username: username } });
  if (!user) {
    throw new Error("User not found.");
  }
  const validPassword = await user.validatePassword(oldPassword);

  if (!validPassword) {
    throw new Error("Invalid Old Password.");
  }

  const saltRounds = 10;
  user.password = await bcrypt.hash(newPassword, saltRounds);

  return UserRepository.save(user);
};

export const forgotPassword = async (username) => {
  const user = await UserRepository.findOne({ where: { username: username } });
  if (!user) {
    throw new Error("User not found.");
  }

  // Set a temporary password
  const tempPassword = "Temp@123"; // This should ideally be a random string
  user.password = await bcrypt.hash(tempPassword, 10);

  await UserRepository.save(user);

  return { message: "Temporary password set. Please reset immediately." };
};

export const changeUserRole = async (admin, username, newRole) => {
  if (!admin || admin.role !== "administrator") {
    throw new Error("Permission denied. Only administrators can change roles.");
  }

  const user = await UserRepository.findOne({ where: { username: username } });
  if (!user) {
    throw new Error("User not found.");
  }

  user.role = newRole;

  return UserRepository.save(user);
};

export const getAllUsers = async (page: number, size: number) => {
  const users = await UserRepository.find({
    skip: (page - 1) * size,
    take: size,
  });

  const totalCount = await UserRepository.count();

  return {
    users,
    totalCount,
    currentPage: page,
    pageSize: size,
  };
};

export const deleteUser = async (id: string): Promise<void> => {
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid user id.");
  }
  await UserRepository.deleteOne({ _id: new ObjectId(id) });
};

export const updateUser = async (
  id: string,
  updates: Partial<User>
): Promise<User> => {
  const user = await UserRepository.findOne({
    where: { _id: new ObjectId(id) } as any,
  });
  if (!user) {
    throw new Error("User not found.");
  }

  if (updates.username && updates.username !== user.username) {
    const existingUser = await UserRepository.findOne({
      where: { username: updates.username },
    });
    if (existingUser) {
      throw new Error("Username already exists.");
    }
  }

  const safeUpdates = { ...updates } as any;
  if (safeUpdates.password) {
    safeUpdates.password = await bcrypt.hash(safeUpdates.password, 10);
  }

  Object.assign(user, safeUpdates);
  return UserRepository.save(user);
};
