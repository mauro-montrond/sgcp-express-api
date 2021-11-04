const express = require('express');
const router = express.Router();
const individualController = require('../controllers/individual.controller');
const individualFullController = require('../controllers/individualFull.controller');
const auth = require('../middleware/auth.middleware');
const Action = require('../utils/menuActions.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
// new
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const upload = multer({
    storage: multer.memoryStorage(),
    // storage: storage,
    limits: {fileSize: 2.8 * Math.pow(1024, 2 /* MBs*/)},
    fileFilter(req, file, cb){
        //Validate the files as you wish, this is just an example
        let valImg = true;
        if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
            valImg = false;
            // dynamically add a error for each file field
            eval("req." + file.fieldname + "ValidationError = " + '"Only image files are allowed!";');
        }
        cb(null, valImg);
        // cb(null, file.mimetype === 'image/jpeg');
    },
});

const uploadFields = upload.fields([
    { name: 'l_photoFile', maxCount: 1},
    { name: 'f_photoFile', maxCount: 1},
    { name: 'r_photoFile', maxCount: 1},
    { name: 'r_thumbFile', maxCount: 1},
    { name: 'r_indexFile', maxCount: 1},
    { name: 'r_middleFile', maxCount: 1},
    { name: 'r_ringFile', maxCount: 1},
    { name: 'r_littleFile', maxCount: 1},
    { name: 'l_thumbFile', maxCount: 1},
    { name: 'l_indexFile', maxCount: 1},
    { name: 'l_middleFile', maxCount: 1},
    { name: 'l_ringFile', maxCount: 1},
    { name: 'l_littleFile', maxCount: 1},
]);
// end new

const { createIndividualSchema, updateIndividualSchema, getIndividualsSchema,  deleteIndividualSchema} = require('../middleware/validators/individualValidator.middleware');
const { createIndividualFullSchema, updateIndividualFullSchema, getIndividualsFullSchema,  deleteIndividualFullSchema} = require('../middleware/validators/individualFullValidator.middleware');

router.get('/', auth(Action.Individual.listIndividual.listIndividualByParams), awaitHandlerFactory(individualController.getAllProfile)); // localhost:3000/api/v1/individuals
router.get('/params', auth(Action.Individual.listIndividual.listIndividualByParams), getIndividualsSchema, awaitHandlerFactory(individualController.getIndividualsByParams)); // localhost:3000/api/v1/individuals/params
router.get('/full/params', auth(Action.Individual.listIndividual.listIndividualByParams), getIndividualsFullSchema, awaitHandlerFactory(individualFullController.getIndividualsFullByParams)); // localhost:3000/api/v1/individuals/full/params
router.get('/id/:id', auth(Action.Individual.listIndividual.listIndividualByParams), awaitHandlerFactory(individualController.getIndividualById)); // localhost:3000/api/v1/individuals/id/1
router.get('/doc_num/:doc_num', auth(Action.Individual.listIndividual.listIndividualByParams), awaitHandlerFactory(individualController.getIndividualByCode)); // localhost:3000/api/v1/individuals/doc_num/123456789 
router.post('/', auth(Action.Individual.createIndividual),createIndividualSchema, awaitHandlerFactory(individualController.createIndividual)); // localhost:3000/api/v1/individuals
router.post('/full', auth(Action.Individual.createIndividual), uploadFields, createIndividualFullSchema, awaitHandlerFactory(individualFullController.createIndividualFull)); // localhost:3000/api/v1/individuals/full
router.patch('/id/:id', auth(Action.Individual.updateIndividual), updateIndividualSchema, awaitHandlerFactory(individualController.updateIndividual)); // localhost:3000/api/v1/individuals/id/3 , using patch for partial update
router.patch('/full/id/:id', auth(Action.Individual.updateIndividual), updateIndividualFullSchema, awaitHandlerFactory(individualFullController.updateIndividualFull)); // localhost:3000/api/v1/individuals/full/id/3 , using patch for partial update
router.delete('/id/:id', auth(Action.Individual.deleteIndividual), deleteIndividualSchema, awaitHandlerFactory(individualController.deleteIndividual)); // localhost:3000/api/v1/individuals/id/3
router.delete('/full/id/:id', auth(Action.Individual.deleteIndividual), deleteIndividualFullSchema, awaitHandlerFactory(individualFullController.deleteIndividualFull)); // localhost:3000/api/v1/individuals/full/id/3


module.exports = router;