const express = require('express');
const router = express.Router();
const menu_profileController = require('../controllers/menu_profile.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createMenu_ProfileSchema, updateMenu_ProfileSchema, getMenus_ProfilesSchema,  deleteMenu_ProfileSchema} = require('../middleware/validators/menu_profileValidator.middleware');

router.get('/', awaitHandlerFactory(menu_profileController.getAllMenu_Profile)); // localhost:3000/api/v1/menus_profiles
router.get('/params', getMenus_ProfilesSchema, awaitHandlerFactory(menu_profileController.getMenu_ProfilesByParams)); // localhost:3000/api/v1/menus_profiles/params
router.get('/profile/:profile_id/menu/:menu_id', awaitHandlerFactory(menu_profileController.getMenu_ProfileByIds)); // localhost:3000/api/v1/menus_profiles/profile/1/menu/23
router.post('/', createMenu_ProfileSchema, awaitHandlerFactory(menu_profileController.createMenu_Profile)); // localhost:3000/api/v1/menus_profiles
router.patch('/profile/:profile_id/menu/:menu_id', updateMenu_ProfileSchema, awaitHandlerFactory(menu_profileController.updateMenu_Profile)); // localhost:3000/api/v1/menus_profiles/profile/1/menu/23, using patch for partial update
router.delete('/profile/:profile_id/menu/:menu_id', deleteMenu_ProfileSchema, awaitHandlerFactory(menu_profileController.deleteMenu_Profile)); // localhost:3000/api/v1/menus_profiles/profile/1/menu/23

module.exports = router;