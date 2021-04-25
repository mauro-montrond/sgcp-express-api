const UserModel = require('../models/user.model');
const HttpException = require('../utils/HttpException.utils');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { getNormalizedColumnsValues } = require('../utils/userColumnNormalizer.utils');
const getUserProfiles  = require('../models/profile.model');

/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class UserController {
    getAllUsers = async (req, res, next) => {
        let userList = await UserModel.find();
        if (!userList.length) {
            throw new HttpException(404, 'Users not found');
        }

        userList = userList.map(user => {
            const { SENHA, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.send(userList);
    };

    getUserById = async (req, res, next) => {
        const user = await UserModel.findOne({ ID: req.params.u_id });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }

        const { SENHA, ...userWithoutPassword } = user;

        res.send(userWithoutPassword);
    };

    getUserByuserName = async (req, res, next) => {
        const user = await UserModel.findOne({ UTILIZADOR: req.params.username });
        if (!user) {
            throw new HttpException(404, 'User not found');
        }

        const { SENHA, ...userWithoutPassword } = user;

        res.send(userWithoutPassword);
    };

    getCurrentUser = async (req, res, next) => {
        const { SENHA, ...userWithoutPassword } = req.currentUser;

        res.send(userWithoutPassword);
    };

    getUsersByParams = async (req, res, next) => {
        this.checkValidation(req);
        // convert the re.body keys into the actual names of the table's colums
        let userList = getNormalizedColumnsValues(req.body);
        let users = await UserModel.findMany(userList);
        if (!users.length) {
            throw new HttpException(404, 'Users not found');
        }

        users = users.map(user => {
            const { SENHA, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });

        res.send(users);
    };

    createUser = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);

        /*
        const profilesList = await getUserProfiles.findMany();
        let activeProfiles = [];
        profilesList.forEach(element => {
            if(element.ESTADO === 'A')
                activeProfiles.push(element.ID);
        });
        console.log("perfis ativos: " + activeProfiles);
        */

        /*

        const findProfile = await getUserProfiles.findMany( { 'ID': req.body.profile_id } );
        if(findProfile.length)
            console.log("Perfil:: " + findProfile[0].CODIGO);
        
        //console.log("uProfile: " + uProfiles);
        // check if a user with that email already exists
        const findEmail = await UserModel.findMany( {'EMAIL': req.body.email} );
        //console.log("findEmail: " + findEmail[0].EMAIL);
        //console.log("findEmail: " + Object.values(findEmail)[Object.keys(findEmail).indexOf("EMAIL")]);
        if(findEmail.length){
            console.log("findEmail in controller: " + findEmail[0].EMAIL);
            const findUsername = await UserModel.findMany( {'UTILIZADOR': req.body.username} );
            if(findUsername.length){
                throw new HttpException(409, 'User with that username and email already exists');
            }
            else{
                throw new HttpException(409, 'User with that email already exists');
            }
        }
        else{
            const findUsername = await UserModel.findMany( {'UTILIZADOR': req.body.username} );
            if(findUsername.length){
                throw new HttpException(409, 'User with that username and email already exists');
            }
        }
        */

        

        const result = await UserModel.create(req.body);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('User was created!');
    };

    updateUser = async (req, res, next) => {
        this.checkValidation(req);

        await this.hashPassword(req);

        //const { confirm_password, ...restOfUpdates } = req.body;
        const { confirm_password, ...restOfUpdates } = req.body;
        const updates = getNormalizedColumnsValues(restOfUpdates);

        // do the update query and get the result
        // it can be partial edit
        const result = await UserModel.update(updates, req.params.username);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'User not found' :
            affectedRows && changedRows ? 'User updated successfully' : 'Updated faild';

        res.send({ message, info });
    };

    deleteUser = async (req, res, next) => {
        this.checkValidation(req);
        const result = await UserModel.delete(req.params.id);
        if (!result) {
            throw new HttpException(404, 'User not found');
        }
        res.send('User has been deleted');
    };

    userLogin = async (req, res, next) => {
        this.checkValidation(req);

        const { email, password: pass } = req.body;

        const user = await UserModel.findOne({ EMAIL: email });

        if (!user) {
            throw new HttpException(401, 'Unable to login!');
        }

        //const isMatch = await bcrypt.compare(pass, user.password);
        const isMatch = await bcrypt.compare(pass, user.SENHA);

        if (!isMatch) {
            throw new HttpException(401, 'Incorrect password!');
        }

        // user matched!
        const secretKey = process.env.SECRET_JWT || "";
        const token = jwt.sign({ user_id: user.ID.toString() }, secretKey, {
            expiresIn: '24h'
        });

        const { SENHA, ...userWithoutPassword } = user;

        res.send({ ...userWithoutPassword, token });
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation faild', errors);
        }
    }

    // hash password if it exists
    hashPassword = async (req) => {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 8);
        }
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new UserController;