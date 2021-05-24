const { body } = require('express-validator');
const Log = require('../../utils/logPresets.utils.js');
const { getNormalizedColumns } = require('../../utils/logColumnNormalizer.utils.js');
const LogModel  = require('../../models/log.model');


exports.getLogsSchema = [
    body('id')
        .optional()
        .notEmpty()
        .withMessage("Id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Log id must be a number"),
    body('user_id')
        .optional()
        .notEmpty()
        .withMessage("User id must be filled")
        .trim()
        .isNumeric()
        .withMessage("User id must be a number"),
    body('table')
        .optional()
        .notEmpty()
        .withMessage("Table must be filled")
        .trim()
        .isIn(Log.Tables)
        .withMessage('Invalid table'),
    body('object_id')
        .optional()
        .notEmpty()
        .withMessage("Object id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Object id must be a number"),      
    body('previous_value')
        .optional()
        .notEmpty()
        .withMessage("Previous value must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),      
    body('new_value')
        .optional()
        .notEmpty()
        .withMessage("New value must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('action')
        .optional()
        .notEmpty()
        .withMessage("Action must be filled")
        .trim()
        .isIn(Log.Actions)
        .withMessage('Invalid action'),
    body('created_at')
        .optional()
        .notEmpty()
        .withMessage("Created at must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss'),
    body('created_at_limit')
        .optional()
        .notEmpty()
        .withMessage("Created at limit must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss')
        .custom((created_at_lim, { req }) => {
            if(req.body.created_at && created_at_lim <= req.body.created_at)
                return false;
            else
                return true;
        })
        .withMessage('End date must be after start date'),
    body('created_at_range')
        .optional()
        .notEmpty()
        .withMessage("Indicator must be filled")
        .trim()
        .isIn(['yes', 'no'])
        .withMessage('Invalid indicator')
        .custom((value, { req }) => { 
            if(value === 'yes' && !req.body.created_at && !req.body.created_at_limit)
                return false;
            else
                return true;
        })
        .withMessage('No range provided'),
    body()
        .custom(value => {
            // convert object keys into colum names
            var searchList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for searching and see if the ones sent match
            const allowSearch = ['ID', 'ID_UTILIZADOR', 'TABELA', 'ID_OBJECTO', 'VALOR_ANTIGO', 'VALOR_NOVO', 'ACAO', 
                                 'DATA_REGISTO','created_at_limit', 'created_at_range'];
            return searchList.every(parameter => allowSearch.includes(parameter));
        })
        .withMessage('Invalid extra fields!')
];

exports.deleteLogSchema = [
    body()
        .custom(async (value, {req}) => {
            const findLog = await LogModel.findOne( {'ID': req.params.id} );
            if(findLog)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Log not found!')
];