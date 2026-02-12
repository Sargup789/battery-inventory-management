// middleware/authMiddleware.ts

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { appDataSource } from "../index";

export const SECRET_KEY = process.env.SECRET_KEY;

export const authenticateJWT = async (
  req: Request & { user?: User },
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      const userRepo = appDataSource.getMongoRepository(User);
      const user = await userRepo.findOne({
        where: { username: decoded.username },
      });
      if (!user) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    } catch (err) {
      return res.sendStatus(403);
    }
  } else {
    res.sendStatus(401);
  }
};

export const authorizeRole = (
  roles: Array<"viewer" | "editor" | "administrator">
) => {
  return (
    req: Request & { user?: User },
    res: Response,
    next: NextFunction
  ) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).send("Access Denied");
    }
    next();
  };
};
