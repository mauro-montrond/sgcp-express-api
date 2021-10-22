const PhotoModel = require('../models/photo.model');
const HttpException = require('../utils/HttpException.utils');
const { getNormalizedColumnsValues } = require('../utils/photoColumnNormalizer.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
const IndividualModel = require('../models/individual.model');
dotenv.config();

/******************************************************************************
 *                              Photo Controller
 ******************************************************************************/
class FingerprintController {
    getAllPhoto = async (req, res, next) => {
        let photoList = await PhotoModel.find();
        if (!photoList.length) {
            throw new HttpException(404, 'Photos not found');
        }

        res.send(photoList);
    };

    getPhotoById = async (req, res, next) => {
        const photo = await PhotoModel.findOne({ ID: req.params.id });
        if (!photo) {
            throw new HttpException(404, 'Photos not found');
        }
        res.send(photo);
    };

    getPhotoByIndividualId = async (req, res, next) => {
        const individual = await IndividualModel.findOne({ ID: req.params.individual_id });
        if(!individual) {
            throw new HttpException(404, 'Individual not found');
        }
        const photos = await PhotoModel.find({ ID_INDIVIDUO: req.params.individual_id });
        if (!photos.length) {
            throw new HttpException(404, 'Photos not found for that inividual');
        }

        res.send(photos);
    };

    getPhotosByParams = async (req, res, next) => {
        this.checkValidation(req);
        // convert the re.body keys into the actual names of the table's colums
        let photoList = getNormalizedColumnsValues(req.body);
        const photos = await PhotoModel.findMany(photoList);
        if (!photos.length) {
            throw new HttpException(404, 'Photos not found');
        }

        res.send(photos);
    };

    createPhoto = async (req, res, next) => {
        this.checkValidation(req);

        if(!req.currentUser){
            throw new HttpException(401, 'Unauthorized');
        }
        const { SENHA, ...userWithoutPassword } = req.currentUser;

        const result = await PhotoModel.create(req.body, userWithoutPassword.ID);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Photos created!');
    };

    updatePhoto = async (req, res, next) => {
        this.checkValidation(req);

        if(!req.currentUser){
            throw new HttpException(401, 'Unauthorized');
        }
        const { SENHA, ...userWithoutPassword } = req.currentUser;

        // do the update query and get the result
        // it can be partial edit
        // convert the re.body keys into the actual names of the table's colums
        let updates = getNormalizedColumnsValues(req.body);
        
        const result = await PhotoModel.update(updates, req.params.id, userWithoutPassword.ID);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Photos not found' :
            affectedRows && changedRows ? 'Photos updated successfully' : 'Updated field';

        res.send({ message, info });
    };

    deletePhoto = async (req, res, next) => {
        this.checkValidation(req);

        if(!req.currentUser){
            throw new HttpException(401, 'Unauthorized');
        }
        const { SENHA, ...userWithoutPassword } = req.currentUser;

        const result = await PhotoModel.delete(req.params.id, userWithoutPassword.ID);
        if (!result) {
            throw new HttpException(404, 'Photos not found');
        }
        res.send('Photos have been deleted');
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation failed', errors);
        }
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new FingerprintController;