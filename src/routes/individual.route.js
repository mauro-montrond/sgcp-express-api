const express = require('express');
const router = express.Router();
const individualController = require('../controllers/individual.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createIndividualSchema, updateIndividualSchema, getIndividualsSchema,  deleteIndividualSchema} = require('../middleware/validators/individualValidator.middleware');

const tp = ['1','2']

router.get('/', awaitHandlerFactory(individualController.getAllProfile)); // localhost:3000/api/v1/individuals
router.get('/params', getIndividualsSchema, awaitHandlerFactory(individualController.getIndividualsByParams)); // localhost:3000/api/v1/individuals/params
router.get('/id/:id', awaitHandlerFactory(individualController.getIndividualById)); // localhost:3000/api/v1/individuals/id/1
router.get('/doc_num/:doc_num', awaitHandlerFactory(individualController.getIndividualByCode)); // localhost:3000/api/v1/individuals/doc_num/123456789 
router.post('/', auth(tp), createIndividualSchema, awaitHandlerFactory(individualController.createIndividual)); // localhost:3000/api/v1/individuals
router.patch('/id/:id', updateIndividualSchema, awaitHandlerFactory(individualController.updateIndividual)); // localhost:3000/api/v1/individuals/id/3 , using patch for partial update
router.delete('/id/:id', deleteIndividualSchema, awaitHandlerFactory(individualController.deleteIndividual)); // localhost:3000/api/v1/individuals/id/3


module.exports = router;