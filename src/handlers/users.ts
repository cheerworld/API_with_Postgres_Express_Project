import express, { Request, Response } from "express";
import { User, UserStore } from "../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface TokenInterface {
  user: User;
  iat: number;
}

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await store.show(parseInt(req.params.id));
    res.json(user);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  const user: User = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: req.body.password,
  };

  try {
    const newUser = await store.create(user);
    const token = jwt.sign(
      { user: newUser },
      process.env.TOKEN_SECRET as jwt.Secret
    );
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(err + user);
  }
};

const update = async (req: Request, res: Response) => {
  const user: User = {
    id: parseInt(req.params.id),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: req.body.password,
  };

  try {
    const updated = await store.update(user);
    const token = jwt.sign(
      { user: updated },
      process.env.TOKEN_SECRET as jwt.Secret
    );
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(err + user);
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const deleted_user = await store.delete(parseInt(req.params.id));
    res.json(deleted_user);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const authUser = await store.authenticate(
      req.body.first_name,
      req.body.last_name,
      req.body.password
    );

    if (authUser === null) {
      throw new Error(
        "User is not authenticated, please verify your information."
      );
    } else {
      const token = jwt.sign(
        { user: authUser },
        process.env.TOKEN_SECRET as jwt.Secret
      );

      res.json(token);
    }
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const verifyAuthToken = (
  req: Request,
  res: Response,
  next: express.NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    //console.log(authorizationHeader);
    const token = (authorizationHeader as string).split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret);
    next();
  } catch (error) {
    res.status(401);
    res.json(`Access denied, invalid token ${error}`);
    return;
  }
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

const users_routes = (app: express.Application) => {
  app.get("/users", verifyAuthToken, index);
  app.get("/users/:id", verifyAuthToken, show);
  app.post("/users", create);
  app.put("/users/:id", verifyUserId, update);
  app.delete("/users/:id", verifyUserId, remove);
  app.post("/users/authenticate", authenticate);
};

export default users_routes;
