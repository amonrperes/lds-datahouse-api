const express = require('express');

const LCR = require('../controllers/lcr/index');
const Auth = require('../controllers/auth/index');

const routes = express.Router();

routes.post('/register', Auth.registerUser);
routes.get('/retrieve/users', Auth.retrieveUsersList);

routes.post('/sync', LCR.syncData);
routes.get('/retrieve/new-member', LCR.retrieveNewMembersList);

module.exports = routes;
