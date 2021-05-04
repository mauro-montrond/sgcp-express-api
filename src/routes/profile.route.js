const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const auth = require('../middleware/auth.middleware');
const Action = require('../utils/menuActions.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createProfileSchema, updateProfileSchema, getProfilesSchema,  deleteProfileSchema} = require('../middleware/validators/profileValidator.middleware');

router.get('/', auth(Action.Profile.listProfile.listProfileByParams), awaitHandlerFactory(profileController.getAllProfile)); // localhost:3000/api/v1/profiles
router.get('/params', auth(Action.Profile.listProfile.listProfileByParams), getProfilesSchema, awaitHandlerFactory(profileController.getProfilesByParams)); // localhost:3000/api/v1/profiles/params
router.get('/id/:id', auth(Action.Profile.listProfile.listProfileByParams), awaitHandlerFactory(profileController.getProfileById)); // localhost:3000/api/v1/profiles/id/1
router.get('/code/:code', auth(Action.Profile.listProfile.listProfileByParams), awaitHandlerFactory(profileController.getProfileByCode)); // localhost:3000/api/v1/profiles/code/SGCP_UT_01 
router.post('/', auth(Action.Profile.createProfile), createProfileSchema, awaitHandlerFactory(profileController.createProfile)); // localhost:3000/api/v1/profiles
router.patch('/code/:code', auth(Action.Profile.updateProfile), updateProfileSchema, awaitHandlerFactory(profileController.updateProfile)); // localhost:3000/api/v1/profiles/code/SGCP_UT_01 , using patch for partial update
router.delete('/code/:code', auth(Action.Profile.deleteProfile), deleteProfileSchema, awaitHandlerFactory(profileController.deleteProfile)); // localhost:3000/api/v1/profiles/code/SGCP_UT_04


module.exports = router;