const FingerprintModel = require('../models/fingerprint.model');
const HttpException = require('../utils/HttpException.utils');
const { getNormalizedColumnsValues } = require('../utils/fingerprintColumnNormalizer.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
const IndividualModel = require('../models/individual.model');
dotenv.config();
const path = require('path');

/******************************************************************************
 *                              Fingerprint Controller
 ******************************************************************************/
class FingerprintController {
    getAllFingerprint = async (req, res, next) => {
        let fingerprintList = await FingerprintModel.find();
        if (!fingerprintList.length) {
            throw new HttpException(404, 'Fingerprints not found');
        }

        res.send(fingerprintList);
    };

    getFingerprintById = async (req, res, next) => {
        const fingerprint = await FingerprintModel.findOne({ ID: req.params.id });
        if (!fingerprint) {
            throw new HttpException(404, 'Fingerprints not found');
        }
        res.send(fingerprint);
    };

    getFingerprintByIndividualId = async (req, res, next) => {
        const individual = await IndividualModel.findOne({ ID: req.params.individual_id });
        if(!individual) {
            throw new HttpException(404, 'Individual not found');
        }
        const fingerprint = await FingerprintModel.findOne({ ID_INDIVIDUO: req.params.individual_id });
        if (!fingerprint) {
            throw new HttpException(404, 'Fingerprints not found for that inividual');
        }

        res.send(fingerprint);
    };

    getFingerprintsByParams = async (req, res, next) => {
        this.checkValidation(req);
        // convert the re.body keys into the actual names of the table's colums
        let fingerprintList = getNormalizedColumnsValues(req.body);
        const fingerprints = await FingerprintModel.findMany(fingerprintList);
        if (!fingerprints.length) {
            throw new HttpException(404, 'Fingerprints not found');
        }

        res.send(fingerprints);
    };

    createFingerprint = async (req, res, next) => {
        this.checkValidation(req);

        if(!req.currentUser){
            throw new HttpException(401, 'Unauthorized');
        }
        const { SENHA, ...userWithoutPassword } = req.currentUser;

        const result = await FingerprintModel.create(req.body, req.files, userWithoutPassword.ID);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Fingerprints created!');
    };

    updateFingerprint = async (req, res, next) => {
        this.checkValidation(req);

        if(!req.currentUser){
            throw new HttpException(401, 'Unauthorized');
        }
        const { SENHA, ...userWithoutPassword } = req.currentUser;

        if(req.files){
            var filesList = [];
            var fileKeys = Object.keys(req.files);
            fileKeys.forEach(key => {
                filesList.push(key);
            });
            filesList.forEach( file => {
                let fileName = req.files[file][0].fieldname + '_' + Date.now() + path.extname(req.files[file][0].originalname);
                let fieldname = req.files[file][0].fieldname.substring(0, req.files[file][0].fieldname.indexOf("File"));
                // dynamically add each fileName to body
                eval("req.body." + fieldname + " = '" + fileName +"';");
            });
        }

        // do the update query and get the result
        // it can be partial edit
        // convert the re.body keys into the actual names of the table's colums
        let updates = getNormalizedColumnsValues(req.body);
        
        const result = await FingerprintModel.update(updates, req.files, req.params.individual_id, userWithoutPassword.ID);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Fingerprints not found' :
            affectedRows && changedRows ? 'Fingerprints updated successfully' : 'Updated field';

        res.send({ message, info });
    };

    deleteFingerprint = async (req, res, next) => {
        this.checkValidation(req);

        if(!req.currentUser){
            throw new HttpException(401, 'Unauthorized');
        }
        const { SENHA, ...userWithoutPassword } = req.currentUser;

        const result = await FingerprintModel.delete(req.params.individual_id, userWithoutPassword.ID);
        if (!result) {
            throw new HttpException(404, 'Fingerprints not found');
        }
        res.send('Fingerprints have been deleted');
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
module.exports = new FingerprintController;