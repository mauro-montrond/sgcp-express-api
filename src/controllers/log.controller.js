const LogModel = require('../models/log.model');
const HttpException = require('../utils/HttpException.utils');
const { getNormalizedColumnsValues } = require('../utils/logColumnNormalizer.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

/******************************************************************************
 *                              Log Controller
 ******************************************************************************/
class LogController {
    getAllLog = async (req, res, next) => {
        let logList = await LogModel.find();
        if (!logList.length) {
            throw new HttpException(404, 'Logs not found');
        }

        res.send(logList);
    };

    getLogById = async (req, res, next) => {
        const log = await LogModel.findOne({ ID: req.params.id });
        if (!log) {
            throw new HttpException(404, 'Log not found');
        }
        res.send(log);
    };

    getLogsByParams = async (req, res, next) => {
        this.checkValidation(req);
        // convert the re.body keys into the actual names of the table's colums
        let logsList = getNormalizedColumnsValues(req.body);
        const logs = await LogModel.findMany(logsList);
        if (!logs.length) {
            throw new HttpException(404, 'Logs not found');
        }

        res.send(logs);
    };

    deleteLog = async (req, res, next) => {
        this.checkValidation(req);
        const result = await LogModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'Log not found');
        }
        res.send('Log has been deleted');
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
module.exports = new LogController;