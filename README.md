# GreenRun - Sports
![](https://rebustech.io/wp-content/uploads/2020/12/GreenRun-Logo-Design-final-high-resolution-green-1.png)
This repository has a demonstration about REST API that could be used for a sportsbook application.

## Deployed in Heroku
You can use this URL to make tests of the API:
- https://grenrun-sports.herokuapp.com/

## Technologies & frameworks used
- Nodejs
- Typescript
- MySQL
- Hapi
- Knex
- Heroku
- JWT

## Database diagram
![](screenshots/db_diagram_scrs1.png)
This is the proposal for managing the creation of different types of transactions, such as deposits, withdrawals, bets and rewards when winning.

## Users endpoints
![](screenshots/postman_scrs1.png)

### Register user

Request:
```json
POST /register HTTP/1.1
Accept: application/json
Content-Type: application/json
{
    "role": "user",
    "first_name": "Marissa",
    "last_name": "Hills",
    "phone": "3003802299",
    "email": "marissahills@gmail.com",
    "password": "marisa123",
    "username": "JoeManson",
    "address": "Avenue 20 12 street",
    "gender": "male",
    "birth_date": "1987-08-22",
    "country_id": "1",
    "city": "Miami",
    "category": "rookie",
    "document_id": "100275241",
    "user_state": "active"
}
```

Correct output:
```json
{
    "statusCode": 201,
    "message": "User registration done"
}
```

### Login user

Request:
```json
POST /login HTTP/1.1
Accept: application/json
Content-Type: application/json
{
    "email": "marissahills@gmail.com",
    "password": "marisa123",
}
```
Correct output:
```json
{
  "statusCode": 200,
  "accessToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJpbGxmQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiYmlsbDEyMyIsImlhdCI6MTY2NTExNDczNSwiZXhwIjoxNjY1MjAxMTM1fQ.Uqa6VT7dfZGD478f6ttXRC7eUf-bIyALJvzFZ_1SaWaqXzP2ZHfqniCyUxrEtKbChXPb8sqevL_guuBc_HRncg",
  "message": "Logged in successfully"
}
```

### Update user info
Request:
```json
PUT /users/<user_id> HTTP/1.1
Authorization: "Bearer <accessToken>"
Accept: application/json
Content-Type: application/json
{
    "last_name": "P. Thomson",
    "address": "Avenue 11-12 street",
}
```

Correct output:
```json
{
  "statusCode": 201,
  "message": "User info updated"
}
```

### Update user state
**Only admin users can use this endpoint**

Request:
```json
PUT /users/state/<user_id> HTTP/1.1
Authorization: "Bearer <accessToken>"
Accept: application/json
Content-Type: application/json
{
    "state": "blocked"
}
```

Correct output:
```json
{
  "statusCode": 201,
  "message": "User state updated"
}
```
## Transactions endpoints
### Make a deposit
Request:
```json
POST /transactions/deposit/user/<user_id> HTTP/1.1
Authorization: "Bearer <accessToken>"
Accept: application/json
Content-Type: application/json
{
    "amount": 10000
}
```

Correct output:
```json
{
  "statusCode": 201,
  "message": "Deposit transaction done"
}
```

### Make a withdraw
Request:
```json
POST /transactions/withdraw/user/<user_id> HTTP/1.1
Authorization: "Bearer <accessToken>"
Accept: application/json
Content-Type: application/json
{
    "amount": 1000
}
```

Correct output:
```json
{
  "statusCode": 201,
  "message": "Withdraw transaction done"
}
```

### Make a bet
Request:
```json
POST /transactions/bet/user/<user_id> HTTP/1.1
Authorization: "Bearer <accessToken>"
Accept: application/json
Content-Type: application/json
{
    "amount": 2000
}
```

Correct output:
```json
{
  "statusCode": 201,
  "message": "Bet transaction done"
}
```

### Get user transactions balance
Request:
```json
GET /transactions/balance/user/<user_id> HTTP/1.1
Authorization: "Bearer <accessToken>"
Accept: application/json
Content-Type: application/json
```

Correct output:
```json
{
  "statusCode": 200,
  "balance": 7000,
  "message": "Get balance transactions done"
}
```

### Get user transactions by category
Request:
```json
GET /transactions/category/<category>/user/<user_id> HTTP/1.1
Authorization: "Bearer <accessToken>"
Accept: application/json
Content-Type: application/json
```

Correct output:

```json
{
  "statusCode": 200,
  "transactions": [
    {
      "id": 84,
      "user_id": 34,
      "user_bet_id": 4,
      "amount": 10000,
      "category": "bet",
      ...

    },
    ...
  ],
  "message": "Get transactions by category <category> done"
}
```

### Get all transactions from a user
Request:
```json
GET /transactions/user/<user_id> HTTP/1.1
Authorization: "Bearer <accessToken>"
Accept: application/json
Content-Type: application/json
```

Correct output:

```json
{
  "statusCode": 200,
  "transactions": [
    {
      "id": 34,
      "user_id": 34,
      "user_bet_id": null,
      "amount": 35000,
      "category": "deposit",
      ...

    },
    ...
  ],
  "message": "Get user transactions done"
}
```

## Bets endpoints

### Get bet transactions by sport
Request:
```json
GET /transactions/bets/sport/<sport> HTTP/1.1
Authorization: "Bearer <accessToken>"
Accept: application/json
Content-Type: application/json
```

Correct output:

```json
{
  "statusCode": 200,
  "bets": [
    {
      "id": 4,
      "event_id": 4,
      "bet_option": 1,
      "sport": "soccer",
      ...

    },
    ...
  ],
  "message": "Get bets by sport <sport> done"
}
```

### Get all transactions by bet option name

Request:
```json
GET /transactions/bets/name/<name> HTTP/1.1
Authorization: "Bearer <accessToken>"
Accept: application/json
Content-Type: application/json
```

Correct output:

```json
{
  "statusCode": 200,
  "bets": [
    {
      "id": 4,
      "event_id": 4,
      "bet_option": 1,
      "sport": "soccer",
      "status": "settled",
      "name": "Millonarios DC",
      ...

    },
    ...
  ],
  "message": "Get bets by name <name> done"
}
```

### Change event status - Active or Cancelled
**Only admin users can use this endpoint**

Request:
```json
PUT /bets/status/event/<event_id> HTTP/1.1
Authorization: "Bearer <accessToken>"
Accept: application/json
Content-Type: application/json
{
    "status": "cancelled"
}
```

Correct output:

```json
{
  "statusCode": 201,
  "message": "Event status updated"
}
```

### Settle an event
**Only admin users can use this endpoint**

Request:
```json
PUT /bets/settle/event/<event_id> HTTP/1.1
Authorization: "Bearer <accessToken>"
Accept: application/json
Content-Type: application/json
{
    "status": "settled"
}
```

Correct output:

```json
{
  "statusCode": 201,
  "message": "Event was settled successfully"
}
```

### Create an event

- Pending to do this endpoint



## Pending implementations
- Create event endpoint
- Add roles' usage.

## Authors
- Cristian Pinzon