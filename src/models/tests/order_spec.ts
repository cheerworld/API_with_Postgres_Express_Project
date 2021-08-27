import { Order, OrderStore } from "../order";
import { User, UserStore } from "../user";
import { Product, ProductStore } from "../product";
import { DashboardQueries } from "../../services/dashboard";
import dotenv from "dotenv";
import supertest from "supertest";
import app from "../../server";

const request = supertest(app);

dotenv.config();

const { POSTGRES_PASSWORD_TEST } = process.env;

const productStore = new ProductStore();

const userStore = new UserStore();

const dashboardStore = new DashboardQueries();

const store = new OrderStore();

describe("Order Model", () => {
  beforeAll(async () => {
    await userStore.create({
      first_name: "Yuguo",
      last_name: "Zhao",
      password: POSTGRES_PASSWORD_TEST as string,
    });

    await productStore.create({
      name: "Cheer Painting",
      price: 699.99,
      category: "painting",
    });
  });

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("should have a show method", () => {
    expect(store.show).toBeDefined();
  });

  it("should have a create method", () => {
    expect(store.create).toBeDefined();
  });

  it("should have a delete method", () => {
    expect(store.delete).toBeDefined();
  });

  it("should have an update method", () => {
    expect(store.update).toBeDefined();
  });

  it("should have an addProduct method", () => {
    expect(store.addProduct).toBeDefined();
  });

  it("create method should add an order", async () => {
    const result = await store.create({
      status: "active",
      user_id: "1",
    });
    expect(result.id).toBe(1);
  });

  describe("orders endpoints testing", () => {
    it("post method to /orders should create a new order", async () => {
      const response = await request
        .post("/orders")
        .send({ user_id: "1" })
        .set("Accept", "application/json");

      expect(response.body).toEqual({
        id: 2,
        status: "active",
        user_id: "1",
      });
    });

    it("gets /orders should get all orders", async () => {
      const response = await request.get("/orders");
      expect(response.body.length).toBe(2);
    });

    it("gets /orders/2 should get the selected order", async () => {
      const response = await request.get("/orders/2");
      expect(response.status).toBe(200);
    });

    it("put method to /orders/2 should update order status to complete", async () => {
      const response = await request
        .put("/orders/2")
        .send({
          id: 2,
          status: "complete",
          user_id: "1",
        })
        .set("Accept", "application/json");
      expect(response.body.status).toBe("complete");
    });

    it("posts to orders/2/products to add products to order should fail", async () => {
      const response = await request
        .post("/orders/2/products")
        .send({
          quantity: 1,
          order_id: "2",
          product_id: "1",
        })
        .set("Accept", "application/json");
      expect(response.status).toEqual(400);
    });

    it("delete method to /orders/2 should delete the selected order", async () => {
      const response = await request.delete("/orders/2");
      expect(response.status).toBe(200);
    });
  });

  it("index method should return a list of orders", async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        status: "active",
        user_id: "1",
      },
    ]);
  });

  it("show method should return the correct order", async () => {
    const result = await store.show(1);
    expect(result).toEqual({
      id: 1,
      status: "active",
      user_id: "1",
    });
  });

  it("addProduct method should add a product to order", async () => {
    const result = await store.addProduct({
      quantity: 13,
      order_id: "1",
      product_id: "1",
    });

    expect(result).toEqual({
      id: 1,
      quantity: 13,
      order_id: "1",
      product_id: "1",
    });
  });

  describe("endpoint tests for currentOrdersByUser and completeOrdersByUser", () => {
    let token: string;
    it("authenticates the user", async () => {
      const response = await request
        .post("/users/authenticate")
        .send({
          first_name: "Yuguo",
          last_name: "Zhao",
          password: POSTGRES_PASSWORD_TEST as string,
        })
        .set("Accept", "application/json");
      token = "Bearer " + response.body;
    });

    it("post method to /orders/users/:id/current should get current orders by selected user", async () => {
      const response = await request
        .post("/orders/users/1/current")
        .set("Authorization", token);
      expect(response.status).toEqual(200);
    });

    it("post method to /orders/users/:id/complete should get complete orders by selected user", async () => {
      const response = await request
        .post("/orders/users/1/complete")
        .set("Authorization", token);
      expect(response.status).toEqual(200);
    });

    it("get method to /five_most_popular should show top 5 products ordered by quantity", async () => {
      const response = await request.get("/five_most_popular");
      expect(response.body[0].quantity).toEqual(13);
    });
  });

  it("currentOrdersByUser should get current orders by user ", async () => {
    const result = await dashboardStore.currentOrdersByUser(1);
    expect(result).toEqual([
      {
        order_id: "1",
        product_id: "1",
        quantity: 13,
        status: "active",
        user_id: "1",
      },
    ]);
  });

  it("completeOrdersByUser should get complete orders by user ", async () => {
    const result = await dashboardStore.completeOrdersByUser(1);
    expect(result).toEqual([
      {
        order_id: "1",
        product_id: "1",
        quantity: 13,
        status: "active",
        user_id: "1",
      },
    ]);
  });

  it("fiveMostPopular method should show top 5 products ordered by quantity", async () => {
    const result = await dashboardStore.fiveMostPopular();
    expect(result[0].quantity).toBe(13);
  });

  it("update method should return the updated order", async () => {
    const result = await store.update({
      id: 1,
      status: "active",
      user_id: "1",
    });
    expect(result).toEqual({
      id: 1,
      status: "active",
      user_id: "1",
    });
  });

  it("delete method should remove the selected order", async () => {
    await store.delete(1);
    const result = await store.index();
    expect(result).toEqual([]);
  });
});
