import express, { Request, Response } from "express";
import { DashboardQueries } from "../services/dashboard";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface TokenInterface {
  user: User;
  iat: number;
}

const dashboard = new DashboardQueries();

const currentOrdersByUser = async (req: Request, res: Response) => {
  const orders = await dashboard.currentOrdersByUser(
    parseInt(req.params.userID)
  );
  res.json(orders);
};

const verifyUserId = (
  req: Request,
  res: Response,
  next: express.NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = (authorizationHeader as string).split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret);
    console.log(decoded);
    const id = (decoded as TokenInterface).user.id;
    console.log(id);
    if (id !== parseInt(req.params.userID)) {
      throw new Error("User id does not match!");
    }
    next();
  } catch (err) {
    res.status(401);
    res.json(err);
    return;
  }
};

const dashboard_routes = (app: express.Application) => {
  app.get("/orders/users/:userID/current", verifyUserId, currentOrdersByUser);
};

export default dashboard_routes;
