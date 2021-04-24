const IndividualModel = require('../models/individual.model');
const HttpException = require('../utils/HttpException.utils');
const { getNormalizedColumnsValues } = require('../utils/individualColumnNormalizer.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

/******************************************************************************
 *                              Individual Controller
 ******************************************************************************/
class IndividualController {
    getAllIndividual = async (req, res, next) => {
        let individualList = await IndividualModel.find();
        if (!individualList.length) {
            throw new HttpException(404, 'Individuals not found');
        }

        res.send(individualList);
    };

    getIndividualById = async (req, res, next) => {
        const individual = await IndividualModel.findOne({ ID: req.params.id });
        if (!individual) {
            throw new HttpException(404, 'Individual not found');
        }
        res.send(individual);
    };

    getIndividualByCode = async (req, res, next) => {
        const individual = await IndividualModel.findOne({ CODIGO: req.params.code });
        if (!individual) {
            throw new HttpException(404, 'Individual not found');
        }

        res.send(individual);
    };

    getIndividualsByParams = async (req, res, next) => {
        this.checkValidation(req);
        // convert the re.body keys into the actual names of the table's colums
        let individualList = getNormalizedColumnsValues(req.body);
        const individual = await IndividualModel.findMany(individualList);
        if (!individual.length) {
            throw new HttpException(404, 'Individuals not found');
        }

        res.send(individual);
    };

    createIndividual = async (req, res, next) => {
        this.checkValidation(req);
        
        if(!req.currentUser){
            throw new HttpException(401, 'Unauthorized');
        }
        const { SENHA, ...userWithoutPassword } = req.currentUser;
        const result = await IndividualModel.create(req.body, userWithoutPassword.ID);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Individual was created!');
    };

    updateIndividual = async (req, res, next) => {
        this.checkValidation(req);
        // do the update query and get the result
        // it can be partial edit
        // convert the re.body keys into the actual names of the table's colums
        let updates = getNormalizedColumnsValues(req.body);
        // remove the limits, they are not used in updating
        delete updates['birthdate_limit'];
        delete updates['apparent_age_limit'];
        delete updates['doc_issuance_date_limit'];
        delete updates['height_limit'];
        const result = await IndividualModel.update(updates, req.params.id);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Individual not found' :
            affectedRows && changedRows ? 'Individual updated successfully' : 'Updated field';

        res.send({ message, info });
    };

    deleteIndividual = async (req, res, next) => {
        this.checkValidation(req);
        const result = await IndividualModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Individual not found');
        }
        res.send('Individual has been deleted');
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
module.exports = new IndividualController;