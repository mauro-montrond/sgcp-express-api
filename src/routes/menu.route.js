const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createMenuSchema, updateMenuSchema, getMenusSchema,  deleteMenuSchema} = require('../middleware/validators/menuValidator.middleware');


router.get('/', awaitHandlerFactory(menuController.getAllMenu)); // localhost:3000/api/v1/menus
router.get('/params', getMenusSchema, awaitHandlerFactory(menuController.getMenusByParams)); // localhost:3000/api/v1/menus/params
router.get('/id/:id', awaitHandlerFactory(menuController.getMenuById)); // localhost:3000/api/v1/menus/id/1
router.get('/code/:code', awaitHandlerFactory(menuController.getMenuByCode)); // localhost:3000/api/v1/menus/code/SGCP_UT_01 
router.post('/', createMenuSchema, awaitHandlerFactory(menuController.createMenu)); // localhost:3000/api/v1/menus
router.patch('/code/:code', updateMenuSchema, awaitHandlerFactory(menuController.updateMenu)); // localhost:3000/api/v1/menus/code/SGCP_UT_01 , using patch for partial update
router.delete('/code/:code', deleteMenuSchema, awaitHandlerFactory(menuController.deleteMenu)); // localhost:3000/api/v1/menus/code/SGCP_UT_04


module.exports = router;