const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createPhotoSchema, updatePhotoSchema, getPhotosSchema,  deletePhotoSchema } = require('../middleware/validators/photoValidator.middleware');


router.get('/', awaitHandlerFactory(photoController.getAllPhoto)); // localhost:3000/api/v1/photos
router.get('/params', getPhotosSchema, awaitHandlerFactory(photoController.getPhotosByParams)); // localhost:3000/api/v1/photos/params
router.get('/id/:id', awaitHandlerFactory(photoController.getPhotoById)); // localhost:3000/api/v1/photos/id/1
router.get('/individual/:individual_id', awaitHandlerFactory(photoController.getPhotoByIndividualId)); // localhost:3000/api/v1/photos/individual/4
router.post('/', createPhotoSchema, awaitHandlerFactory(photoController.createPhoto)); // localhost:3000/api/v1/photos
router.patch('/id/:id', updatePhotoSchema, awaitHandlerFactory(photoController.updatePhoto)); // localhost:3000/api/v1/photos/id/4 , using patch for partial update
router.delete('/id/:id', deletePhotoSchema, awaitHandlerFactory(photoController.deletePhoto)); // localhost:3000/api/v1/photos/id/4


module.exports = router;