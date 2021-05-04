const express = require('express');
const router = express.Router();
const precedentController = require('../controllers/precedent.controller');
const auth = require('../middleware/auth.middleware');
const Action = require('../utils/menuActions.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createPrecedentSchema, updatePrecedentSchema, getPrecedentsSchema,  deletePrecedentSchema} = require('../middleware/validators/precedentValidator.middleware');


router.get('/', auth(Action.Precedent.listPrecedent.listPrecedentByParams), awaitHandlerFactory(precedentController.getAllPrecedent)); // localhost:3000/api/v1/precedents
router.get('/params', auth(Action.Precedent.listPrecedent.listPrecedentByParams), getPrecedentsSchema, awaitHandlerFactory(precedentController.getPrecedentsByParams)); // localhost:3000/api/v1/precedents/params
router.get('/id/:id', auth(Action.Precedent.listPrecedent.listPrecedentByParams), awaitHandlerFactory(precedentController.getPrecedentById)); // localhost:3000/api/v1/precedents/id/1
router.post('/', auth(Action.Precedent.createPrecedent), createPrecedentSchema, awaitHandlerFactory(precedentController.createPrecedent)); // localhost:3000/api/v1/precedents
router.patch('/id/:id', auth(Action.Precedent.updatePrecedent), updatePrecedentSchema, awaitHandlerFactory(precedentController.updatePrecedent)); // localhost:3000/api/v1/precedents/id/1, using patch for partial update
router.delete('/id/:id', auth(Action.Precedent.deletePrecedent), deletePrecedentSchema, awaitHandlerFactory(precedentController.deletePrecedent)); // localhost:3000/api/v1/precedents/id/1

module.exports = router;