const express = require('express');
const router = express.Router();
const fingerprintController = require('../controllers/fingerprint.controller');
const auth = require('../middleware/auth.middleware');
const Action = require('../utils/menuActions.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const multer = require('multer');

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
    },
});

const uploadFields = upload.fields([
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

const { createFingerprintSchema, updateFingerprintSchema, getFingerprintsSchema,  deleteFingerprintSchema } = require('../middleware/validators/fingerprintValidator.middleware');


router.get('/', auth(Action.Fingerprints.listFingerprints.listFingerprintsByParams), awaitHandlerFactory(fingerprintController.getAllFingerprint)); // localhost:3000/api/v1/fingerprints
router.get('/params', auth(Action.Fingerprints.listFingerprints.listFingerprintsByParams), getFingerprintsSchema, awaitHandlerFactory(fingerprintController.getFingerprintsByParams)); // localhost:3000/api/v1/fingerprints/params
router.get('/id/:id', auth(Action.Fingerprints.listFingerprints.listFingerprintsByParams), awaitHandlerFactory(fingerprintController.getFingerprintById)); // localhost:3000/api/v1/fingerprints/id/1
router.get('/individual/:individual_id', auth(Action.Fingerprints.listFingerprints.listFingerprintsByParams), awaitHandlerFactory(fingerprintController.getFingerprintByIndividualId)); // localhost:3000/api/v1/fingerprints/individual/4
router.post('/', auth(Action.Fingerprints.createFingerprints), uploadFields, createFingerprintSchema, awaitHandlerFactory(fingerprintController.createFingerprint)); // localhost:3000/api/v1/fingerprints
router.patch('/individual/:individual_id', auth(Action.Fingerprints.updateFingerprints), uploadFields, updateFingerprintSchema, awaitHandlerFactory(fingerprintController.updateFingerprint)); // localhost:3000/api/v1/fingerprints/individual/4 , using patch for partial update
router.delete('/individual/:individual_id', auth(Action.Fingerprints.deleteFingerprints), deleteFingerprintSchema, awaitHandlerFactory(fingerprintController.deleteFingerprint)); // localhost:3000/api/v1/fingerprints/individual/4


module.exports = router;