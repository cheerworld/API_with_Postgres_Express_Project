import express, { Request, Response } from "express";
import users_routes from "./handlers/users";
import product_routes from "./handlers/products";
import order_routes from "./handlers/orders";
import dashboard_routes from "./handlers/dashboards";

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Hello World!");
});

users_routes(app);
product_routes(app);
order_routes(app);
dashboard_routes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});
