const express = require('express');

const LCR = require('../controllers/lcr/index');

const routes = express.Router();

routes.post('/sync', LCR.syncData);

module.exports = routes;