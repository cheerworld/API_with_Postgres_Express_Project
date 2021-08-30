# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. I built the API that will support this application for its backend.

These are the descriptions that describe what endpoints the API needs to supply, as well as data shapes, schema the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

| Method | API Endpoint                   | Model                                         | Parameter           | Sample JSON                                                          |
| ------ | ------------------------------ | --------------------------------------------- | ------------------- | -------------------------------------------------------------------- |
| GET    | /products                      | Index                                         | none                | none                                                                 |
| GET    | /products/:id                  | Show                                          | id - [number]       | none                                                                 |
| POST   | /products                      | Create [token required]                       | none                | { "name": "product name", "price": "price", "category": "category" } |
| PUT    | /products/:id                  | Update [token required]                       | id - [number]       | { "name": "product name", "price": "price", "category": "category" } |
| DELETE | /products/:id                  | Remove [token required]                       | id - [number]       | none                                                                 |
| GET    | /five_most_popular             | Top 5 most popular products                   | none                | none                                                                 |
| GET    | /products/categories/:category | Products by category (args: product category) | category - [string] | none                                                                 |

#### Users

| Method | API Endpoint        | Model                                  | Parameter     | Sample JSON                                                                      |
| ------ | ------------------- | -------------------------------------- | ------------- | -------------------------------------------------------------------------------- |
| POST   | /all/users          | Index [token required]                 | none          | none                                                                             |
| POST   | /all/users/:id      | Show [token required]                  | id - [number] | none                                                                             |
| POST   | /users              | Create                                 | none          | { "first_name": "first name", "last_name": "last name", "password": "password" } |
| PUT    | /users/:id          | Update [verify token user ID required] | id - [number] | { "first_name": "first name", "last_name": "last name" "password": "password" }  |
| DELETE | /users/:id          | Remove [verify token user ID required] | id - [number] | none                                                                             |
| POST   | /users/authenticate | Authenticate                           | none          | { "first_name": "first name", "last_name": "last name", "password": "password" } |

#### Orders

| Method | API Endpoint               | Model                                                                   | Parameter     | Sample JSON                                                                    |
| ------ | -------------------------- | ----------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------ |
| GET    | /orders                    | Index                                                                   | none          | none                                                                           |
| GET    | /orders/:id                | Show                                                                    | id - [number] | none                                                                           |
| POST   | /orders                    | Create                                                                  | none          | { "user_id": "user id" }                                                       |
| PUT    | /orders/:id                | Update                                                                  | id - [number] | { "status": "status", "user_id": "user id" }                                   |
| DELETE | /orders/:id                | Remove                                                                  | id - [number] | none                                                                           |
| POST   | /orders/:id/products       | Add product to order                                                    | id - [number] | { "quantity": "quantity", "product_id": "product_id", "order_id": "order_id" } |
| POST   | /orders/users/:id/current  | Current Orders by user (args: user id)[verify token user ID required]   | id - [number] | none                                                                           |
| POST   | /orders/users/:id/complete | Completed Orders by user (args: user id)[verify token user ID required] | id - [number] | none                                                                           |

## Data Shapes and Schema

#### products

| Columns  | Types                  |
| -------- | ---------------------- |
| id       | SERIAL PRIMARY KEY     |
| name     | VARCHAR(100) NOT NULL  |
| price    | NUMERIC(10,2) NOT NULL |
| category | VARCHAR(64)            |

- Indexes: "products_pkey" PRIMARY KEY, btree(id)
- Referenced by: TABLE "order_products" CONSTRAINT "order_products_product_id_fkey" FOREIGN KEY (product_id) REFERENCERS products(id) ON DELETE RESTRICT

#### users

| Columns    | Types                |
| ---------- | -------------------- |
| id         | SERIAL PRIMARY KEY   |
| first_name | VARCHAR(50) NOT NULL |
| last_name  | VARCHAR(50) NOT NULL |
| password   | VARCHAR NOT NULL     |

- Indexes: "users_pkey" PRIMARY KEY, btree(id)
- Referenced by: TABLE "orders" CONSTRAINT "orders_user_id_fkey" FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE

#### orders

| Columns                    | Types                                         |
| -------------------------- | --------------------------------------------- |
| id                         | SERIAL PRIMARY KEY                            |
| status(active or complete) | VARCHAR(64)                                   |
| user_id                    | bigint REFERENCES users(id) ON DELETE CASCADE |

- Indexes: "orders_pkey" PRIMARY KEY, btree(id)
- Foreign-key constraints: "orders_user_id_fkey" FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
- Referenced by: TABLE "order_products" CONSTRAINT "order_products_order_id_fkey" FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE

#### order_products

| Columns    | Types                                             |
| ---------- | ------------------------------------------------- |
| id         | SERIAL PRIMARY KEY                                |
| quantity   | integer                                           |
| order_id   | bigint REFERENCES orders(id) ON DELETE CASCADE    |
| product_id | bigint REFERENCES products(id) ON DELETE RESTRICT |

- Indexes: "order_products_pkey" PRIMARY KEY, btree(id)
- Foreign-key constraints:
  "order_products_order_id_fkey" FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
  "order_products_product_id_fkey" FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE RESTRICT
