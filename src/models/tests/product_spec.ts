import { Product, ProductStore } from "../product";
import { DashboardQueries } from "../../services/dashboard";
import dotenv from "dotenv";
import supertest from "supertest";
import app from "../../server";

const request = supertest(app);

dotenv.config();

const { POSTGRES_PASSWORD_TEST } = process.env;

const store = new ProductStore();

const dashboardStore = new DashboardQueries();

describe("Product Model", () => {
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

  describe("products endpoints testing", () => {
    let token: string;
    it("authenticate method to /users/authenticate should authenticate user", async () => {
      const response = await request
        .post("/users/authenticate")
        .send({
          first_name: "Yuguo",
          last_name: "Zhao",
          password: POSTGRES_PASSWORD_TEST as string,
        })
        .set("Accept", "application/json");
      token = "Bearer " + response.body;
      expect(response.status).toEqual(200);
    });

    it("posts to /products should create a new product", async () => {
      const response = await request
        .post("/products")
        .send({
          name: "Yanyuan Necklace",
          price: 599.99,
          category: "jewelry",
        })
        .set("Accept", "application/json")
        .set("Authorization", token);
      expect(response.body).toEqual({
        id: 2,
        name: "Yanyuan Necklace",
        price: "599.99",
        category: "jewelry",
      });
    });

    it("gets /products should get a list of products", async () => {
      const response = await request.get("/products");
      expect(response.body.length).toBe(2);
    });

    it("gets /products/2 should get the selected product", async () => {
      const response = await request.get("/products/2");
      expect(response.status).toBe(200);
    });

    it("put method to /products/2 should update product 2's price to 699.99", async () => {
      const response = await request
        .put("/products/2")
        .send({
          name: "Yanyuan Necklace",
          price: 699.99,
          category: "jewelry",
        })
        .set("Accept", "application/json")
        .set("Authorization", token);
      expect(response.body.price).toBe("699.99");
    });

    it("get method to /products/categories/:category should return products by category", async () => {
      const response = await request.get("/products/categories/jewelry");
      expect(response.body[0].category).toEqual("jewelry");
    });

    it("delete method to /products/2 should delete this selected product", async () => {
      const response = await request
        .delete("/products/2")
        .set("Authorization", token)
        .set("Accept", "application/json");
      expect(response.status).toBe(200);
    });
  });

  it("create method should add a product", async () => {
    const result = await store.create({
      name: "Monet Lotus Painting",
      price: 199.99,
      category: "painting",
    });
    expect(result).toEqual({
      id: 3,
      name: "Monet Lotus Painting",
      price: "199.99",
      category: "painting",
    });
  });

  it("index method should return a list of products", async () => {
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        name: "Cheer Painting",
        price: "699.99",
        category: "painting",
      },
      {
        id: 3,
        name: "Monet Lotus Painting",
        price: "199.99",
        category: "painting",
      },
    ]);
  });

  it("productsByCategory method should get products by category", async () => {
    const result = await dashboardStore.productsByCategory("painting");
    expect(result).toHaveSize(2);
  });

  it("show method should return the correct product", async () => {
    const result = await store.show(1);
    expect(result.name).toBe("Cheer Painting");
  });

  it("update method should return the updated product", async () => {
    const result = await store.update({
      id: 3,
      name: "Monet Lotus Painting",
      price: 2999.99,
      category: "painting",
    });
    expect(result.price).toBe("2999.99");
  });

  it("delete method should remove the selected product", async () => {
    await store.delete(3);
    const result = await store.index();
    expect(result).toEqual([
      {
        id: 1,
        name: "Cheer Painting",
        price: "699.99",
        category: "painting",
      },
    ]);
  });

  afterAll(async () => {
    await store.delete(1);
  });
});
