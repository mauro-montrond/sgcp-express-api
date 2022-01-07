const { body } = require('express-validator');
const PrecedentStates = require('../../utils/precedentStates.utils.js');
const { getNormalizedColumns } = require('../../utils/precedentColumnNormalizer.utils.js');
const PrecedentModel  = require('../../models/precedent.model');
const IndividualModel = require('../../models/individual.model.js');


exports.createPrecedentSchema = [     
    body('individual_id')
        .notEmpty()
        .withMessage("Individual id must be filled")
        .exists()
        .withMessage('Individual is required')
        .trim()
        .isNumeric()
        .withMessage("Individual id must be a number")
        .custom(async () => {
            const findIndividual = await IndividualModel.find();
            if(findIndividual.length)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('No Individuals exist')
        .custom(async element => {
            const findIndividual = await IndividualModel.findOne( {'ID': element} );
            if(findIndividual)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Individual not found')
        .custom(async element => {
            const findIndividual = await IndividualModel.findOne( {'ID': element} );
            if(findIndividual && findIndividual.ESTADO != 'A')
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('That individual is not in a valid state'),
    body('reference_num')
        .exists()
        .withMessage('Reference number is required')
        .notEmpty()
        .withMessage("Reference number must be filled")
        .trim()
        .isLength({ min: 3, max: 45 })
        .withMessage('Must be 3-45 chars long'),
    body('detention_reason')
        .exists()
        .withMessage('Detention reason is required')
        .notEmpty()
        .withMessage("Detention reason must be filled")
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Must be 3-100 chars long'),
    body('destination')
        .exists()
        .withMessage('Destination is required')
        .notEmpty()
        .withMessage("Destination must be filled")
        .trim()
        .isLength({ min: 3, max: 45 })
        .withMessage('Must be 3-45 chars long'),
    body('date')
        .optional()
        .notEmpty()
        .withMessage("Date must be filled")
        .trim()
        .isDate({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD')
        .custom(incidentDacte => {
            let today = new Date(); 
            let inserted_date = new Date(incidentDacte);
            inserted_date.setDate( inserted_date.getDate() + 1 );
            today.setHours(0, 0, 0, 0);
            inserted_date.setHours(0, 0, 0, 0);
            if( inserted_date > today)
                return false;
            else
                return true;
        })
        .withMessage("Date can't be after today"),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(PrecedentStates)
        .withMessage('Invalid state type'),
    body()
        .custom(value => {
            //convert object keys into column names
            var creatList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for creation and see if the ones sent match
            const allowCreation = ['ID_INDIVIDUO', 'NO_REFERENCIA', 'MOTIVO_DETENCAO', 'DESTINO', 'ESTADO', 'DATA'];
            return creatList.every(parameter => allowCreation.includes(parameter));
        })
        .withMessage('Invalid extra fields!')

];

exports.updatePrecedentSchema = [
    body('reference_num')
        .optional()
        .notEmpty()
        .withMessage("Reference number must be filled")
        .trim()
        .isLength({ min: 3, max: 45 })
        .withMessage('Must be 3-45 chars long'),
    body('detention_reason')
        .optional()
        .notEmpty()
        .withMessage("Detention reason must be filled")
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Must be 3-100 chars long'),
    body('destination')
        .optional()
        .notEmpty()
        .withMessage("Destination must be filled")
        .trim()
        .isLength({ min: 3, max: 45 })
        .withMessage('Must be 3-45 chars long'),
    body('date')
        .optional()
        .notEmpty()
        .withMessage("Date must be filled")
        .trim()
        .isDate({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD')
        .custom(incidentDacte => {
            let today = new Date(); 
            let inserted_date = new Date(incidentDacte);
            inserted_date.setDate( inserted_date.getDate() + 1 );
            today.setHours(0, 0, 0, 0);
            inserted_date.setHours(0, 0, 0, 0);
            if( inserted_date > today)
                return false;
            else
                return true;
        })
        .withMessage("Date can't be after today"),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(PrecedentStates)
        .withMessage('Invalid state type'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(async (value, {req}) => {
            const findPrecedent = await PrecedentModel.findOne( {'ID': req.params.id} );
            if(findPrecedent)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('The precedent you want to update does not exist!')
        .custom(value => {
            // convert object keys into colum names
            var updatesList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for updating and see if the ones sent match
            const allowUpdates = ['NO_REFERENCIA', 'MOTIVO_DETENCAO', 'DESTINO', 'ESTADO', 'DATA'];
            return updatesList.every(parameter => allowUpdates.includes(parameter));
        })
        .withMessage('Invalid updates!')
];

exports.getPrecedentsSchema = [
     body('id')
        .optional()
        .notEmpty()
        .withMessage("Precedent id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Precedent id must be a number"), 
     body('user_id')
        .optional()
        .notEmpty()
        .withMessage("User id must be filled")
        .trim()
        .isNumeric()
        .withMessage("User id must be a number"),     
    body('individual_id')
        .optional()
        .notEmpty()
        .withMessage("Individual id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Individual id must be a number"),
    body('detention_reason')
        .optional()
        .notEmpty()
        .withMessage("Detention reason must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('destination')
        .optional()
        .notEmpty()
        .withMessage("Destination must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(PrecedentStates)
        .withMessage('Invalid state type'),
    body('date')
        .optional()
        .notEmpty()
        .withMessage("Date must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss'),
    body('date_limit')
        .optional()
        .notEmpty()
        .withMessage("Date limit must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss')
        .custom((date_lim, { req }) => {
            if(req.body.date && date_lim <= req.body.date)
                return false;
            else
                return true;
        })
        .withMessage('End date must be after start date'),
    body('date_range')
        .optional()
        .notEmpty()
        .withMessage("Indicator must be filled")
        .trim()
        .isIn(['yes', 'no'])
        .withMessage('Invalid indicator')
        .custom((value, { req }) => { 
            if(value === 'yes' && !req.body.date && !req.body.date_limit)
                return false;
            else
                return true;
        })
        .withMessage('No range provided'),
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
            const allowSearch = ['ID', 'ID_UTILIZADOR', 'ID_INDIVIDUO', 'NO_REFERENCIA', 'MOTIVO_DETENCAO', 'DESTINO', 'ESTADO', 'DATA', 'DATA_REGISTO',
                                 'date_limit', 'date_range', 'created_at_limit', 'created_at_range'];
            return searchList.every(parameter => allowSearch.includes(parameter));
        })
        .withMessage('Invalid extra fields!')
];

exports.deletePrecedentSchema = [
    body()
        .custom(async (value, {req}) => {
            const findPrecedent = await PrecedentModel.findOne( {'ID': req.params.id} );
            if(findPrecedent)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Precedent not found!')
];