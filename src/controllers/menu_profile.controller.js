const Menu_ProfileModel = require('../models/menu_profile.model');
const HttpException = require('../utils/HttpException.utils');
const { getNormalizedColumnsValues } = require('../utils/menu_profileColumnNormalizer.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

/******************************************************************************
 *                              Menu_Profile Controller
 ******************************************************************************/
class Menu_ProfileController {
    getAllMenu_Profile = async (req, res, next) => {
        let profileList = await Menu_ProfileModel.find();
        //console.log("profileList: " + profileList);
        if (!profileList.length) {
            throw new HttpException(404, 'Menu-Profile associations not found');
        }

        res.send(profileList);
    };

    getMenu_ProfilesByParams = async (req, res, next) => {
        this.checkValidation(req);
        // convert the re.body keys into the actual names of the table's colums
        let profilesList = getNormalizedColumnsValues(req.body);
        const profiles = await Menu_ProfileModel.findMany(profilesList);
        if (!profiles.length) {
            throw new HttpException(404, 'Menu-Profile associations not found');
        }

        res.send(profiles);
    };

    getMenu_ProfileByIds = async (req, res, next) => {
        const menu = await Menu_ProfileModel.findOne({ ID_PERFIL: req.params.profile_id, ID_MENU: req.params.menu_id });
        if (!menu) {
            throw new HttpException(404, 'Menu-profile association not found');
        }
        res.send(menu);
    };

    createMenu_Profile = async (req, res, next) => {
        this.checkValidation(req);
        const result = await Menu_ProfileModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Menu-Profile association was created!');
    };

    updateMenu_Profile = async (req, res, next) => {
        this.checkValidation(req);

        // do the update query and get the result
        // it can be partial edit
        // convert the re.body keys into the actual names of the table's colums
        let updates = getNormalizedColumnsValues(req.body);
        
        const result = await Menu_ProfileModel.update(updates, req.params.profile_id, req.params.menu_id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Menu-Profile association not found' :
            affectedRows && changedRows ? 'Menu-Profile association updated successfully' : 'Updated field';

        res.send({ message, info });
    };

    deleteMenu_Profile = async (req, res, next) => {
        this.checkValidation(req);
        const result = await Menu_ProfileModel.delete(req.params.profile_id, req.params.menu_id);
        if (!result) {
            throw new HttpException(404, 'Menu-Profile association not found');
        }
        res.send('Menu-Profile association has been deleted');
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
module.exports = new Menu_ProfileController;