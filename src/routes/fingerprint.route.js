const express = require('express');
const router = express.Router();
const fingerprintController = require('../controllers/fingerprint.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createFingerprintSchema, updateFingerprintSchema, getFingerprintsSchema,  deleteFingerprintSchema } = require('../middleware/validators/fingerprintValidator.middleware');


router.get('/', awaitHandlerFactory(fingerprintController.getAllFingerprint)); // localhost:3000/api/v1/fingerprints
router.get('/params', getFingerprintsSchema, awaitHandlerFactory(fingerprintController.getFingerprintsByParams)); // localhost:3000/api/v1/fingerprints/params
router.get('/id/:id', awaitHandlerFactory(fingerprintController.getFingerprintById)); // localhost:3000/api/v1/fingerprints/id/1
router.get('/individual/:individual_id', awaitHandlerFactory(fingerprintController.getFingerprintByIndividualId)); // localhost:3000/api/v1/fingerprints/individual/4
router.post('/', createFingerprintSchema, awaitHandlerFactory(fingerprintController.createFingerprint)); // localhost:3000/api/v1/fingerprints
router.patch('/individual/:individual_id', updateFingerprintSchema, awaitHandlerFactory(fingerprintController.updateFingerprint)); // localhost:3000/api/v1/fingerprints/individual/4 , using patch for partial update
router.delete('/individual/:individual_id', deleteFingerprintSchema, awaitHandlerFactory(fingerprintController.deleteFingerprint)); // localhost:3000/api/v1/fingerprints/individual/4


module.exports = router;