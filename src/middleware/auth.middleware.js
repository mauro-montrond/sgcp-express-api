const HttpException = require('../utils/HttpException.utils');
const UserModel = require('../models/user.model');
const PermissionModel = require('../models/permission.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const auth = (menuCode) => {
    return async function (req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            const bearer = 'Bearer ';

            if (!authHeader || !authHeader.startsWith(bearer)) {
                throw new HttpException(401, 'Access denied. No credentials sent!');
            }

            const token = authHeader.replace(bearer, '');
            const secretKey = process.env.SECRET_JWT || "";

            // Verify Token
            const decoded = jwt.verify(token, secretKey);
            const user = await UserModel.findOne({ ID: decoded.user_id });

            if (!user) {
                throw new HttpException(401, 'Authentication failed!');
            }

            // check if the current user is the owner user
            //const ownerAuthorized = req.params.id == user.id;
            let ownerAuthorized;
            if(req.params.u_id)
                 ownerAuthorized = req.params.u_id == user.ID;// owner is searching by his own id
            else{
                if(req.params.username)
                    ownerAuthorized = req.params.username == user.UTILIZADOR;// owner is searching by his own username
                else
                    ownerAuthorized = req.body.u_id == user.ID;
            }

            let authorized = false;
            if(menuCode){
                const permission = await PermissionModel.findMany( { ID_UTILIZADOR: user.ID, ESTADO_UTILIZADOR: 'A', ESTADO_PERFIL: 'A', 
                                                              ESTADO_MENU: 'A',  ESTADO_MENU_PERFIL: 'A', CODIGO_MENU: menuCode } );
                if (permission.length) {
                    authorized = true;
                }
            }
            // if the current user is not the owner and
            // if the user role don't have the permission to do this action.
            // the user will get this error
            //if (!ownerAuthorized && roles.length && !roles.includes(user.role)) {
            //if (!ownerAuthorized && roles.length && !included) {
            if (!ownerAuthorized && !authorized) {
                throw new HttpException(401, 'Unauthorized');
            }

            // if the user has permissions
            req.currentUser = user;
            next();

        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

module.exports = auth;