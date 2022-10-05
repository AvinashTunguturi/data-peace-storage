const { application, response } = require("express");
const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "dataPeaceStorage.db");
let dataPeaceStorage = null;
const initializeDBAndServer = async () => {
  try {
    dataPeaceStorage = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(PORT);
  } catch (e) {
    process.exit(1);
  }
};
initializeDBAndServer();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Data Peace Storage API",
      version: "1.0.0",
      description: "Managing the user’s data",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["app.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     UserDetails:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - company_name
 *         - city
 *         - state
 *         - zip
 *         - email
 *         - web
 *         - age
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         first_name:
 *           type: string
 *           description: First name of the User
 *         last_name:
 *           type: string
 *           description: Last name of the User
 *         company_name:
 *           type: string
 *           description: Company name of the User
 *         city:
 *           type: string
 *           description: City of the User
 *         state:
 *           type: string
 *           description: State
 *         zip:
 *           type: integer
 *           description: ZipCode
 *         email:
 *           type: string
 *           description: email of the User
 *         web:
 *           type: string
 *           description: website of the User
 *         age:
 *           type: integer
 *           description: Age of the User
 *       example:
 *           id: 1
 *           first_name: Will Carroll
 *           last_name: Smith
 *           company_name: Warner Bros
 *           city: Philadelphia
 *           state: Pennsylvania
 *           zip: 19093
 *           email: willsmith@gmail.com
 *           web: http://www.willsmith.com
 *           age: 54
 *
 */

/**
 * @swagger
 * tags:
 *   name: User Details
 *   description: The user details managing API
 *
 *
 */

/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [User Details]
 *     description: Get list of users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: The numbers of items to return
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *           description: Search String
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           description: Attribute name by which the result sorts.
 *                        Default ascending order, prefix "-" indicates descending order
 *
 *     responses:
 *       200:
 *         description: Success
 *
 *
 */

app.get("/api/users/", async (request, response) => {
  const { page = 1, limit = 5, name = "", sort = "" } = request.query;

  const offset = (page - 1) * limit;

  let order = "ASC";
  let order_by_attribute = sort;

  const firstCharacter = sort.charAt();
  if (firstCharacter === "-") {
    order = "DESC";
    order_by_attribute = sort.slice(1);
  }

  const getUserDetails = `
    SELECT
        *
    FROM 
        userDetails
    WHERE 
        first_name LIKE '%${name}%' OR 
        last_name  LIKE '%${name}%'
    ORDER BY '${order_by_attribute}' ${order}
    LIMIT ${limit}
    OFFSET ${offset};`;

  const userDetailsList = await dataPeaceStorage.all(getUserDetails);
  response.status(200);
  response.send(userDetailsList);
});

/**
 * @swagger
 * /api/users/:
 *   post:
 *     summary: Create a new user
 *     tags: [User Details]
 *     requestBody:
 *       required: true
 *       description: Remove id as it is auto generated
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDetails'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *
 *
 *
 */

app.post("/api/users/", async (request, response) => {
  const userDetails = request.body;
  const {
    first_name,
    last_name,
    company_name,
    city,
    state,
    zip,
    email,
    web,
    age,
  } = userDetails;
  const addUserQuery = `
      INSERT INTO
        userDetails (
            first_name,
            last_name,
            company_name,      
            city,
            state,
            zip,
            email,
            web,
            age
        )
      VALUES
        (
          '${first_name}',
          '${last_name}',
          '${company_name}',
          '${city}',
          '${state}',
           ${zip},
          '${email}',
          '${web}',
           ${age}          
        );`;

  await dataPeaceStorage.run(addUserQuery);
  response.status(201);
  response.send({});
});

/**
 * @swagger
 * /api/users/{id}:
 *  get:
 *    summary: Get the user by id
 *    tags: [User Details]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The user id
 *    responses:
 *      200:
 *        description: The user description by id
 *      404:
 *        description: The user details not found
 *
 *
 */

app.get("/api/users/:id", async (request, response) => {
  const { id } = request.params;
  const getUserQuery = `
          SELECT
          *
          FROM
          userDetails
          WHERE
          id = ${id};`;
  const user = await dataPeaceStorage.get(getUserQuery);
  if (user !== undefined) {
    response.status(200);
    response.send(user);
  } else {
    response.sendStatus(404);
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *  put:
 *    summary: Update the user by the id
 *    tags: [User Details]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: The user id
 *    requestBody:
 *
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *                 - first_name
 *                 - last_name
 *                 - age
 *          properties:
 *            first_name:
 *                 type: string
 *                 description: First name of the User
 *            last_name:
 *                 type: string
 *                 description: Last name of the User
 *            age:
 *                 type: integer
 *                 description: Age of the User
 *          example:
 *            first_name: Will
 *            last_name: Smith
 *            age: 50
 *
 *    responses:
 *      200:
 *        description: The user was updated
 *      404:
 *        description: The user details not found
 *
 */

app.put("/api/users/:id", async (request, response) => {
  const { id } = request.params;
  const { first_name, last_name, age } = request.body;
  const updateUserQuery = `
    UPDATE
      userDetails
    SET
      first_name ='${first_name}',
      last_name = '${last_name}',
      age = ${age}
    WHERE
      id = ${id};`;
  const updatedUser = await dataPeaceStorage.run(updateUserQuery);
  const { changes } = updatedUser;
  if (changes !== 0) {
    response.status(200);
    response.send({});
  } else {
    response.sendStatus(404);
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Remove the user by id
 *     tags: [User Details]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: Resource not exists
 *
 */

app.delete("/api/users/:id", async (request, response) => {
  const { id } = request.params;
  const deleteUserQuery = `
    DELETE FROM 
      userDetails
    WHERE 
      id=${id};`;
  const deletedUser = await dataPeaceStorage.run(deleteUserQuery);
  const { changes } = deletedUser;
  if (changes !== 0) {
    response.status(200);
    response.send({});
  } else {
    response.sendStatus(404);
  }
});
