const express = require('express');

const LCR = require('../controllers/lcr/index');

const routes = express.Router();

routes.post('/sync', LCR.syncData);
routes.get('/retrieve/new-member', LCR.retrieveNewMembersList);

module.exports = routes;
