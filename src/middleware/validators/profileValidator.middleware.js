const { body } = require('express-validator');
const ProfileStates = require('../../utils/profileStates.utils.js');
const { getNormalizedColumns } = require('../../utils/profileColumnNormalizer.utils.js');
const ProfileModel  = require('../../models/profile.model');
const Menu_ProfileModel  = require('../../models/menu_profile.model');
const UserModel  = require('../../models/user.model');


exports.createProfileSchema = [
    body('code')
        .exists()
        .withMessage('Code is required')
        .notEmpty()
        .withMessage("Code must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .isLength({ max: 10 })
        .withMessage('Code can contain max 10 characters')
        .matches(/^[a-zA-Z0-9-_ ]+$/)
        .withMessage("Can only contain: letters a-z, A-Z, 0-9, - and _")
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
        .notEmpty()
        .withMessage("Description must be filled")
        .trim()
        .isLength({ min: 5 })
        .withMessage('Must be at least 5 chars long'),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(ProfileStates)
        .withMessage('Invalid state type'),
    body()
        .custom(value => {
            //convert object keys into column names
            var creatList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for creation and see if the ones sent match
            const allowCreation = ['CODIGO', 'DESCRICAO', 'ESTADO'];
            return creatList.every(parameter => allowCreation.includes(parameter));
        })
        .withMessage('Invalid extra fields!')

];

exports.updateProfileSchema = [
    body('code')
        .optional()
        .notEmpty()
        .withMessage("Code must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .isLength({ max: 10 })
        .withMessage('Code can contain max 10 characters')
        .matches(/^[a-zA-Z0-9-_ ]+$/)
        .withMessage("Can only contain: letters a-z, A-Z, 0-9, - and _")
        .custom(async (element, {req}) => {
            const findCode = await ProfileModel.findOne( {'CODIGO': element} );
            if(findCode){
                const currentCode = await ProfileModel.findOne( {'CODIGO': req.params.code} );
                if(currentCode && currentCode.CODIGO === element)
                    return Promise.resolve();
                else if (!currentCode)
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
        .notEmpty()
        .withMessage("Description must be filled")
        .trim()
        .isLength({ min: 5 })
        .withMessage('Must be at least 5 chars long'),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(ProfileStates)
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
            // convert object keys into colum names
            var updatesList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for updating and see if the ones sent match
            const allowUpdates = ['CODIGO', 'DESCRICAO', 'ESTADO'];
            return updatesList.every(parameter => allowUpdates.includes(parameter));
        })
        .withMessage('Invalid updates!')
];

exports.getProfilesSchema = [
    body('id')
        .optional()
        .notEmpty()
        .withMessage("Id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Profile id must be a number"),
    body('code')
        .optional()
        .notEmpty()
        .withMessage("Code must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .isLength({ max: 10 })
        .withMessage('Code can contain max 10 characters')
        .matches(/^[a-zA-Z0-9-_ ]+$/)
        .withMessage("Can only contain: letters a-z, A-Z, 0-9, - and _"),
    body('description')
        .optional()
        .notEmpty()
        .withMessage("Description must be filled")
        .trim()
        .isLength({ min: 5 })
        .withMessage('Must be at least 5 chars long'),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(ProfileStates)
        .withMessage('Invalid state type'),
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
            const allowSearch = ['ID', 'CODIGO', 'DESCRICAO', 'DATA_REGISTO', 'ESTADO','created_at_limit', 'created_at_range'];
            return searchList.every(parameter => allowSearch.includes(parameter));
        })
        .withMessage('Invalid extra fields!')
];

exports.deleteProfileSchema = [
    body()
        .custom(async (value, {req}) => {
            const findCode = await ProfileModel.findOne( {'CODIGO': req.params.code} );
            if(findCode)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Profile not found!')
        .custom(async (value, {req}) => {
            const findCode = await ProfileModel.findOne( {'CODIGO': req.params.code} );
            if(findCode){
                const findUser = await UserModel.findOne( {'ID_PERFIL': findCode.ID} );
                if(findUser)
                    return Promise.reject();
                else
                    return Promise.resolve();
            }
            else
                return Promise.resolve();
        })
        .withMessage('Profile has user(s) associated with it!')
        .custom(async (value, {req}) => {
            const findCode = await ProfileModel.findOne( {'CODIGO': req.params.code} );
            if(findCode){
                const findAssociation = await Menu_ProfileModel.findOne( {'ID_PERFIL': findCode.ID} );
                if(findAssociation)
                    return Promise.reject();
                else
                    return Promise.resolve();
            }
            else
                return Promise.resolve();
        })
        .withMessage('Profile has menu(s) associated with it!')
];