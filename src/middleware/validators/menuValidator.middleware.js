const { body } = require('express-validator');
const MenuStates = require('../../utils/menuStates.utils.js');
const { getNormalizedColumns } = require('../../utils/menuColumnNormalizer.utils.js');
const MenuModel  = require('../../models/menu.model');
const Menu_ProfileModel  = require('../../models/menu_profile.model');


exports.createMenuSchema = [
    body('code')
        .exists()
        .withMessage('Code is required')
        .notEmpty()
        .withMessage("Code must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .isLength({ max: 18 })
        .withMessage('Code can contain max 18 characters')
        .matches(/^[a-zA-Z0-9-_ ]+$/)
        .withMessage("Can only contain: letters a-z, A-Z, - and _")
        .custom(async element => {
            const findCode = await MenuModel.findOne( {'CODIGO': element} );
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
    body('parent_menu')
        .optional()
        .notEmpty()
        .withMessage("Parent menu id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Parent menu id must be a number")
        .custom(async () => {
            const findMenus = await MenuModel.find();
            if(findMenus.length)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('No menus exist')
        .custom(async element => {
            const findMenu = await MenuModel.findOne( {'ID': element} );
            if(findMenu)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Parent menu does not exist')
        .custom(async element => {
            const findMenu = await MenuModel.findOne( {'ID': element} );
            if(findMenu && findMenu.ESTADO != 'A')
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('That parent menu is not in a valid state')
        .custom(async element => {
            const level1 = await MenuModel.findOne( {'ID': element} );
            if(level1 && level1.ID_MENU_PAI){
                const level2 = await MenuModel.findOne( {'ID': level1.ID_MENU_PAI} );
                if(level2  && level2.ID_MENU_PAI)
                    return Promise.reject();
            }
            return Promise.resolve();
        })
        .withMessage('Only 3 levels allowed'),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(MenuStates)
        .withMessage('Invalid state type'),
    body()
        .custom(value => {
            //convert object keys into column names
            var creatList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for creation and see if the ones sent match
            const allowCreation = ['CODIGO', 'DESCRICAO', 'ID_MENU_PAI', 'ESTADO'];
            return creatList.every(parameter => allowCreation.includes(parameter));
        })
        .withMessage('Invalid extra fields!')

];

exports.updateMenuSchema = [
    body('code')
        .optional()
        .notEmpty()
        .withMessage("Code must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .isLength({ max: 18 })
        .withMessage('Code can contain max 18 characters')
        .matches(/^[a-zA-Z0-9-_ ]+$/)
        .withMessage("Can only contain: letters a-z, A-Z, - and _")
        .custom(async (element, {req}) => {
            const findMenu = await MenuModel.findOne( {'CODIGO': req.params.code} );
            if(findMenu){
                const findCode = await MenuModel.findOne( {'CODIGO': element} );
                if(findCode){
                    if(findCode.CODIGO === findMenu.CODIGO)
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
        .withMessage('Code already exists'),
    body('description')
        .optional()
        .notEmpty()
        .withMessage("Description must be filled")
        .trim()
        .isLength({ min: 5 })
        .withMessage('Must be at least 5 chars long'),      
    body('parent_menu')
        .optional()
        .notEmpty()
        .withMessage("Parent menu id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Parent menu id must be a number")
        .custom(async () => {
            const findMenus = await MenuModel.find();
            if(findMenus.length)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('No menus exist')
        .custom(async element => {
            const findMenu = await MenuModel.findOne( {'ID': element} );
            if(findMenu)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Parent menu does not exist')
        .custom(async element => {
            const findMenu = await MenuModel.findOne( {'ID': element} );
            if(findMenu && findMenu.ESTADO != 'A')
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('That parent menu is not in a valid state')
        .custom(async (element, {req}) => {
            const findMenu = await MenuModel.findOne( {'ID': element} );
            const currentMenu = await MenuModel.findOne( {'CODIGO': req.params.code} )
            if(findMenu && currentMenu && findMenu.ID == currentMenu.ID)
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage("A menu can't be it's own parent"),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(MenuStates)
        .withMessage('Invalid state type'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(async (value, {req}) => {
            const findCode = await MenuModel.findOne( {'CODIGO': req.params.code} );
            if(findCode)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('The menu you want to update does not exist!')
        .custom(async (value, {req}) => {
            //inicuo
            let found = false;
            let currentMenu = await MenuModel.findOne( {'CODIGO': req.params.code} );
            if(currentMenu){
                let childs1 = await MenuModel.findMany( {'ID_MENU_PAI': currentMenu.ID} );// fidjos
                if(childs1.length){
                    childs1.forEach(async child => {
                        let childs2 = await MenuModel.findMany( {'ID_MENU_PAI': child.ID} );// netos
                        if(childs2.length)
                            found = true;// x tem neto, reject
                    });
                }
                if(!found){
                    if(childs1.length){ // x tem fidjo ma ka tem neto
                        let parent1
                        if(req.body.parent_menu)
                            parent1 = await MenuModel.findOne( {'ID': req.body.parent_menu} );
                        else if(currentMenu.ID_MENU_PAI) {
                            parent1 = await MenuModel.findOne( {'ID': currentMenu.ID_MENU_PAI} );
                        }
                        if(parent1 && parent1.ID_MENU_PAI) 
                            found = true;// y tem pai, reject
                    }
                    else{// x ka tem fidjo
                        let parent1
                        if(req.body.parent_menu)
                            parent1 = await MenuModel.findOne( {'ID': req.body.parent_menu} );
                        else if(currentMenu.ID_MENU_PAI){
                            parent1 = await MenuModel.findOne( {'ID': currentMenu.ID_MENU_PAI} );
                        }
                        if(parent1 && parent1.ID_MENU_PAI){ 
                             let parent2 = await MenuModel.findOne( {'ID': parent1.ID_MENU_PAI} );
                             if(parent2  && parent2.ID_MENU_PAI)
                                found = true;// y tem avo, reject
                        }
                    }
                }
            }
            if(found)
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('Only 3 levels allowed!')
        .custom(value => {
            // convert object keys into colum names
            var updatesList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for updating and see if the ones sent match
            const allowUpdates = ['CODIGO', 'DESCRICAO', 'ID_MENU_PAI', 'ESTADO'];
            return updatesList.every(parameter => allowUpdates.includes(parameter));
        })
        .withMessage('Invalid updates!')
];

exports.getMenusSchema = [
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
        .isLength({ max: 18 })
        .withMessage('Code can contain max 18 characters')
        .matches(/^[a-zA-Z0-9-_ ]+$/)
        .withMessage("Can only contain: letters a-z, A-Z, - and _"),
    body('description')
        .optional()
        .notEmpty()
        .withMessage("Description must be filled")
        .trim()
        .isLength({ min: 5 })
        .withMessage('Must be at least 5 chars long'),      
    body('parent_menu')
        .optional()
        .notEmpty()
        .withMessage("Parent menu id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Parent menu id must be a number"),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(MenuStates)
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
            const allowSearch = ['ID', 'CODIGO', 'DESCRICAO', 'ID_MENU_PAI', 'DATA_REGISTO', 'ESTADO','created_at_limit', 'created_at_range'];
            return searchList.every(parameter => allowSearch.includes(parameter));
        })
        .withMessage('Invalid extra fields!')
];

exports.deleteMenuSchema = [
    body()
        .custom(async (value, {req}) => {
            const findCode = await MenuModel.findOne( {'CODIGO': req.params.code} );
            if(findCode)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Menu not found!')
        .custom(async (value, {req}) => {
            const findCode = await MenuModel.findOne( {'CODIGO': req.params.code} );
            if(findCode){
                const findChilds = await MenuModel.findOne( {'ID_MENU_PAI': findCode.ID} );
                if(findChilds)
                    return Promise.reject();
                else
                    return Promise.resolve();
            }
            else
                return Promise.resolve();
        })
        .withMessage('Menu has submenus!')
        .custom(async (value, {req}) => {
            const findMenu = await MenuModel.findOne( {'CODIGO': req.params.code} );
            if(findMenu){
                const findAssociation = await Menu_ProfileModel.findOne( {'ID_MENU': findMenu.ID} );
                if(findAssociation)
                    return Promise.reject();
                else
                    return Promise.resolve();
            }
            else
                return Promise.resolve();
        })
        .withMessage('Menu has profile(s) associated with it!')
];