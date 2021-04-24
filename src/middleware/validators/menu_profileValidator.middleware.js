const { body } = require('express-validator');
const Menu_ProfileStates = require('../../utils/menu_profileStates.utils.js');
const { getNormalizedColumns } = require('../../utils/menu_profileColumnNormalizer.utils.js');
const Menu_ProfileModel  = require('../../models/menu_profile.model');
const ProfileModel  = require('../../models/profile.model');
const MenuModel  = require('../../models/menu.model');


exports.createMenu_ProfileSchema = [     
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
    body('menu_id')
        .notEmpty()
        .withMessage("Menu id must be filled")
        .exists()
        .withMessage('Menu is required')
        .trim()
        .isNumeric()
        .withMessage("Menu id must be a number")
        .custom(async () => {
            const findMenus = await MenuModel.find();
            if(findMenus.length)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('No Menus exist')
        .custom(async element => {
            const findMenu = await MenuModel.findOne( {'ID': element} );
            if(findMenu)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Menu not found')
        .custom(async element => {
            const findMenu = await MenuModel.findOne( {'ID': element} );
            if(findMenu && findMenu.ESTADO != 'A')
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('That Menu is not in a valid state'),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(Menu_ProfileStates)
        .withMessage('Invalid state type'),
    body()
        .custom(value => {
            //convert object keys into column names
            var creatList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for creation and see if the ones sent match
            const allowCreation = ['ID_PERFIL', 'ID_MENU', 'ESTADO'];
            return creatList.every(parameter => allowCreation.includes(parameter));
        })
        .withMessage('Invalid extra fields!')

];

exports.updateMenu_ProfileSchema = [
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(Menu_ProfileStates)
        .withMessage('Invalid state type'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(async (value, {req}) => {
            const findAssociation = await Menu_ProfileModel.findOne( {'ID_PERFIL': req.params.profile_id, 'ID_MENU': req.params.menu_id} );
            if(findAssociation)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('The profile-menu association you want to update does not exist!')
        .custom(value => {
            // convert object keys into colum names
            var updatesList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for updating and see if the ones sent match
            const allowUpdates = ['ESTADO'];
            return updatesList.every(parameter => allowUpdates.includes(parameter));
        })
        .withMessage('Invalid updates!')
];

exports.getMenus_ProfilesSchema = [
     body('profile_id')
        .notEmpty()
        .withMessage("Profile id must be filled")
        .optional()
        .trim()
        .isNumeric()
        .withMessage("Profile id must be a number"),
     body('menu_id')
        .notEmpty()
        .withMessage("Menu id must be filled")
        .optional()
        .trim()
        .isNumeric()
        .withMessage("Menu id must be a number"),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(Menu_ProfileStates)
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
            const allowSearch = ['ID_PERFIL', 'ID_MENU', 'DATA_REGISTO', 'ESTADO','created_at_limit', 'created_at_range'];
            return searchList.every(parameter => allowSearch.includes(parameter));
        })
        .withMessage('Invalid extra fields!')
];

exports.deleteMenu_ProfileSchema = [
    body()
        .custom(async (value, {req}) => {
            const findAssociation = await Menu_ProfileModel.findOne( {'ID_PERFIL': req.params.profile_id, 'ID_MENU': req.params.menu_id} );
            if(findAssociation)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Profile-menu association not found!')
];