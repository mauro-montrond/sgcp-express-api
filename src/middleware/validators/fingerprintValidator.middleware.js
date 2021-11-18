const { body } = require('express-validator');
const { getNormalizedColumns } = require('../../utils/fingerprintColumnNormalizer.utils.js');
const FingerprintModel  = require('../../models/fingerprint.model');
const IndividualModel  = require('../../models/individual.model');


exports.createFingerprintSchema = [
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
        .withMessage('That individual is not in a valid state')
        .custom(async element => {
            const findIndividual = await FingerprintModel.findOne( {'ID_INDIVIDUO': element} );
            if(findIndividual)
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage("That individual's fingerprints are already in the database"),
    body('r_thumbFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('r_indexFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('r_middleFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('r_ringFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('r_littleFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_thumbFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_indexFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_middleFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_ringFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_littleFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body()
        .custom((value, {req}) => {
            if(req.body.r_thumb || req.body.r_index|| req.body.r_middle || req.body.r_ring || req.body.r_little ||
               req.body.l_thumb || req.body.l_index|| req.body.l_middle || req.body.l_ring || req.body.l_little) {
                   return false;
            } else {
                //convert object keys into column names
                var creatList = getNormalizedColumns(Object.keys(value));
                //Set the allowed field for creation and see if the ones sent match
                const allowCreation = ['ID_INDIVIDUO', 'POLEGAR_DIREITO', 'INDICADOR_DIREITO', 'MEDIO_DIREITO', 'ANELAR_DIREITO', 'MINDINHO_DIREITO', 
                                       'POLEGAR_ESQUERDO', 'INDICADOR_ESQUERDO', 'MEDIO_ESQUERDO', 'ANELAR_ESQUERDO', 'MINDINHO_ESQUERDO'];
                return creatList.every(parameter => allowCreation.includes(parameter));
            }
        })
        .withMessage('Invalid extra fields!')
];

exports.updateFingerprintSchema = [
    body('r_thumbFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('r_indexFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('r_middleFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('r_ringFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('r_littleFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_thumbFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_indexFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_middleFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_ringFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_littleFile')
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
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body()
        .custom((value, {req}) => {
            return !!(Object.keys(value).length + Object.keys(req.files).length);
        })
        .withMessage('Please provide required field to update')
        .custom(async () => {
            const findIndividuals = await IndividualModel.find();
            if(findIndividuals.length)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('No individuals exist')
        .custom(async (value, {req}) => {
            const findIndividual = await FingerprintModel.findOne( {'ID_INDIVIDUO': req.params.individual_id} );
            if(findIndividual)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('That individual has no fingerprints in the database!')
        .custom((value, {req}) => {
            if(req.body.r_thumb || req.body.r_index|| req.body.r_middle || req.body.r_ring || req.body.r_little ||
               req.body.l_thumb || req.body.l_index|| req.body.l_middle || req.body.l_ring || req.body.l_little) {
                   return false;
            } else {
                // convert object keys into colum names
                var updatesList = getNormalizedColumns(Object.keys(value));
                //Set the allowed field for updating and see if the ones sent match
                const allowUpdates = ['POLEGAR_DIREITO', 'INDICADOR_DIREITO', 'MEDIO_DIREITO', 'ANELAR_DIREITO', 'MINDINHO_DIREITO', 
                                      'POLEGAR_ESQUERDO', 'INDICADOR_ESQUERDO', 'MEDIO_ESQUERDO', 'ANELAR_ESQUERDO', 'MINDINHO_ESQUERDO'];
                return updatesList.every(parameter => allowUpdates.includes(parameter));
            }
        })
        .withMessage('Invalid updates!')
];

exports.getFingerprintsSchema = [
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
    body('r_thumb')
        .optional()
        .notEmpty()
        .withMessage("Right thumb must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('r_index')
        .optional()
        .notEmpty()
        .withMessage("Right index finger must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('r_middle')
        .optional()
        .notEmpty()
        .withMessage("Right middle finger must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('r_ring')
        .optional()
        .notEmpty()
        .withMessage("Right ring finger must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('r_little')
        .optional()
        .notEmpty()
        .withMessage("Right little finger must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('l_thumb')
        .optional()
        .notEmpty()
        .withMessage("Left thumb must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('l_index')
        .optional()
        .notEmpty()
        .withMessage("Left index finger must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('l_middle')
        .optional()
        .notEmpty()
        .withMessage("Left middle finger must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('l_ring')
        .optional()
        .notEmpty()
        .withMessage("Left ring finger must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('l_little')
        .optional()
        .notEmpty()
        .withMessage("Left little finger must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
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
    body()
        .custom(value => {
            // convert object keys into colum names
            var searchList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for searching and see if the ones sent match
            const allowSearch = ['ID', 'ID_INDIVIDUO', 'POLEGAR_DIREITO', 'INDICADOR_DIREITO', 'MEDIO_DIREITO', 'ANELAR_DIREITO', 'MINDINHO_DIREITO', 
                                  'POLEGAR_ESQUERDO', 'INDICADOR_ESQUERDO', 'MEDIO_ESQUERDO', 'ANELAR_ESQUERDO', 'MINDINHO_ESQUERDO', 'DATA_REGISTO', 
                                  'created_at_limit', 'created_at_range'];
            return searchList.every(parameter => allowSearch.includes(parameter));
        })
        .withMessage('Invalid extra fields!')
];

exports.deleteFingerprintSchema = [
    body()
        .custom(async (value, {req}) => {
            const findIndividual = await IndividualModel.findOne( {'ID': req.params.individual_id} );
            if(findIndividual)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Individual not found!')
        .custom(async (value, {req}) => {
            const findIndividual = await IndividualModel.findOne( {'ID': req.params.individual_id} );
            if(findIndividual) {
                const findFingerprint = await FingerprintModel.findOne( {'ID_INDIVIDUO': req.params.individual_id} );
                if(findFingerprint)
                    return Promise.resolve();
                else
                    return Promise.reject();
            }
            else
                Promise.resolve();
        })
        .withMessage('Fingerprints of that individual were not found!')
];

checkDuplicateFingerprint = (req, fingerprint) => {
    let found = 0;
    if (fingerprint){
        if(req.files["r_thumbFile"] && req.files["r_thumbFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["r_indexFile"] && req.files["r_indexFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["r_middleFile"] && req.files["r_middleFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["r_ringFile"] && req.files["r_ringFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["r_littleFile"] && req.files["r_littleFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["l_thumbFile"] && req.files["l_thumbFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["l_indexFile"] && req.files["l_indexFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["l_middleFile"] && req.files["l_middleFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["l_ringFile"] && req.files["l_ringFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["l_littleFile"] && req.files["l_littleFile"][0].originalname == fingerprint)
            found += 1;
    }
    return found;
}