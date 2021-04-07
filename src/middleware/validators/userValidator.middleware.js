const { body } = require('express-validator');
const awaitHandlerFactory = require('../awaitHandlerFactory.middleware');
const States = require('../../utils/userStates.utils.js');
const Role = require('../../utils/userRoles.utils');
const { getNormalizedColumns } = require('../../utils/userColumnNormalizer.utils.js');
const ProfileModel  = require('../../models/profile.model');
const UserModel = require('../../models/user.model');

exports.createUserSchema = [
    body('username')
        .exists()
        .withMessage('username is required')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .custom(async element => {
            const findUsername = await UserModel.findOne( {'UTILIZADOR': element} );
            if(findUsername)
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('Username already exists'), 
    body('name')
        .exists()
        .withMessage('Your name is required')
        .matches(/^[a-zA-Z-' ]+$/)
        .withMessage("Can only contain: a-z, A-Z, - and '")
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail()
        .custom(async element => {
            const findEmail = await UserModel.findOne( {'EMAIL': element} );
            if(findEmail)
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('Email already exists'),     
    body('profile_id')
        .exists()
        .withMessage('Profile is required')
        .isNumeric()
        .withMessage("Profile id must be a number")
        .custom(async () => {
            const findProfiles = await ProfileModel.find();
            if(findProfiles.length)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('No Profiles exists')
        .custom(async element => {
            const findProfiles = await ProfileModel.find();
            let found = false;
            findProfiles.forEach(profile => {
                if(profile.ID == element)
                    found = true;
            });
            if (found)
                return Promise.resolve();
            else{
                if (isNaN(element)) //check if it did not find because it was a string and avoid error message duplixation
                    return Promise.resolve();
                else
                    return Promise.reject();
            }
        })
        .withMessage('Invalid Profile'),
    body('state')
        .optional()
        .isIn(States)
        .withMessage('Invalid state type'),
    body('password')
        .exists()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .isLength({ max: 20 })
        .withMessage('Password can contain max 10 characters'),
    body('confirm_password')
        .exists()
        .withMessage('Please confirm passoerd')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('confirm_password field must have the same value as the password field'),
    body()
        .custom(value => {
            //convert object keys into column names
            var creatList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for profile creation and see if the ones sent match
            const allowCreation = ['UTILIZADOR', 'ID_PERFIL', 'NOME', 'EMAIL', 'SENHA', 'ESTADO', 'confirm_password'];
            return creatList.every(profile => allowCreation.includes(profile));
        })
        .withMessage('Invalid extra fields!')
];

exports.updateUserSchema = [
    body('username')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .custom(async (element, {req}) => {
            const findUser = await UserModel.findOne( {'UTILIZADOR': req.params.username} );
            if(findUser){
                const findUsername = await UserModel.findOne( {'UTILIZADOR': element} );
                if(findUsername){
                    if(findUser.UTILIZADOR === findUsername.UTILIZADOR)
                        return Promise.resolve();
                    else
                        return Promise.reject();
                }
                else
                    return Promise.resolve();
            }
            return Promise.resolve();
        })
        .withMessage('Username already exists'),
    body('name')
        .optional()
        .matches(/^[a-zA-Z-' ]+$/)
        .withMessage("Can only contain: a-z, A-Z, - and '")
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail()
        .custom(async (element, {req}) => {
            const findUser = await UserModel.findOne( {'UTILIZADOR': req.params.username} );
            if(findUser){
                const findEmail = await UserModel.findOne( {'EMAIL': element} );
                if(findEmail){
                    if(findEmail.EMAIL === findUser.EMAIL)
                        return Promise.resolve();
                    else
                        return Promise.reject();
                }
                else
                    return Promise.resolve();
            }
            else
                return Promise.resolve();
        })
        .withMessage('Email already exists'),     
    body('profile_id')
        .optional()
        .isNumeric()
        .withMessage("Profile id must be a number")
        .custom(async () => {
            const findProfiles = await ProfileModel.find();
            if(findProfiles.length)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('No Profiles exists')
        .custom(async element => {
            const findProfiles = await ProfileModel.find();
            let found = false;
            findProfiles.forEach(profile => {
                if(profile.ID == element)
                    found = true;
            });
            if (found)
                return Promise.resolve();
            else{
                if (isNaN(element)) //check if it did not find because it was a string and avoid error message duplixation
                    return Promise.resolve();
                else
                    return Promise.reject();
            }
        })
        .withMessage('Invalid Profile'),
    body('state')
        .optional()
        .isIn(States)
        .withMessage('Invalid state type'),
    body('password')
        .optional()
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .isLength({ max: 20 })
        .withMessage('Password can contain max 10 characters')
        .custom((value, { req }) => !!req.body.confirm_password)
        .withMessage('Please confirm your password'),
    body('confirm_password')
        .optional()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('confirm_password field must have the same value as the password field'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required fields to update')
        .custom(async (value, {req}) => {
            const findUsername = await UserModel.findOne( {'UTILIZADOR': req.params.username} );
            if(findUsername)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('The user you want to update does not exist!')
        .custom(value => {
            var updatesList = getNormalizedColumns(Object.keys(value));
            const allowUpdates = ['UTILIZADOR', 'ID_PERFIL', 'NOME', 'EMAIL', 'SENHA', 'ESTADO', 'confirm_password'];
            return updatesList.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];

exports.deleteUserSchema = [
    body()
        .custom(async (value, {req}) => {
            const findUsername = await UserModel.findOne( {'UTILIZADOR': req.params.username} );
            if(findUsername)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('User not found!')
];

exports.validateLogin = [
    body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),
    body('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .withMessage('Password must be filled')
];