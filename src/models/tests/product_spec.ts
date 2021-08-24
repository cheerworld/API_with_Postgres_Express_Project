import { Product, ProductStore } from "../product";

const store = new ProductStore();

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

  it("create method should add a product", async () => {
    const result = await store.create({
      name: "Monet Lotus Painting",
      price: 199.99,
      category: "painting",
    });
    expect(result).toEqual({
      id: 2,
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
        id: 2,
        name: "Monet Lotus Painting",
        price: "199.99",
        category: "painting",
      },
    ]);
  });

  it("show method should return the correct product", async () => {
    const result = await store.show(2);
    expect(result.name).toBe("Monet Lotus Painting");
  });

  it("update method should return the updated product", async () => {
    const result = await store.update({
      id: 2,
      name: "Monet Lotus Painting",
      price: 2999.99,
      category: "painting",
    });
    expect(result.price).toBe("2999.99");
  });

  it("delete method should remove the selected product", async () => {
    await store.delete(2);
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
