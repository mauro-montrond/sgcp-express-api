const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
//const Role = require('../utils/userRoles.utils');
const Action = require('../utils/menuActions.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
// new
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 2.8 * Math.pow(1024, 2 /* MBs*/)},
    fileFilter(req, file, cb){
        //Validate the files as you wish, this is just an example
        let valImg = true;
        if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
            valImg = false;
            // dynamically add a error for each file field
            eval("req." + file.fieldname + "ValidationError = " + '"Only image files are allowed!";');
        }
        cb(null, valImg);
    },
});

const uploadFields = upload.fields([
    { name: 'profilePhotoFile', maxCount: 1},
]);
// end new

const { createUserSchema, updateUserSchema, getUsersSchema, deleteUserSchema, validateLogin } = require('../middleware/validators/userValidator.middleware');

/*
router.get('/', auth(), awaitHandlerFactory(userController.getAllUsers)); // localhost:3000/api/v1/users
router.get('/id/:id', auth(), awaitHandlerFactory(userController.getUserById)); // localhost:3000/api/v1/users/id/1
router.get('/username/:username', auth(), awaitHandlerFactory(userController.getUserByuserName)); // localhost:3000/api/v1/users/usersname/julia
router.get('/whoami', auth(), awaitHandlerFactory(userController.getCurrentUser)); // localhost:3000/api/v1/users/whoami
router.post('/', createUserSchema, awaitHandlerFactory(userController.createUser)); // localhost:3000/api/v1/users
router.patch('/id/:id', auth(Role.Admin), updateUserSchema, awaitHandlerFactory(userController.updateUser)); // localhost:3000/api/v1/users/id/1 , using patch for partial update
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(userController.deleteUser)); // localhost:3000/api/v1/users/id/1
*/

router.get('/', auth(Action.User.listUser.listUserByParams), awaitHandlerFactory(userController.getAllUsers)); // localhost:3000/api/v1/users
router.get('/params', auth(Action.User.listUser.listUserByParams), getUsersSchema, awaitHandlerFactory(userController.getUsersByParams)); // localhost:3000/api/v1/users/params
router.get('/id/:u_id', auth(Action.User.listUser.listUserByParams), awaitHandlerFactory(userController.getUserById)); // localhost:3000/api/v1/users/id/1
router.get('/username/:username', auth(Action.User.listUser.listUserByParams), awaitHandlerFactory(userController.getUserByuserName)); // localhost:3000/api/v1/users/usersname/julia
router.get('/whoami', auth(), awaitHandlerFactory(userController.getCurrentUser)); // localhost:3000/api/v1/users/whoami
router.post('/', auth(Action.User.createUser), uploadFields, createUserSchema, awaitHandlerFactory(userController.createUser)); // localhost:3000/api/v1/users
router.patch('/username/:username', auth(Action.User.updateUser), uploadFields, updateUserSchema, awaitHandlerFactory(userController.updateUser)); // localhost:3000/api/v1/users/username/user03 , using patch for partial update
router.delete('/id/:id', auth(Action.User.deleteUser), deleteUserSchema, awaitHandlerFactory(userController.deleteUser)); // localhost:3000/api/v1/users/id/3


router.post('/login', validateLogin, awaitHandlerFactory(userController.userLogin)); // localhost:3000/api/v1/users/login

module.exports = router;