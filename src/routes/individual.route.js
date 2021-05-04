const express = require('express');
const router = express.Router();
const individualController = require('../controllers/individual.controller');
const auth = require('../middleware/auth.middleware');
const Action = require('../utils/menuActions.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createIndividualSchema, updateIndividualSchema, getIndividualsSchema,  deleteIndividualSchema} = require('../middleware/validators/individualValidator.middleware');

router.get('/', auth(Action.Individual.listIndividual.listIndividualByParams), awaitHandlerFactory(individualController.getAllProfile)); // localhost:3000/api/v1/individuals
router.get('/params', auth(Action.Individual.listIndividual.listIndividualByParams), getIndividualsSchema, awaitHandlerFactory(individualController.getIndividualsByParams)); // localhost:3000/api/v1/individuals/params
router.get('/id/:id', auth(Action.Individual.listIndividual.listIndividualByParams), awaitHandlerFactory(individualController.getIndividualById)); // localhost:3000/api/v1/individuals/id/1
router.get('/doc_num/:doc_num', auth(Action.Individual.listIndividual.listIndividualByParams), awaitHandlerFactory(individualController.getIndividualByCode)); // localhost:3000/api/v1/individuals/doc_num/123456789 
router.post('/', auth(Action.Individual.createIndividual), createIndividualSchema, awaitHandlerFactory(individualController.createIndividual)); // localhost:3000/api/v1/individuals
router.patch('/id/:id', auth(Action.Individual.updateIndividual), updateIndividualSchema, awaitHandlerFactory(individualController.updateIndividual)); // localhost:3000/api/v1/individuals/id/3 , using patch for partial update
router.delete('/id/:id', auth(Action.Individual.deleteIndividual), deleteIndividualSchema, awaitHandlerFactory(individualController.deleteIndividual)); // localhost:3000/api/v1/individuals/id/3


module.exports = router;