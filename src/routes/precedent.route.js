const express = require('express');
const router = express.Router();
const precedentController = require('../controllers/precedent.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createPrecedentSchema, updatePrecedentSchema, getPrecedentsSchema,  deletePrecedentSchema} = require('../middleware/validators/precedentValidator.middleware');

const tp = ['1','2']

router.get('/', awaitHandlerFactory(precedentController.getAllPrecedent)); // localhost:3000/api/v1/precedents
router.get('/params', getPrecedentsSchema, awaitHandlerFactory(precedentController.getPrecedentsByParams)); // localhost:3000/api/v1/precedents/params
router.get('/id/:id', awaitHandlerFactory(precedentController.getPrecedentById)); // localhost:3000/api/v1/precedents/id/1
router.post('/', auth(tp), createPrecedentSchema, awaitHandlerFactory(precedentController.createPrecedent)); // localhost:3000/api/v1/precedents
router.patch('/id/:id', updatePrecedentSchema, awaitHandlerFactory(precedentController.updatePrecedent)); // localhost:3000/api/v1/precedents/id/1, using patch for partial update
router.delete('/id/:id', deletePrecedentSchema, awaitHandlerFactory(precedentController.deletePrecedent)); // localhost:3000/api/v1/precedents/id/1

module.exports = router;