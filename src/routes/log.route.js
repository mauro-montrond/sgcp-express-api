const express = require('express');
const router = express.Router();
const logController = require('../controllers/log.controller');
const auth = require('../middleware/auth.middleware');
const Action = require('../utils/menuActions.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { getLogsSchema,  deleteLogSchema} = require('../middleware/validators/logValidator.middleware');

router.get('/', auth(Action.Log.listLog.listLogByParams), awaitHandlerFactory(logController.getAllLog)); // localhost:3000/api/v1/logs
router.get('/params', auth(Action.Log.listLog.listLogByParams), getLogsSchema, awaitHandlerFactory(logController.getLogsByParams)); // localhost:3000/api/v1/logs/params
router.get('/id/:id', auth(Action.Log.listLog.listLogByParams), awaitHandlerFactory(logController.getLogById)); // localhost:3000/api/v1/logs/id/1
router.delete('/id/:id', auth(Action.Log.deleteLog), deleteLogSchema, awaitHandlerFactory(logController.deleteLog)); // localhost:3000/api/v1/logs/id/4


module.exports = router;