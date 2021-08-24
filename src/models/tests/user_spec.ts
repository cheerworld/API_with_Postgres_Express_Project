import { User, UserStore } from "../user";

const store = new UserStore();
/*
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
    expect(result.id).toBe(1);
  });

  it("index method should return a list of users", async () => {
    const result = await store.index();
    expect(result).toHaveSize(1);
  });

  it("show method should return the correct user", async () => {
    const result = await store.show(1);

    expect(result.first_name).toEqual("Yuguo");
  });

  it("update method should update the existing user first name to Cheer", async () => {
    const user = {
      id: 1,
      first_name: "Cheer",
      last_name: "Zhao",
      password: "12345",
    };
    const result = await store.update(user);

    expect(result.first_name).toEqual("Cheer");
  });

  it("authenticate method should verify the input user info match user info in database", async () => {
    const result = await store.authenticate("Yuguo", "Zhao", "12345");

    expect(result).toBeNull();
  });

  it("delete method should delete the user", async () => {
    await store.delete(1);
    const result = await store.index();
    expect(result).toHaveSize(0);
  });
});
*/
