import { User, UserStore } from "../user";

const store = new UserStore();

describe("User Model", () => {
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

  it("should have a authenticate method", () => {
    expect(store.authenticate).toBeDefined();
  });

  it("create method should add a user", async () => {
    const result = await store.create({
      first_name: "Yuguo",
      last_name: "Zhao",
      password: "1234",
    });
    //console.log(result);
    expect(result.id).toBe(1);
  });

  it("index method should return a list of users", async () => {
    const result = await store.index();
    console.log(result);
    expect(result).toHaveSize(1);
  });

  it("show method should return the correct user", async () => {
    const result = await store.show(1);
    console.log(result);
    console.log(result.first_name);

    expect(result.first_name).toEqual("Yuguo");
  });
});
