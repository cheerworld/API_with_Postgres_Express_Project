# Storefront Backend Project

## Getting Started

This repo contains a basic Node and Express app for Storefront Backend API.

- To get this project, type `git clone https://github.com/cheerworld/API_with_Postgres_Express_Project.git` in your terminal and `cd api-with-postgresql-and-express-project` to get into your project. This project is running on port 3000.

To get started developing:

- Install, create database and start the API server

  In psql SQL Shell

  - Create user and password using command `CREATE USER full_stack_user WITH PASSWORD 'password123';`
  - Create 2 databases in your postgres SQL Shell, 1 for development, 1 for testing. `CREATE DATABASE full_stack_dev;`
  - `\c full_stack_dev`
  - `GRANT ALL PRIVILEGES ON DATABASE full_stack_dev TO full_stack_user;`
  - `CREATE DATABASE full_stack_dev_test;`
  - `\c full_stack_dev_test`
  - `GRANT ALL PRIVILEGES ON DATABASE full_stack_dev_test TO full_stack_user;`
  - To test that it is working run `\dt` and it should output "No relations found."

  In terminal

  - `npm install`
  - For Development Environment
    - Manually change `ENV=dev` in .env file
    - Run `npm run watch` each time when there are changes in codes
  - For Test Environment
    - Manually change `ENV=test` in .env file
    - Run `npm run start` each time when there are changes in test specs
    - In another terminal, run `npm run test` to test codes

## Used Technologies

This application has the following libraries:

- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing
- supertest for testing endpoints
- bcrypt from npm for hashing passwords

## Environment Variables

- POSTGRES_HOST=localhost
- POSTGRES_DB=art_store_dev
- POSTGRES_USER=art_store_user
- POSTGRES_PASSWORD=password123
- POSTGRES_TEST_DB=art_store_dev_test
- ENV=test
- PEPPER=hello-world
- SALT_ROUNDS=10
- TOKEN_SECRET=POPO1234!
- POSTGRES_PASSWORD_TEST=12345

## More Information

- You can find the environment variable structure in .env.example.
- You can find all endpoints and database schema in [REQUIREMENTS.md file](/REQUIREMENTS.md).
