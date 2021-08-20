import express, { Request, Response } from "express";
import { Order, AddProduct, OrderStore } from "../models/order";

const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(parseInt(req.params.id));
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  const order: Order = {
    status: "active",
    user_id: req.body.user_id,
  };

  try {
    const new_order = await store.create(order);
    res.json(new_order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const update = async (req: Request, res: Response) => {
  const order: Order = {
    status: req.body.status,
    user_id: req.body.user_id,
    id: parseInt(req.params.id),
  };
  try {
    const update_order = await store.update(order);
    res.json(update_order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const deleted_order = await store.delete(parseInt(req.params.id));
    res.json(deleted_order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const addProduct = async (req: Request, res: Response) => {
  const add_Product: AddProduct = {
    quantity: parseInt(req.body.quantity),
    order_id: req.params.id,
    product_id: req.body.product_id,
  };

  try {
    const added_product = await store.addProduct(add_Product);
    res.json(added_product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const order_routes = (app: express.Application) => {
  app.get("/orders", index);
  app.get("/orders/:id", show);
  app.post("/orders", create);
  app.put("/orders/:id", update);
  app.delete("/orders/:id", remove);
  app.post("/orders/:id/products", addProduct);
};

export default order_routes;
