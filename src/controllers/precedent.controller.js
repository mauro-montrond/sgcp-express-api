const PrecedentModel = require('../models/precedent.model');
const HttpException = require('../utils/HttpException.utils');
const { getNormalizedColumnsValues } = require('../utils/precedentColumnNormalizer.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

/******************************************************************************
 *                              Precedent Controller
 ******************************************************************************/
class PrecedentController {
    getAllPrecedent = async (req, res, next) => {
        let precedentList = await PrecedentModel.find();
        //console.log("profileList: " + profileList);
        if (!precedentList.length) {
            throw new HttpException(404, 'Precedents not found');
        }

        res.send(precedentList);
    };

    getPrecedentsByParams = async (req, res, next) => {
        this.checkValidation(req);
        // convert the re.body keys into the actual names of the table's colums
        let precedentList = getNormalizedColumnsValues(req.body);
        const precedents = await PrecedentModel.findMany(precedentList);
        if (!precedents.length) {
            throw new HttpException(404, 'Precedents not found');
        }

        res.send(precedents);
    };

    getPrecedentById = async (req, res, next) => {
        const precedent = await PrecedentModel.findOne({ ID: req.params.id });
        if (!precedent) {
            throw new HttpException(404, 'Precedent not found');
        }
        res.send(precedent);
    };

    createPrecedent = async (req, res, next) => {
        this.checkValidation(req);
        if(!req.currentUser){
            throw new HttpException(401, 'Unauthorized');
        }
        const { SENHA, ...userWithoutPassword } = req.currentUser;
        const result = await PrecedentModel.create(req.body, userWithoutPassword.ID);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Precedent was created!');
    };

    updatePrecedent = async (req, res, next) => {
        this.checkValidation(req);

        if(!req.currentUser){
            throw new HttpException(401, 'Unauthorized');
        }
        const { SENHA, ...userWithoutPassword } = req.currentUser;

        // do the update query and get the result
        // it can be partial edit
        // convert the re.body keys into the actual names of the table's colums
        let updates = getNormalizedColumnsValues(req.body);
        // remove the limits, they are not used in updating
        delete updates['date_limit'];
        
        const result = await PrecedentModel.update(updates, req.params.id, userWithoutPassword.ID);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Precedent not found' :
            affectedRows && changedRows ? 'Precedent updated successfully' : 'Updated field';

        res.send({ message, info });
    };

    deletePrecedent = async (req, res, next) => {
        this.checkValidation(req);

        if(!req.currentUser){
            throw new HttpException(401, 'Unauthorized');
        }
        const { SENHA, ...userWithoutPassword } = req.currentUser;

        const result = await PrecedentModel.delete(req.params.id, userWithoutPassword.ID);
        if (!result) {
            throw new HttpException(404, 'Precedent not found');
        }
        res.send('Precedent has been deleted');
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
module.exports = new PrecedentController;