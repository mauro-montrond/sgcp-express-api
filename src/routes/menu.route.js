const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');
const auth = require('../middleware/auth.middleware');
const Action = require('../utils/menuActions.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { createMenuSchema, updateMenuSchema, getMenusSchema,  deleteMenuSchema} = require('../middleware/validators/menuValidator.middleware');

router.get('/', auth(Action.Menu.listMenu.listMenuByParams), awaitHandlerFactory(menuController.getAllMenu)); // localhost:3000/api/v1/menus
router.get('/params', auth(Action.Menu.listMenu.listMenuByParams), getMenusSchema, awaitHandlerFactory(menuController.getMenusByParams)); // localhost:3000/api/v1/menus/params
router.get('/id/:id', auth(Action.Menu.listMenu.listMenuByParams), awaitHandlerFactory(menuController.getMenuById)); // localhost:3000/api/v1/menus/id/1
router.get('/code/:code', auth(Action.Menu.listMenu.listMenuByParams), awaitHandlerFactory(menuController.getMenuByCode)); // localhost:3000/api/v1/menus/code/SGCP_UT_01 
router.post('/', auth(Action.Menu.createMenu), createMenuSchema, awaitHandlerFactory(menuController.createMenu)); // localhost:3000/api/v1/menus
router.patch('/code/:code', auth(Action.Menu.updateMenu), updateMenuSchema, awaitHandlerFactory(menuController.updateMenu)); // localhost:3000/api/v1/menus/code/SGCP_UT_01 , using patch for partial update
router.delete('/code/:code', auth(Action.Menu.deleteMenu), deleteMenuSchema, awaitHandlerFactory(menuController.deleteMenu)); // localhost:3000/api/v1/menus/code/SGCP_UT_04


module.exports = router;