import client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const { PEPPER, SALT_ROUNDS } = process.env;

export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Cannot get users. Error: ${err}.`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = "SELECT * FROM users where id=($1)";
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot find user ${id}. Error: ${err}.`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      const conn = await client.connect();
      const sql =
        "INSERT INTO users (first_name, last_name, password) VALUES ($1, $2, $3) RETURNING *";
      const hash = bcrypt.hashSync(
        u.password + PEPPER,
        parseInt(SALT_ROUNDS as string)
      );
      const result = await conn.query(sql, [u.first_name, u.last_name, hash]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`Cannot add new user ${u.first_name}. Error: ${err}.`);
    }
  }

  async update(u: User): Promise<User> {
    try {
      const conn = await client.connect();
      const sql =
        "UPDATE users SET first_name=($1), last_name=($2), password=($3) WHERE id=($4) RETURNING *";
      const hash = bcrypt.hashSync(
        u.password + PEPPER,
        parseInt(SALT_ROUNDS as string)
      );

      const result = await conn.query(sql, [
        u.first_name,
        u.last_name,
        hash,
        u.id,
      ]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`Cannot update user ${u.first_name}. Error: ${err}.`);
    }
  }

  async delete(id: number): Promise<User> {
    try {
      const conn = await client.connect();
      const sql = "DELETE FROM users WHERE id=($1)";
      const result = await conn.query(sql, [id]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`Cannot delete user ${id}. Error: ${err}`);
    }
  }

  async authenticate(
    first_name: string,
    last_name: string,
    password: string
  ): Promise<User | null> {
    try {
      const conn = await client.connect();
      const sql =
        "SELECT * FROM users WHERE first_name=($1) AND last_name=($2)";
      const result = await conn.query(sql, [first_name, last_name]);

      if (result.rows.length) {
        const user = result.rows[0];

        if (bcrypt.compareSync(password + PEPPER, user.password)) {
          return user;
        }
      }

      return null;
    } catch (err) {
      throw new Error(`Cannot authenticate user ${first_name}. Error: ${err}.`);
    }
  }
}
