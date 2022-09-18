# Fullstack-Typescript-Project
## Project Information 

This project is about e-commerce web application where the customer can buy the products offered by this online store using the web browser. 
There are two type of users. 
   - Customer: 
      - privileges: 
        - can order or cancel the product that user ordered, 
        - can review and rate the product, 
        - can modify or maintain the customer information
            - change addresses (max 3 addresses), other personal information
                      
   - Admin
      - privileges: 
        - Can publish the product and add new product product category, 
        - can delete review that given by user, 
        - can modify adim own information
        - can modify or delete customer information  
            - change addresses and User Level(to Admin or Customer), not customer personal information

  - links for  [Front-End](https://bucolic-mooncake-eb7f3b.netlify.app/)  and [Back-End](https://shop3-api.herokuapp.com/)
  - access for admin
    - user@admin.com
    - admin



## Prerequisites

1. Install mongodb or use MongoDB Atlas (cloud version) or:
2. Install postgresql or use heroku (or any cloud-host psql database)
2. Install nodejs (if you don't have it already)

## Setting Up for `API folder`

1. Create a `.env` file in the root directory and copy the content from `.env.example`

2. Make sure mongodb is running (if you are using local MongoDB)
3. Install dependencies: `yarn`
4. Use this command for development mode: `yarn run start:dev`
5. If you need to customize your env, take a look at `secrets.ts` file

## Requirements

Below are the steps that you need to finish in order to finish this module

1. Explore the code base of the api folder, start with `server.ts` and `app.ts`
2. Client folder is for the react frontend. Start with `api` first before moving on to `client`
3. Create all the schema for your ERD
4. Create CRUD endpoints for all the schema
5. Separate the routers and controller, controller goes into the controller folders. Controllers only handles request and response, and will call service to process business logics.
6. Create more controller for your app if needed. Eg: borrow books, add product to order
7. For business logic like saving data to database, filtering, searching or updating, these are services and goes into services folder
8. Add authentication middleware using passport, google and jwt strategy
9. Add tests for your controllers and services. Remember to create the jwt token for your tests, because if your controller is protected, then the test should send the token also
