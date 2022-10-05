# Data Peace Storage NodeJS API Server

### In this application, Swagger JSDoc and Swagger UI Express are used to automatically generate OpenAPI documentation

### to demonstrate the RESTful APIs created using NodeJs environment in ExpressJS framework.

### SQLite DBMS is used for querying on DB.

<br />

## Creating NodeJS environment

With [NodeJS](https://nodejs.org/en/) installed, create an empty folder and open it through terminal.

Use `npm init` to generate package.json file.

Use `npm install` to install the packages.

Exported the express instance using the default export syntax.

Used Common JS module syntax.

<br />

## Running the Server

You can started the server by running,

```sh
node app.js
```

_**OR**_

```sh
nodemon app.js
```

<br />

## Accessing the Docs

With your local server running, the generated docs are available here: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

<br />

## Details of the APIs Created

Given an `app.js` file and a database file `dataPeaceStorage.db` consisting of a table `userDetails`.

Following APIs perform operations on the table `userDetails` containing the following columns,

**userDetails Table**

| Column       | Type    |
| ------------ | ------- |
| id           | INTEGER |
| first_name   | VARCHAR |
| last_name    | VARCHAR |
| company_name | VARCHAR |
| city         | VARCHAR |
| state        | VARCHAR |
| zip          | INTEGER |
| email        | VARCHAR |
| web          | VARCHAR |
| age          | INTEGER |
|              |         |

<br />

<Section id="section1" >

### API 1

#### Path: `/api/users/`

#### Method: `GET`

#### Description:

Returns the list of users. Default limit is 5

#### Response

- **Status code**
  ```
  200
  ```
- **Body**
  ```
  [
      {
          "id": 1,
          "first_name": "James",
          "last_name": "Butt",
          "company_name": "Benton, John B Jr",
          "city": "New Orleans",
          "state": "LA",
          "zip": 70116,
          "email": "jbutt@gmail.com",
          "web": "http://www.bentonjohnbjr.com",
          "age": 70
      },
      {
          "id": 2,
          "first_name": "Josephine",
          "last_name": "Darakjy",
          "company_name": "Chanay, Jeffrey A Esq",
          "city": "Brighton",
          "state": "MI",
          "zip": 48116,
          "email": "josephine_darakjy@darakjy.org",
          "web": "http://www.chanayjeffreyaesq.com",
          "age": 48
      },
      .
      .
      .
  ]
  ```
- **Scenario 1**

  - **Sample API**
    ```
    /api/users?page=1&limit=10&name=James&sort=-age
    ```
  - **Description**:

        page - a number for pagination

        limit - no. of items to be returned, default limit is 5

        name - search user by name as a substring in First Name or Last Name. It is case-insensitive.

        Sort - name of attribute, the items to be sorted. By default it returns items in ascending order if this parameter exist, and if the value of parameter is prefixed with ‘-’ character, then it should return items in descending order

        This endpoint returns list of 10 users whose first name or last name contains substring given name and sort the users by age in descending order of page 1.

</Section>

<Section id="section2">

### API 2

#### Path: `/api/users`

#### Method: `POST`

#### Description:

Creates a user in the userDetails table

#### Request

```
{
  "id": 2,
  "first_name": "Josephine",
  "last_name": "Darakjy",
  "company_name": "Chanay, Jeffrey A Esq",
  "city": "Brighton",
  "state": "MI",
  "zip": 48116,
  "email": "josephine_darakjy@darakjy.org",
  "web": "http://www.chanayjeffreyaesq.com",
  "age": 48
}
```

#### Response

- **Status code**
  ```
  201
  ```
- **Body**
  ```
  {}
  ```

</Section>

<Section id="section3">

### API 3

#### Path: `/api/users/{id}`

#### Method: `GET`

- **Scenario 1**

  - **Description**:

    If the requested user id doesn't exist

  - **Response**
    - **Status code**
      ```
      404
      ```
    - **Body**
      ```
      Not Found
      ```

- **Scenario 2**

  - **Description**:

    If the requested user id exists returns the user details

  - **Response**
    - **Status code**
      ```
      200
      ```
    - **Body**
      ```
      {
      "id": 1,
      "first_name": "James",
      "last_name": "Butt",
      "company_name": "Benton, John B Jr",
      "city": "New Orleans",
      "state": "LA",
      "zip": 70116,
      "email": "jbutt@gmail.com",
      "web": "http://www.bentonjohnbjr.com",
      "age": 70
      }
      ```

</Section>

<Section id="section4">

### API 4

#### Path: `/api/users/{id}`

#### Method: `PUT`

- **Scenario 1**

  - **Description:**

    Updates the details of a specific user based on the user id

  - **Request**
    ```
    {
       "first_name": "Josephine",
       "last_name": "Darakjy",
       "age": 48
    }
    ```
  - **Response**
    - **Status code**
      ```
      200
      ```
    - **Body**
      ```
      {}
      ```

- **Scenario 2**

  - **Description**:

    If the requested user id to update a user doesn't exist

  - **Response**
    - **Status code**
      ```
      404
      ```
    - **Body**
      ```
      Not Found
      ```

  </Section>

<Section id="section5">

### API 5

#### Path: `/api/users/{id}`

#### Method: `DELETE`

- **Scenario 1**

  - **Description**:

    If the requested user id to delete a user doesn't exist

  - **Response**
    - **Status code**
      ```
      404
      ```
    - **Body**
      ```
      Not Found
      ```

- **Scenario 2**

  - **Description**:

    If the requested user id to delete a user exist

  - **Response**
    - **Status code**
      ```
      200
      ```
    - **Body**
      ```
      {}
      ```

</Section>

<br/>
