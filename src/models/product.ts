import client from "../database";

export type Product = {
  id?: number;
  name: string;
  price: number;
  category: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM products";
      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get products. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const sql = "SELECT * FROM products where id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot find product ${id}. Error: ${err}`);
    }
  }

  async create(p: Product): Promise<Product> {
    try {
      const sql =
        "INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [p.name, p.price, p.category]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Cannot add new product ${p.name}. Error: ${err}`);
    }
  }

  async update(p: Product): Promise<Product> {
    try {
      const sql =
        "UPDATE products SET name=($1), price=($2), category=($3) WHERE id=($4) RETURNING *";
      const conn = await client.connect();
      const result = await conn.query(sql, [p.name, p.price, p.category, p.id]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Cannot update product ${p.name}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<Product> {
    try {
      const sql = "DELETE FROM products WHERE id=($1)";
      const conn = await client.connect();
      const result = await conn.query(sql, [id]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Cannot delete product ${id}. Error: ${err}`);
    }
  }
}
