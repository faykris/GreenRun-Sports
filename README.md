# GreenRun - Sports
![](https://rebustech.io/wp-content/uploads/2020/12/GreenRun-Logo-Design-final-high-resolution-green-1.png)
This repository has a demonstration about an API that could be used for a sportsbook application.

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

## Endpoints usage
![](screenshots/postman_scrs1.png)

### Register User

Request:
```json5
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
```json5
{
    "statusCode": 201,
    "message": "User registration done"
}
```

### Login User

Request:
```json5
POST /login HTTP/1.1
Accept: application/json
Content-Type: application/json
{
    "email": "marissahills@gmail.com",
    "password": "marisa123",
}
```
Correct output:
```json5
{
  "statusCode": 200,
  "accessToken": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJpbGxmQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiYmlsbDEyMyIsImlhdCI6MTY2NTExNDczNSwiZXhwIjoxNjY1MjAxMTM1fQ.Uqa6VT7dfZGD478f6ttXRC7eUf-bIyALJvzFZ_1SaWaqXzP2ZHfqniCyUxrEtKbChXPb8sqevL_guuBc_HRncg",
  "message": "Logged in successfully"
}
```

## Pending implementations
- Demo video of the API usage
- Add endpoint descriptions
- Add the roles' usage.

## Authors
- Cristian Pinzon