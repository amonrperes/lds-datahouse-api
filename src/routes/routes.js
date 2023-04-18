const express = require('express');

const LCR = require('../controllers/lcr/index');
const Auth = require('../controllers/auth/index');

const routes = express.Router();

routes.post('/register', Auth.registerUser);

routes.post('/sync', LCR.syncData);
routes.get('/new-members', LCR.retrieveNewMembersList);

module.exports = routes;
