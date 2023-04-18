# LDS Datahouse API
## _A Open Source API to access LDS Leaders and Clerk Resources_

LDS Datahouse API is a REST API based on a web scrapping service,
used to access features from https://lcr.churchofjesuschrist.org.

## Current Features
- Retrieve new members' data from New Member report.

## Tech
- [Node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework
- [Knex.js] - SQL query builder for javascript

## Installation

LDS Datahouse API requires [Node.js](https://nodejs.org/) v10+ to run locally.

Clone this repository, Install the dependencies, update the migrations and database, and start the server.

```sh
git clone https://github.com/amonrperes/lds-datahouse-api.git
cd lds-datahouse-api

npm install

npx knex migrate:latest
npm start
```

## Registration

You'll need to register your LDS Credentials in order to check if you have access to the Leaders and Clerks Resources and receive API Credentials.

```javascript
import fetch from 'node-fetch'

const body = {
  name: '<YOUR NAME>',
  email: '<YOUR EMAIL>',
  username: '<YOUR_LCR_USERNAME>',
  password: '<YOUR_LCR_PASSWORD>'
};

const response = await fetch('http://localhost:3000/register', {
  method: 'post',
  body: JSON.stringify(body)
});

const data = await response.json();

console.log(data);
```
Reponse:
```json
{
  "status": "OK",
  "message": "User authorized",
  "api_credentials": {
    "api_token": "token_"
  }
}
```

With your API credentials, now you can make requests sending it through the headers like this:
```json
{
  "headers": {
    "Bearer sid_:token_"
  }  
}
```

## Privacy Note
LDS Datahouse API DO NOT store your LCR credentials in any circunstaces. LCR credentials are only used to validate you have access to the Leader and Clerk Resources and to sync LCR data in the database. We take care of personal data in a very carefully way.
