const express = require('express');
const router = express.Router();
const geografiaController = require('../controllers/geografia.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { getGeografiasSchema } = require('../middleware/validators/geografiaValidator.middleware');


router.get('/params', getGeografiasSchema, awaitHandlerFactory(geografiaController.getGeografiasByParams)); // localhost:3000/api/v1/geografia/params


module.exports = router;