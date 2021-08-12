/* Replace with your SQL commands */
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  quantity integer NOT NULL,
  status VARCHAR(64) NOT NULL,
  user_id bigint REFERENCES users(id) NOT NULL,
  product_id bigint REFERENCES products(id) NOT NULL
);