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
            if(element) {
                const findIndividual = await IndividualModel.findOne( {'ID': element} );
                if(findIndividual)
                    return Promise.resolve();
                else
                    return Promise.reject();
            } else return Promise.resolve();
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
    body('l_photoFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path] && !!req.files["f_photoFile"]) {
                if(req.files[path][0].originalname == req.files["f_photoFile"][0].originalname)
                    return false;
            }
            if (!!req.files[path] && !!req.files["r_photoFile"]) {
                if(req.files[path][0].originalname == req.files["r_photoFile"][0].originalname)
                    return false;
            }
            return true;
        })
        .withMessage('each photo must be different!'),
    body('f_photoFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path] && !!req.files["l_photoFile"]) {
                if(req.files[path][0].originalname == req.files["l_photoFile"][0].originalname)
                    return false;
            }
            if (!!req.files[path] && !!req.files["r_photoFile"]) {
                if(req.files[path][0].originalname == req.files["r_photoFile"][0].originalname)
                    return false;
            }
            return true;
        })
        .withMessage('each photo must be different!'),
    body('r_photoFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path] && !!req.files["l_photoFile"]) {
                if(req.files[path][0].originalname == req.files["l_photoFile"][0].originalname)
                    return false;
            }
            if (!!req.files[path] && !!req.files["f_photoFile"]) {
                if(req.files[path][0].originalname == req.files["f_photoFile"][0].originalname)
                    return false;
            }
            return true;
        })
        .withMessage('each photo must be different!'),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(PhotoStates)
        .withMessage('Invalid state type'),
    body()
        .custom(async (value, {req}) => {
            const findIndividual = await IndividualModel.findOne( {'ID': req.body.individual_id} );
            if(findIndividual){
                const findPhoto = await PhotoModel.findOne({'ID_INDIVIDUO': req.body.individual_id});
                if(findPhoto){
                    if(!!(Object.keys(value).length + Object.keys(req.files).length))
                        return Promise.reject();
                } else return Promise.resolve();
            } else return Promise.resolve();
        })
        .withMessage('Please provide at least one photo')
        .custom((value, {req}) => {
            if(req.body.r_photo || req.body.f_photo|| req.body.l_photo) {
                   return false;
            } else {
                //convert object keys into column names
                var creatList = getNormalizedColumns(Object.keys(value));
                //Set the allowed field for creation and see if the ones sent match
                const allowCreation = ['ID_INDIVIDUO', 'FOTO_ESQUERDA', 'FOTO_FRONTAL', 'FOTO_DIREITA', 'ESTADO'];
                return creatList.every(parameter => allowCreation.includes(parameter));
            }
        })
        .withMessage('Invalid extra fields!')
];

exports.updatePhotoSchema = [
    body('l_photoFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path] && !!req.files["f_photoFile"]) {
                if(req.files[path][0].originalname == req.files["f_photoFile"][0].originalname)
                    return false;
            }
            if (!!req.files[path] && !!req.files["r_photoFile"]) {
                if(req.files[path][0].originalname == req.files["r_photoFile"][0].originalname)
                    return false;
            }
            return true;
        })
        .withMessage('each photo must be different!'),
    body('f_photoFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path] && !!req.files["l_photoFile"]) {
                if(req.files[path][0].originalname == req.files["l_photoFile"][0].originalname)
                    return false;
            }
            if (!!req.files[path] && !!req.files["r_photoFile"]) {
                if(req.files[path][0].originalname == req.files["r_photoFile"][0].originalname)
                    return false;
            }
            return true;
        })
        .withMessage('each photo must be different!'),
    body('r_photoFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path] && !!req.files["l_photoFile"]) {
                if(req.files[path][0].originalname == req.files["l_photoFile"][0].originalname)
                    return false;
            }
            if (!!req.files[path] && !!req.files["f_photoFile"]) {
                if(req.files[path][0].originalname == req.files["f_photoFile"][0].originalname)
                    return false;
            }
            return true;
        })
        .withMessage('each photo must be different!'),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(PhotoStates)
        .withMessage('Invalid state type'),
    body()
        .custom((value, {req}) => {
            return !!(Object.keys(value).length + Object.keys(req.files).length);
        })
        .withMessage('Please provide required field to update')
        .custom(async () => {
            const findPhotos = await PhotoModel.find();
            if(findPhotos.length)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('No photos exist')
        .custom(async (value, {req}) => {
            const findPhotos = await PhotoModel.findOne({'ID': req.params.id});
            if(findPhotos)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Photos not found')
        .custom((value, {req}) => {
            if(req.body.r_photo || req.body.f_photo|| req.body.l_photo) {
                   return false;
            } else {
                // convert object keys into colum names
                var updatesList = getNormalizedColumns(Object.keys(value));
                //Set the allowed field for updating and see if the ones sent match
                const allowUpdates = ['FOTO_ESQUERDA', 'FOTO_FRONTAL', 'FOTO_DIREITA', 'ESTADO'];
                return updatesList.every(parameter => allowUpdates.includes(parameter));
            }
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