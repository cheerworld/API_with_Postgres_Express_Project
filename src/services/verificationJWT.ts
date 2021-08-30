import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user";

dotenv.config();

interface TokenInterface {
  user: User;
  iat: number;
}

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: express.NextFunction
): void => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = (authorizationHeader as string).split(" ")[1];
    jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret);
    next();
  } catch (error) {
    res.status(401);
    res.json(`Access denied, invalid token ${error}`);
    return;
  }
};

export const verifyUserId = (
  req: Request,
  res: Response,
  next: express.NextFunction
): void => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = (authorizationHeader as string).split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret);
    const id = (decoded as TokenInterface).user.id;
    if (id !== parseInt(req.params.id)) {
      throw new Error("User id does not match!");
    }
    next();
  } catch (err) {
    res.status(401);
    res.json(err);
    return;
  }
};
