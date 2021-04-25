const HttpException = require('../utils/HttpException.utils');
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const auth = (roles=[]) => {
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
            const user = await UserModel.findOne({ id: decoded.user_id });

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

            //console.log("req.currentUser.id: " + req.currentUser.id );
            //console.log("req.params.u_id: " + req.params.u_id + " user.id: " + user.ID);
            //console.log("roles: " + roles );
            let included = false;
            if(roles.length){
                roles.forEach( element => {
                    //console.log("element: " + element + " user.ID_PERFIL: " + user.ID_PERFIL);
                    if(element == user.ID_PERFIL){
                        included = true;
                    }
                });
                //console.log("included: " + included );
                //console.log("ownerAuthorized: "+ !ownerAuthorized +" roles.length: " + roles.length + " included: " + !included);       
            }
            //console.log("ownerAuthorized: "+ !ownerAuthorized +" roles.length: " + roles.length + " included: " + !included);
            // if the current user is not the owner and
            // if the user role don't have the permission to do this action.
            // the user will get this error
            //if (!ownerAuthorized && roles.length && !roles.includes(user.role)) {
            //if (!ownerAuthorized && roles.length && !included) {
            if (!ownerAuthorized && !included) {
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