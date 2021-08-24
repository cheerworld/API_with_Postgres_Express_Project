import client from "../database";

export type Order = {
  id?: number;
  status: string;
  user_id: string;
};

export type AddProduct = {
  id?: number;
  quantity: number;
  order_id: string;
  product_id: string;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM orders";
      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get orders. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const sql = "SELECT * FROM orders where id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot find order ${id}. Error: ${err}`);
    }
  }

  async create(o: Order): Promise<Order> {
    try {
      const sql =
        "INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [o.status, o.user_id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Cannot add new order ${o}. Error: ${err}`);
    }
  }

  async addProduct(a: AddProduct): Promise<AddProduct> {
    try {
      const order_sql = "SELECT * FROM orders WHERE id=($1)";
      const conn = await client.connect();
      const result = await conn.query(order_sql, [a.order_id]);

      const order = result.rows[0];

      if (order.status !== "active") {
        throw new Error(
          `Cannot add product ${a.product_id} to order ${a.order_id} because order status is ${order.status}`
        );
      }
      conn.release();
    } catch (err) {
      throw new Error(`${err}`);
    }

    try {
      const sql =
        "INSERT INTO order_products (quantity, order_id, product_id) VALUES ($1, $2, $3) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [
        a.quantity,
        a.order_id,
        a.product_id,
      ]);
      const order_product = result.rows[0];
      conn.release();
      return order_product;
    } catch (err) {
      throw new Error(
        `Cannot add product ${a.product_id} to order ${a.order_id}. Error: ${err}`
      );
    }
  }

  async update(o: Order): Promise<Order> {
    try {
      const sql =
        "UPDATE orders SET status=($1), user_id=($2) WHERE id=($3) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [o.status, o.user_id, o.id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Cannot update order id ${o.id}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<Order> {
    try {
      const sql = "DELETE FROM orders WHERE id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Cannot delete order ${id}. Error: ${err}`);
    }
  }
}
