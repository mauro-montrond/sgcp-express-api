const { body } = require('express-validator');
const PhotoStates = require('../../utils/photoStates.utils.js');
const { getNormalizedColumns } = require('../../utils/photoColumnNormalizer.utils.js');
const PhotoModel  = require('../../models/photo.model');
const IndividualModel  = require('../../models/individual.model');


exports.createPhotoSchema = [
    body('individual_id')
        .exists()
        .withMessage('Individual id is required')
        .notEmpty()
        .withMessage("Individual id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Individual id must be a number")
        .custom(async () => {
            const findIndividuals = await IndividualModel.find();
            if(findIndividuals.length)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('No individuals exist')
        .custom(async element => {
            const findIndividual = await IndividualModel.findOne( {'ID': element} );
            if(findIndividual)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Individual does not exist')
        .custom(async element => {
            const findIndividual = await IndividualModel.findOne( {'ID': element} );
            if(findIndividual && findIndividual.ESTADO != 'A')
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('That individual is not in a valid state'),
    body('l_photo')
        .exists()
        .withMessage('Left photo is required')
        .notEmpty()
        .withMessage("Left photo must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long')
        .isURL()
        .withMessage('Must be a URL')
        .custom(async element => {
            const findPhoto = await PhotoModel.findPhoto(element);
            if(findPhoto)
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('Photo already exists')
        .custom((value, {req}) => {
            if ( value && ((req.body.f_photo && value == req.body.f_photo) || (req.body.r_photo && value == req.body.r_photo)) )
                return false;
            else
                return true;
        })
        .withMessage('Each photo must be different'),
    body('f_photo')
        .exists()
        .withMessage('Frontal photo is required')
        .notEmpty()
        .withMessage("Frontal photo must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long')
        .isURL()
        .withMessage('Must be a URL')
        .custom(async element => {
            const findPhoto = await PhotoModel.findPhoto(element);
            if(findPhoto)
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('Photo already exists')
        .custom((value, {req}) => {
            if ( value && ((req.body.l_photo && value == req.body.l_photo) || (req.body.r_photo && value == req.body.r_photo)) )
                return false;
            else
                return true;
        })
        .withMessage('Each photo must be different'),
    body('r_photo')
        .exists()
        .withMessage('Right photo is required')
        .notEmpty()
        .withMessage("Right photo must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long')
        .isURL()
        .withMessage('Must be a URL')
        .custom(async element => {
            const findPhoto = await PhotoModel.findPhoto(element);
            if(findPhoto)
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('Photo already exists')
        .custom((value, {req}) => {
            if ( value && ((req.body.l_photo && value == req.body.l_photo) || (req.body.f_photo && value == req.body.f_photo)) )
                return false;
            else
                return true;
        })
        .withMessage('Each photo must be different'),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(PhotoStates)
        .withMessage('Invalid state type'),
    body()
        .custom(value => {
            //convert object keys into column names
            var creatList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for creation and see if the ones sent match
            const allowCreation = ['ID_INDIVIDUO', 'FOTO_ESQUERDA', 'FOTO_FRONTAL', 'FOTO_DIREITA', 'ESTADO'];
            return creatList.every(parameter => allowCreation.includes(parameter));
        })
        .withMessage('Invalid extra fields!')
];

exports.updatePhotoSchema = [
    body('l_photo')
        .optional()
        .notEmpty()
        .withMessage("Left photo must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long')
        .isURL()
        .withMessage('Must be a URL')
        .custom(async (element, {req}) => {
            const currentPhoto = await PhotoModel.findOne({'ID': req.params.id});
            if(currentPhoto){
                if(currentPhoto.FOTO_ESQUERDA == element)
                    return Promise.resolve();
                else {
                    const findPhoto = await PhotoModel.findPhoto(element);
                    if(findPhoto)
                        return Promise.reject();
                    else
                        return Promise.resolve();
                }
            }
            else
                return Promise.resolve();
        })
        .withMessage('Photo already exists')
        .custom((value, {req}) => {
            if ( value && ((req.body.f_photo && value == req.body.f_photo) || (req.body.r_photo && value == req.body.r_photo)) )
                return false;
            else
                return true;
        })
        .withMessage('Each photo must be different'),
    body('f_photo')
        .optional()
        .notEmpty()
        .withMessage("Frontal photo must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long')
        .isURL()
        .withMessage('Must be a URL')
        .custom(async (element, {req}) => {
            const currentPhoto = await PhotoModel.findOne({'ID': req.params.id});
            if(currentPhoto){
                if(currentPhoto.FOTO_FRONTAL == element)
                    return Promise.resolve();
                else {
                    const findPhoto = await PhotoModel.findPhoto(element);
                    if(findPhoto)
                        return Promise.reject();
                    else
                        return Promise.resolve();
                }
            }
            else
                return Promise.resolve();
        })
        .withMessage('Photo already exists')
        .custom((value, {req}) => {
            if ( value && ((req.body.l_photo && value == req.body.l_photo) || (req.body.r_photo && value == req.body.r_photo)) )
                return false;
            else
                return true;
        })
        .withMessage('Each photo must be different'),
    body('r_photo')
        .optional()
        .notEmpty()
        .withMessage("Right photo must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long')
        .isURL()
        .withMessage('Must be a URL')
        .custom(async (element, {req}) => {
            const currentPhoto = await PhotoModel.findOne({'ID': req.params.id});
            if(currentPhoto){
                if(currentPhoto.FOTO_DIREITA == element)
                    return Promise.resolve();
                else {
                    const findPhoto = await PhotoModel.findPhoto(element);
                    if(findPhoto)
                        return Promise.reject();
                    else
                        return Promise.resolve();
                }
            }
            else
                return Promise.resolve();
        })
        .withMessage('Photo already exists')
        .custom((value, {req}) => {
            if ( value && ((req.body.l_photo && value == req.body.l_photo) || (req.body.f_photo && value == req.body.f_photo)) )
                return false;
            else
                return true;
        })
        .withMessage('Each photo must be different'),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(PhotoStates)
        .withMessage('Invalid state type'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(async () => {
            const findIndividuals = await PhotoModel.find();
            if(findIndividuals.length)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('No individuals exist')
        .custom(value => {
            // convert object keys into colum names
            var updatesList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for updating and see if the ones sent match
            const allowUpdates = ['FOTO_ESQUERDA', 'FOTO_FRONTAL', 'FOTO_DIREITA', 'ESTADO'];
            return updatesList.every(parameter => allowUpdates.includes(parameter));
        })
        .withMessage('Invalid updates!')
];

exports.getPhotosSchema = [
    body('id')
        .optional()
        .notEmpty()
        .withMessage("Id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Id must be a number"),
    body('individual_id')
        .optional()
        .notEmpty()
        .withMessage("Individual id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Individual id must be a number"),
    body('l_photo')
        .optional()
        .notEmpty()
        .withMessage("Left photo must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long')
        .isURL()
        .withMessage('Must be a URL'),
    body('f_photo')
        .optional()
        .notEmpty()
        .withMessage("Frontal photo must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long')
        .isURL()
        .withMessage('Must be a URL'),
    body('r_photo')
        .optional()
        .notEmpty()
        .withMessage("Right photo must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long')
        .isURL()
        .withMessage('Must be a URL'),
    body('created_at')
        .optional()
        .notEmpty()
        .withMessage("Created at must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss'),
    body('created_at_limit')
        .optional()
        .notEmpty()
        .withMessage("Created at limit must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss')
        .custom((created_at_lim, { req }) => {
            if(req.body.created_at && created_at_lim <= req.body.created_at)
                return false;
            else
                return true;
        })
        .withMessage('End date must be after start date'),
    body('created_at_range')
        .optional()
        .notEmpty()
        .withMessage("Indicator must be filled")
        .trim()
        .isIn(['yes', 'no'])
        .withMessage('Invalid indicator')
        .custom((value, { req }) => { 
            if(value === 'yes' && !req.body.created_at && !req.body.created_at_limit)
                return false;
            else
                return true;
        })
        .withMessage('No range provided'),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(PhotoStates)
        .withMessage('Invalid state type'),
    body()
        .custom(value => {
            // convert object keys into colum names
            var searchList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for searching and see if the ones sent match
            const allowSearch = ['ID', 'ID_INDIVIDUO', 'FOTO_ESQUERDA', 'FOTO_FRONTAL', 'FOTO_DIREITA', 'ESTADO', 'DATA_REGISTO', 
                                 'created_at_limit', 'created_at_range'];
            return searchList.every(parameter => allowSearch.includes(parameter));
        })
        .withMessage('Invalid extra fields!')
];

exports.deletePhotoSchema = [
    body()
        .custom(async (value, {req}) => {
            const findPhoto = await PhotoModel.findOne( {'ID': req.params.id} );
            if(findPhoto)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Photos not found!')
];