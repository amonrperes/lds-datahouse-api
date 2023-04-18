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
const axios = require('axios');

const LDSDatahouseUrl = 'http://localhost:3000/register';

const body = {
  name: 'Amon Peres',
  email: 'ap@someemaildomain.com',
  username: <YOUR_LCR_USERNAME>,
  password: <YOUR_LCR_PASSWORD>
}

axios.post(LDSDatahouseUrl, body).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});

```
Reponse:
```json
{
  "status": "OK",
  "message": "User authorized",
  "api_credentials": { 
     "api_token": <YOUR_API_TOKEN>
  },
  "privacy_note": "We do not store any of your LCR credentials or sensitive personal information. LCR credentials are only used to check an user permission to use LCR and to sync data pertinent to an user calling."
}
```

## Sync

After registering and with your api token in hands it's time to sync the available data.

```javascript
const axios = require('axios');

const LDSDatahouseUrl = 'http://localhost:3000/sync';

const body = {
  lcr_username: <YOUR_LCR_USERNAME>,
  lcr_password: <YOUR_LCR_PASSWORD>
}

axios.post(LDSDatahouseUrl, body, {headers: {
  apitoken: <YOUR_API_TOKEN>
}}).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});

```
Reponse:
```json
{ 
  "status": "OK", 
  "message": "Successfully updated" 
}
```

## New Members

The New Members list is an available resource to be retrieved using the LDS Datahouse API.

```javascript
const axios = require('axios');

const apiUrl = 'http://localhost:3000/new-members';

axios.get(apiUrl, {
  headers: {
    apitoken: <YOUR_API_TOKEN>
  }
}).then(response => {
  console.log(response.data);
}).catch(error => {
  console.error(error);
});

```
Reponse:
```json
{
  "status": "OK",
  "data": [
    {
      ...
    }
  ]
}
```

## Privacy Note
LDS Datahouse API DO NOT store your LCR credentials in any circunstaces. LCR credentials are only used to validate you have access to the Leader and Clerk Resources and to sync LCR data in the database. We take care of personal data in a very carefully way.
