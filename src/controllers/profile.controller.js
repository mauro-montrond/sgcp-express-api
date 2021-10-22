const ProfileModel = require('../models/profile.model');
const HttpException = require('../utils/HttpException.utils');
const { getNormalizedColumnsValues } = require('../utils/profileColumnNormalizer.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();

/******************************************************************************
 *                              Profile Controller
 ******************************************************************************/
class ProfileController {
    getAllProfile = async (req, res, next) => {
        let profileList = await ProfileModel.find();
        //console.log("profileList: " + profileList);
        if (!profileList.length) {
            throw new HttpException(404, 'Profiles not found');
        }

        res.send(profileList);
    };

    getProfileById = async (req, res, next) => {
        const profile = await ProfileModel.findOne({ ID: req.params.id });
        if (!profile) {
            throw new HttpException(404, 'Profile not found');
        }
        res.send(profile);
    };

    getProfileByCode = async (req, res, next) => {
        const profile = await ProfileModel.findOne({ CODIGO: req.params.code });
        if (!profile) {
            throw new HttpException(404, 'Profile not found');
        }

        res.send(profile);
    };

    getProfilesByParams = async (req, res, next) => {
        this.checkValidation(req);
        // convert the re.body keys into the actual names of the table's colums
        let profilesList = getNormalizedColumnsValues(req.body);
        const profiles = await ProfileModel.findMany(profilesList);
        if (!profiles.length) {
            throw new HttpException(404, 'Profiles not found');
        }

        res.send(profiles);
    };

    createProfile = async (req, res, next) => {
        this.checkValidation(req);

        if(!req.currentUser){
            throw new HttpException(401, 'Unauthorized');
        }
        const { SENHA, ...userWithoutPassword } = req.currentUser;

        const result = await ProfileModel.create(req.body, userWithoutPassword.ID);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Profile was created!');
    };

    updateProfile = async (req, res, next) => {
        this.checkValidation(req);

        if(!req.currentUser){
            throw new HttpException(401, 'Unauthorized');
        }
        const { SENHA, ...userWithoutPassword } = req.currentUser;

        // do the update query and get the result
        // it can be partial edit
        // convert the re.body keys into the actual names of the table's colums
        let updates = getNormalizedColumnsValues(req.body);
        
        const result = await ProfileModel.update(updates, req.params.code, userWithoutPassword.ID);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Profile not found' :
            affectedRows && changedRows ? 'Profile updated successfully' : 'Updated field';

        res.send({ message, info });
    };

    deleteProfile = async (req, res, next) => {
        this.checkValidation(req);

        if(!req.currentUser){
            throw new HttpException(401, 'Unauthorized');
        }
        const { SENHA, ...userWithoutPassword } = req.currentUser;

        const result = await ProfileModel.delete(req.params.code, userWithoutPassword.ID);
        if (!result) {
            throw new HttpException(404, 'Profile not found');
        }
        res.send('Profile has been deleted');
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
module.exports = new ProfileController;