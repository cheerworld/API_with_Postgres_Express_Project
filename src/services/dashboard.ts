import client from "../database";
import { Order } from "../models/order";
export class DashboardQueries {
  //Get current Orders by user (args: user id)[token required]

  async currentOrdersByUser(id: number): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders WHERE user_id=($1) AND status='active'";
      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get current Orders by user. Error: ${err}.`);
    }
  }
}
