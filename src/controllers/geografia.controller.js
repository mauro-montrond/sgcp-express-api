const GeografiaModel = require('../models/geografia.model');
const HttpException = require('../utils/HttpException.utils');
const { getNormalizedColumnsValues } = require('../utils/geografiaColumnNormalizer.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

/******************************************************************************
 *                              Geografia Controller
 ******************************************************************************/
class GeografiaController {
    getAllGeografia = async (req, res, next) => {
        let geografiaList = await GeografiaModel.find();
        if (!geografiaList.length) {
            throw new HttpException(404, 'Geografias not found');
        }

        res.send(geografiaList);
    };

    getGeografiaById = async (req, res, next) => {
        const geografia = await GeografiaModel.findOne({ ID: req.params.id });
        if (!geografia) {
            throw new HttpException(404, 'Geografia not found');
        }
        res.send(geografia);
    };

    getGeografiasByParams = async (req, res, next) => {
        this.checkValidation(req);
        // convert the re.body keys into the actual names of the table's colums
        let geografiasList = getNormalizedColumnsValues(req.body);
        const geografia = await GeografiaModel.findMany(geografiasList);
        if (!geografia.length) {
            throw new HttpException(404, 'Geografias not found');
        }

        res.send(geografia);
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation failed', errors);
        }
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new GeografiaController;