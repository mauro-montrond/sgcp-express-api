const MenuModel = require('../models/menu.model');
const HttpException = require('../utils/HttpException.utils');
const { getNormalizedColumnsValues } = require('../utils/menuColumnNormalizer.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

/******************************************************************************
 *                              Menu Controller
 ******************************************************************************/
class MenuController {
    getAllMenu = async (req, res, next) => {
        let menuList = await MenuModel.find();
        if (!menuList.length) {
            throw new HttpException(404, 'Menus not found');
        }

        res.send(menuList);
    };

    getMenuById = async (req, res, next) => {
        const menu = await MenuModel.findOne({ ID: req.params.id });
        if (!menu) {
            throw new HttpException(404, 'Menu not found');
        }
        res.send(menu);
    };

    getMenuByCode = async (req, res, next) => {
        const menu = await MenuModel.findOne({ CODIGO: req.params.code });
        if (!menu) {
            throw new HttpException(404, 'Menu not found');
        }

        res.send(menu);
    };

    getMenusByParams = async (req, res, next) => {
        this.checkValidation(req);
        // convert the re.body keys into the actual names of the table's colums
        let menusList = getNormalizedColumnsValues(req.body);
        const menus = await MenuModel.findMany(menusList);
        if (!menus.length) {
            throw new HttpException(404, 'Menus not found');
        }

        res.send(menus);
    };

    createMenu = async (req, res, next) => {
        this.checkValidation(req);
        const result = await MenuModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Menu was created!');
    };

    updateMenu = async (req, res, next) => {
        this.checkValidation(req);
        // do the update query and get the result
        // it can be partial edit
        // convert the re.body keys into the actual names of the table's colums
        let updates = getNormalizedColumnsValues(req.body);
        
        const result = await MenuModel.update(updates, req.params.code);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;
        
        console.log("affectedRows: " + affectedRows);
        console.log("changedRows: " + changedRows);

        const message = !affectedRows ? 'Menu not found' :
            affectedRows && changedRows ? 'Menu updated successfully' : 'Updated field';

        res.send({ message, info });
    };

    deleteMenu = async (req, res, next) => {
        this.checkValidation(req);
        const result = await MenuModel.delete(req.params.code);
        if (!result) {
            throw new HttpException(404, 'Menu not found');
        }
        res.send('Menu has been deleted');
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new MenuController;