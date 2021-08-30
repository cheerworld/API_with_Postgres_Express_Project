# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

| Methods | API Endpoints                  | Models                                        |
| ------- | ------------------------------ | --------------------------------------------- |
| GET     | /products                      | Index                                         |
| GET     | /products/:id                  | Show                                          |
| POST    | /products                      | Create [token required]                       |
| PUT     | /products/:id                  | Update [token required]                       |
| DELETE  | /products/:id                  | Remove [token required]                       |
| GET     | /five_most_popular             | Top 5 most popular products                   |
| GET     | /products/categories/:category | Products by category (args: product category) |

#### Users

| Methods | API Endpoints       | Models                                 | Params                                                                    |
| ------- | ------------------- | -------------------------------------- | ------------------------------------------------------------------------- |
| POST    | /all/users          | Index [token required]                 | None                                                                      |
| POST    | /all/users/:id      | Show [token required]                  | req.params.id                                                             |
| POST    | /users              | Create                                 | req.body.first_name, req.body.last_name, req.body.password                |
| PUT     | /users/:id          | Update [verify token user ID required] | req.params.id, req.body.first_name, req.body.last_name, req.body.password |
| DELETE  | /users/:id          | Remove [verify token user ID required] | req.params.id                                                             |
| POST    | /users/authenticate | Authenticate                           | req.body.first_name, req.body.last_name, req.body.password                |

#### Orders

| Methods | API Endpoints              | Models                                                                  |
| ------- | -------------------------- | ----------------------------------------------------------------------- |
| GET     | /orders                    | Index                                                                   |
| GET     | /orders/:id                | Show                                                                    |
| POST    | /orders                    | Create                                                                  |
| PUT     | /orders/:id                | Update                                                                  |
| DELETE  | /orders/:id                | Remove                                                                  |
| POST    | /orders/:id/products       | Add product to order                                                    |
| POST    | /orders/users/:id/current  | Current Orders by user (args: user id)[verify token user ID required]   |
| POST    | /orders/users/:id/complete | Completed Orders by user (args: user id)[verify token user ID required] |

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
