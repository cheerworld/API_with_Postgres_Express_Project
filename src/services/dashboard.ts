import client from "../database";
import { Order } from "../models/order";
import { Product } from "../models/product";

export type PopularProducts = {
  name: string;
  price: string;
  category: string;
  quantity: number;
  order_id: string;
  product_id: string;
};

export class DashboardQueries {
  //Get current Orders by user (args: user id)[token required]
  async currentOrdersByUser(id: number): Promise<Order[]> {
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
  async completeOrdersByUser(id: number): Promise<Order[]> {
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

  //Get 5 most popular products by oders's quantity
  async fiveMostPopular(): Promise<PopularProducts[]> {
    try {
      const conn = await client.connect();
      const sql =
        " SELECT name, price, category, quantity, order_id, product_id FROM products INNER JOIN order_products ON products.id=order_products.product_id ORDER BY quantity DESC LIMIT 5";
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
