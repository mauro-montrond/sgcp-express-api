const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createProfileSchema, updateProfileSchema, getProfilesSchema,  deleteProfileSchema} = require('../middleware/validators/profileValidator.middleware');

router.get('/', awaitHandlerFactory(profileController.getAllProfile)); // localhost:3000/api/v1/profiles
router.get('/params', getProfilesSchema, awaitHandlerFactory(profileController.getProfilesByParams)); // localhost:3000/api/v1/profiles/params
router.get('/id/:id', awaitHandlerFactory(profileController.getProfileById)); // localhost:3000/api/v1/profiles/id/1
router.get('/code/:code', awaitHandlerFactory(profileController.getProfileByCode)); // localhost:3000/api/v1/profiles/code/SGCP_UT_01 
router.post('/', createProfileSchema, awaitHandlerFactory(profileController.createProfile)); // localhost:3000/api/v1/profiles
router.patch('/code/:code', updateProfileSchema, awaitHandlerFactory(profileController.updateProfile)); // localhost:3000/api/v1/profiles/code/SGCP_UT_01 , using patch for partial update
router.delete('/code/:code', deleteProfileSchema, awaitHandlerFactory(profileController.deleteProfile)); // localhost:3000/api/v1/profiles/code/SGCP_UT_04


module.exports = router;