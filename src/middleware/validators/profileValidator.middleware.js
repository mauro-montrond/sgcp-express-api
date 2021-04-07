const { body } = require('express-validator');
const States = require('../../utils/profileStates.utils.js');
const { getNormalizedColumns } = require('../../utils/profileColumnNormalizer.utils.js');
const ProfileModel  = require('../../models/profile.model');


exports.createProfileSchema = [
    body('code')
        .exists()
        .withMessage('Code is required')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .isLength({ max: 10 })
        .withMessage('Code can contain max 10 characters')
        .matches(/^[a-zA-Z0-9-_ ]+$/)
        .withMessage("Can only contain: letters a-z, A-Z, - and _")
        .custom(async element => {
            const findCode = await ProfileModel.findOne( {'CODIGO': element} );
            if(findCode)
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('Code already exists'),
    body('description')
        .exists()
        .withMessage('A description is required')
        .isLength({ min: 5 })
        .withMessage('Must be at least 5 chars long'),
    body('state')
        .optional()
        .isIn(States)
        .withMessage('Invalid state type'),
    body()
        .custom(value => {
            //convert object keys into column names
            var creatList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for profile creation and see if the ones sent match
            const allowCreation = ['CODIGO', 'DESCRICAO', 'ESTADO'];
            return creatList.every(profile => allowCreation.includes(profile));
        })
        .withMessage('Invalid extra fields!')

];

exports.updateProfileSchema = [
    body('code')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .isLength({ max: 10 })
        .withMessage('Code can contain max 10 characters')
        .isAscii()
        .withMessage('The code provided is not in ASCII format')
        .custom(async (element, {req}) => {
            const findCode = await ProfileModel.findOne( {'CODIGO': element} );
            if(findCode){
                if(req.params.code === findCode.CODIGO)
                    return Promise.resolve();
                else
                    return Promise.reject();
            }
            else
                return Promise.resolve();
        })
        .withMessage('Code already exists'),
    body('description')
        .optional()
        .isLength({ min: 5 })
        .withMessage('Must be at least 5 chars long'),
    body('state')
        .optional()
        .isIn(States)
        .withMessage('Invalid state type'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(async (value, {req}) => {
            const findCode = await ProfileModel.findOne( {'CODIGO': req.params.code} );
            if(findCode)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('The profile you want to update does not exist!')
        .custom(value => {
            // convert updates keys into colum names
            var updatesList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for profile creation and see if the ones sent match
            const allowUpdates = ['CODIGO', 'DESCRICAO', 'ESTADO'];
            return updatesList.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];

exports.getProfilesSchema = [
    body('id')
        .optional()
        .isNumeric()
        .withMessage("Profile id must be a number"),
    body('code')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .isLength({ max: 10 })
        .withMessage('Code can contain max 10 characters')
        .isAscii()
        .withMessage('The code provided is not in ASCII format'),
    body('description')
        .optional()
        .isLength({ min: 5 })
        .withMessage('Must be at least 5 chars long'),
    body('state')
        .optional()
        .isIn(States)
        .withMessage('Invalid state type'),
    body('created_at')
        .optional()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss'),
    body('created_at_limit')
        .optional()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss')
        .custom((value, { req }) => !!req.body.created_at)
        .withMessage('No start date provided')
        .custom((created_at_lim, { req }) => created_at_lim >= req.body.created_at )
        .withMessage('End date must be after start date'),
    body()
        .custom(value => {
            // convert updates keys into colum names
            var updatesList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for profile creation and see if the ones sent match
            const allowUpdates = ['ID', 'CODIGO', 'DESCRICAO', 'DATA_REGISTO', 'ESTADO','created_at_limit'];
            return updatesList.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid extra fields!')
];

exports.deleteProfileSchema = [
    body()
        .custom(async (value, {req}) => {
            const findCode = await UserModel.findOne( {'CODIGO': req.params.code} );
            if(findCode)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('User not found!')
];