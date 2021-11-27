const { body } = require('express-validator');
const UserStates = require('../../utils/userStates.utils.js');
const Role = require('../../utils/userRoles.utils');
const { getNormalizedColumns } = require('../../utils/userColumnNormalizer.utils.js');
const ProfileModel  = require('../../models/profile.model');
const UserModel = require('../../models/user.model');
const PrecedentModel = require('../../models/precedent.model');
const IndividualModel = require('../../models/individual.model');

exports.createUserSchema = [
    body('username')
        .notEmpty()
        .withMessage("Username must be filled")
        .exists()
        .withMessage('username is required')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .trim()
        .custom(async element => {
            const findUsername = await UserModel.findOne( {'UTILIZADOR': element} );
            if(findUsername)
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('Username already exists'), 
    body('name')
        .notEmpty()
        .withMessage("Name must be filled")
        .exists()
        .withMessage('Your name is required')
        .trim()
        .matches(/^[a-zA-Z-' ]+$/)
        .withMessage("Can only contain: a-z, A-Z, - and '")
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('email')
        .notEmpty()
        .withMessage("Email must be filled")
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail()
        .trim()
        .custom(async element => {
            const findEmail = await UserModel.findOne( {'EMAIL': element} );
            if(findEmail)
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('Email already exists'),
    body('profilePhotoFile')
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
        .withMessage('not a jpeg nor png file!'),   
    body('profile_id')
        .notEmpty()
        .withMessage("Profile id must be filled")
        .exists()
        .withMessage('Profile is required')
        .trim()
        .isNumeric()
        .withMessage("Profile id must be a number")
        .custom(async () => {
            const findProfiles = await ProfileModel.find();
            if(findProfiles.length)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('No Profiles exist')
        .custom(async element => {
            const findProfile = await ProfileModel.findOne( {'ID': element} );
            if(findProfile)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Profile not found')
        .custom(async element => {
            const findProfile = await ProfileModel.findOne( {'ID': element} );
            if(findProfile && findProfile.ESTADO != 'A')
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('That Profile is not in a valid state'),
    body('state')
        .notEmpty()
        .withMessage("State must be filled")
        .optional()
        .trim()
        .isIn(UserStates)
        .withMessage('Invalid state type'),
    body('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .withMessage("Password must be filled")
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
            //Set the allowed field for creation and see if the ones sent match
            const allowCreation = ['UTILIZADOR', 'ID_PERFIL', 'NOME', 'EMAIL', 'AVATAR', 'SENHA', 'ESTADO', 'confirm_password'];
            return creatList.every(parameter => allowCreation.includes(parameter));
        })
        .withMessage('Invalid extra fields!')
];

exports.updateUserSchema = [
    body('username')
        .notEmpty()
        .withMessage("Username must be filled")
        .optional()
        .trim()
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
        .notEmpty()
        .withMessage("Name must be filled")
        .optional()
        .trim()
        .matches(/^[a-zA-Z-' ]+$/)
        .withMessage("Can only contain: a-z, A-Z, - and '")
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('email')
        .notEmpty()
        .withMessage("Email must be filled")
        .optional()
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail()
        .trim()
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
    body('profilePhotoFile')
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
        .withMessage('not a jpeg nor png file!'),      
    body('profile_id')
        .notEmpty()
        .withMessage("Profile id must be filled")
        .optional()
        .trim()
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
            const findProfile = await ProfileModel.findOne( {'ID': element} );
            if(findProfile)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Profile not found')
        .custom(async element => {
            const findProfile = await ProfileModel.findOne( {'ID': element} );
            if(findProfile && findProfile.ESTADO != 'A')
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('That Profile is not in a valid state')
        .custom( (element, {req}) => {
            //check if the current user has permission to change profile
            if(req.currentUser.ID_PERFIL != '1'){
                console.log("req.currentUser.UTILIZADOR in validator: " + req.currentUser.UTILIZADOR);
                return false;
            }
            else
                return true;
        })
        .withMessage("You don't have permission to change profile"),
    body('state')
        .notEmpty()
        .withMessage("State must be filled")
        .optional()
        .trim()
        .isIn(UserStates)
        .withMessage('Invalid state type'),
    body('password')
        .optional()
        .notEmpty()
        .withMessage("Password must be filled")
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
        .custom((value, {req}) => {
            return !!(Object.keys(value).length + Object.keys(req.files).length);
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
            const allowUpdates = ['UTILIZADOR', 'ID_PERFIL', 'NOME', 'EMAIL', 'AVATAR', 'SENHA', 'ESTADO', 'confirm_password'];
            return updatesList.every(parameter => allowUpdates.includes(parameter));
        })
        .withMessage('Invalid updates!')
];

exports.getUsersSchema = [
    body('u_id')
        .notEmpty()
        .withMessage("Id must be filled")
        .optional()
        .trim()
        .isNumeric()
        .withMessage("User id must be a number")
        .notEmpty()
        .withMessage('id must be filled'),
    body('username')
        .notEmpty()
        .withMessage("Username must be filled")
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .trim(),
    body('name')
        .notEmpty()
        .withMessage("Name must be filled")
        .optional()
        .trim()
        .matches(/^[a-zA-Z-' ]+$/)
        .withMessage("Can only contain: a-z, A-Z, - and '")
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('email')
        .notEmpty()
        .withMessage("Email must be filled")
        .optional()
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail()
        .trim(),  
    body('profilePhotoFile')
        .notEmpty()
        .withMessage("Profile photo must be filled")
        .optional()
        .trim(),     
    body('profile_id')
        .notEmpty()
        .withMessage("Profile id must be filled")
        .optional()
        .trim()
        .isNumeric()
        .withMessage("Profile id must be a number"),
    body('state')
        .notEmpty()
        .withMessage("State must be filled")
        .optional()
        .trim()
        .isIn(UserStates)
        .withMessage('Invalid state type'),
    body('created_at')
        .notEmpty()
        .withMessage("Created at must be filled")
        .optional()
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
            var searchList = getNormalizedColumns(Object.keys(value));
            const allowSearch = ['ID', 'UTILIZADOR', 'ID_PERFIL', 'NOME', 'EMAIL', 'ESTADO', 'DATA_REGISTO', 'created_at_limit', 'created_at_range'];
            return searchList.every(parameter => allowSearch.includes(parameter));
        })
        .withMessage('Invalid extra parameters!')
];

exports.deleteUserSchema = [
    body()
        .custom(async (value, {req}) => {
            const findUser = await UserModel.findOne( {'ID': req.params.id} );
            if(findUser)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('User not found!')
        .custom(async (value, {req}) => {
            const findPrecedents = await PrecedentModel.findOne( {'ID_UTILIZADOR': req.params.id} );
            if(findPrecedents)
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('User is associated with precedents!')
        .custom(async (value, {req}) => {
            const findIndividuals = await IndividualModel.findOne( {'ID_UTILIZADOR': req.params.id} );
            if(findIndividuals)
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('User is associated with individuals!')
];

exports.validateLogin = [
    body('email')
        .exists()
        .withMessage('Email is required')
        .notEmpty()
        .withMessage('Email must be filled')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail()
        .trim(),
    body('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .withMessage('Password must be filled')
];