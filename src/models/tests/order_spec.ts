import { Order, OrderStore } from "../order";
import { User, UserStore } from "../user";
import { Product, ProductStore } from "../product";
import dotenv from "dotenv";

dotenv.config();

const { POSTGRES_PASSWORD_TEST } = process.env;

const productStore = new ProductStore();

const userStore = new UserStore();

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

  it("should have a update method", () => {
    expect(store.update).toBeDefined();
  });

  it("should have a addProduct method", () => {
    expect(store.addProduct).toBeDefined();
  });

  it("create method should add an order", async () => {
    const result = await store.create({
      status: "active",
      user_id: "1",
    });
    expect(result.id).toBe(1);
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

  it("update method should return the updated order", async () => {
    const result = await store.update({
      id: 1,
      status: "complete",
      user_id: "1",
    });
    expect(result).toEqual({
      id: 1,
      status: "complete",
      user_id: "1",
    });
  });

  it("delete method should remove the selected order", async () => {
    await store.delete(1);
    const result = await store.index();
    expect(result).toEqual([]);
  });
});
