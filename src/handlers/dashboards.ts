import express, { Request, Response } from "express";
import { DashboardQueries } from "../services/dashboard";
import { verifyUserId } from "../services/verificationJWT";

const dashboard = new DashboardQueries();

const fiveMostPopular = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await dashboard.fiveMostPopular();
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const currentOrdersByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await dashboard.currentOrdersByUser(parseInt(req.params.id));
    res.json(orders);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const completeOrdersByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const orders = await dashboard.completeOrdersByUser(
      parseInt(req.params.id)
    );
    res.json(orders);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const productsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await dashboard.productsByCategory(req.params.category);
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const dashboard_routes = (app: express.Application): void => {
  app.get("/five_most_popular", fiveMostPopular);
  app.get("/products/categories/:category", productsByCategory);
  app.post("/orders/users/:id/current", verifyUserId, currentOrdersByUser);
  app.post("/orders/users/:id/complete", verifyUserId, completeOrdersByUser);
};

export default dashboard_routes;
