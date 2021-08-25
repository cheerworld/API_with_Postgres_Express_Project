import { User, UserStore } from "../user";
import dotenv from "dotenv";
import supertest from "supertest";
import app from "../../server";

const request = supertest(app);

dotenv.config();

const { POSTGRES_PASSWORD_TEST } = process.env;

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

  it("posts to /users endpoint", async () => {
    const response = await request
      .post("/users")
      .send({
        first_name: "Cheer",
        last_name: "Zhao",
        password: POSTGRES_PASSWORD_TEST as string,
      })
      .set("Accept", "application/json");
    console.log(response.body);
    expect(response.status).toEqual(200);
  });
  /*
  it("create method should add a user", async () => {
    const result = await store.create({
      first_name: "Cheer",
      last_name: "Zhao",
      password: POSTGRES_PASSWORD_TEST as string,
    });
    expect(result.id).toBe(2);
  });
*/
  it("index method should return a list of users", async () => {
    const result = await store.index();
    expect(result).toHaveSize(2);
  });

  it("show method should return the correct user", async () => {
    const result = await store.show(1);

    expect(result.first_name).toEqual("Yuguo");
  });

  it("update method should update the user id 2's first name to Ann", async () => {
    const user = {
      id: 2,
      first_name: "Ann",
      last_name: "Zhao",
      password: POSTGRES_PASSWORD_TEST as string,
    };
    const result = await store.update(user);

    expect(result.first_name).toEqual("Ann");
  });

  it("authenticate method should verify the input user info match user info in database", async () => {
    const result = await store.authenticate(
      "Cheer",
      "Zhao",
      POSTGRES_PASSWORD_TEST as string
    );

    expect(result).toBeNull();
  });

  it("delete method should delete the selected user", async () => {
    await store.delete(2);
    const result = await store.index();
    expect(result).toHaveSize(1);
  });

  afterAll(async () => {
    await store.delete(1);
  });
});
