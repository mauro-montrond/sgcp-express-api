const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo.controller');
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
    { name: 'l_photoFile', maxCount: 1},
    { name: 'f_photoFile', maxCount: 1},
    { name: 'r_photoFile', maxCount: 1},
]);

const { createPhotoSchema, updatePhotoSchema, getPhotosSchema,  deletePhotoSchema } = require('../middleware/validators/photoValidator.middleware');


router.get('/', auth(Action.Photos.listPhotos.listPhotosByParams), awaitHandlerFactory(photoController.getAllPhoto)); // localhost:3000/api/v1/photos
router.get('/params', auth(Action.Photos.listPhotos.listPhotosByParams), getPhotosSchema, awaitHandlerFactory(photoController.getPhotosByParams)); // localhost:3000/api/v1/photos/params
router.get('/id/:id', auth(Action.Photos.listPhotos.listPhotosByParams), awaitHandlerFactory(photoController.getPhotoById)); // localhost:3000/api/v1/photos/id/1
router.get('/individual/:individual_id', auth(Action.Photos.listPhotos.listPhotosByParams), awaitHandlerFactory(photoController.getPhotoByIndividualId)); // localhost:3000/api/v1/photos/individual/4
router.post('/', auth(Action.Photos.createPhotos), uploadFields, createPhotoSchema, awaitHandlerFactory(photoController.createPhoto)); // localhost:3000/api/v1/photos
router.patch('/id/:id', auth(Action.Photos.updatePhotos), uploadFields, updatePhotoSchema, awaitHandlerFactory(photoController.updatePhoto)); // localhost:3000/api/v1/photos/id/4 , using patch for partial update
router.delete('/id/:id', auth(Action.Photos.deletePhotos), deletePhotoSchema, awaitHandlerFactory(photoController.deletePhoto)); // localhost:3000/api/v1/photos/id/4


module.exports = router;