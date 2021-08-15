import express, { Request, Response } from "express";
import { Product, ProductStore } from "../models/product";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(parseInt(req.params.id));
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  const product: Product = {
    name: req.body.name,
    price: Number(req.body.price),
    category: req.body.category,
  };

  try {
    const new_product = await store.create(product);
    res.json(new_product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const update = async (req: Request, res: Response) => {
  const product: Product = {
    id: parseInt(req.params.id),
    name: req.body.name,
    price: Number(req.body.price),
    category: req.body.category,
  };
  try {
    const update_product = await store.update(product);
    res.json(update_product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const deleted_product = await store.delete(parseInt(req.params.id));
    res.json(deleted_product);
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
    const token = (authorizationHeader as string).split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as jwt.Secret);
    next();
  } catch (error) {
    res.status(401);
    res.json(`Access denied, invalid token ${error}`);
    return;
  }
};

const product_routes = (app: express.Application) => {
  app.get("/products", index);
  app.get("/products/:id", show);
  app.post("/products", verifyAuthToken, create);
  app.put("/products/:id", verifyAuthToken, update);
  app.delete("/products/:id", verifyAuthToken, remove);
};

export default product_routes;
