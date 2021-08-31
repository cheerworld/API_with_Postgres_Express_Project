import client from "../database";
import { Product } from "../models/product";

export type PopularProducts = {
  id: number;
  name: string;
  price: string;
  category: string;
  volume: string;
  orders_placed: string;
};

export type OrderByUser = {
  order_id: string;
  status: string;
  product_id: string;
  quantity: number;
  user_id: string;
};

export class DashboardQueries {
  //Get current Orders by user (args: user id)[token required]
  async currentOrdersByUser(id: number): Promise<OrderByUser[]> {
    try {
      const conn = await client.connect();
      const sql =
        "SELECT order_id, status, product_id, quantity, user_id FROM orders INNER JOIN order_products ON orders.id=order_products.order_id WHERE user_id=($1) AND status='active'";
      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get current Orders by user. Error: ${err}.`);
    }
  }

  //Get complete orders by user (args: user id)[token required]
  async completeOrdersByUser(id: number): Promise<OrderByUser[]> {
    try {
      const conn = await client.connect();
      const sql =
        "SELECT order_id, status, product_id, quantity, user_id FROM orders INNER JOIN order_products ON orders.id=order_products.order_id WHERE user_id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get complete Orders by user. Error: ${err}.`);
    }
  }

  //Get 5 most popular products by orders's volume
  async fiveMostPopular(): Promise<PopularProducts[]> {
    try {
      const conn = await client.connect();
      const sql =
        "SELECT p.id, p.name, p.price, p.category, SUM(op.quantity) AS volume, COUNT(op.order_id) AS orders_placed FROM (products p INNER JOIN order_products op ON p.id=op.product_id) GROUP BY p.id ORDER BY volume DESC LIMIT 5";
      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get products by popularity. Error: ${err}.`);
    }
  }

  //Get products by category (args: product category)
  async productsByCategory(category: string): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products WHERE category=($1)";
      const result = await conn.query(sql, [category]);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get products by category. Error: ${err}.`);
    }
  }
}
