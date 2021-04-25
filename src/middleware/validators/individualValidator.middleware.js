const { body } = require('express-validator');
const IndividualStates = require('../../utils/individualStates.utils.js');
const IndividualMaritalSatus = require('../../utils/individualMaritalSatus.utils.js');
const { getNormalizedColumns } = require('../../utils/individualColumnNormalizer.utils.js');
const IndividualModel  = require('../../models/individual.model');
const UserModel  = require('../../models/user.model');
const GeografiaModel  = require('../../models/geografia.model');
const PrecedentModel  = require('../../models/precedent.model');
const FingerprintModel  = require('../../models/fingerprint.model');
const PhotoModel  = require('../../models/photo.model');


exports.createIndividualSchema = [
    body('name')
        .exists()
        .withMessage('Name is required')
        .trim()
        .matches(/^[a-zA-Z-' ]+$/)
        .withMessage("Can only contain: a-z, A-Z, - and '")
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('nickname')
        .exists()
        .withMessage('Nickname is required')
        .trim()
        .matches(/^[a-zA-Z0-9-'_ ]+$/)
        .withMessage("Can only contain: a-z, A-Z, 0-9, _, - and '")
        .isLength({ min: 1 })
        .withMessage('Must be at least 1 char long'),
    body('father')
        .exists()
        .withMessage('Father is required')
        .trim()
        .matches(/^[a-zA-Z-' ]+$/)
        .withMessage("Can only contain: a-z, A-Z, - and '")
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('mother')
        .exists()
        .withMessage('Mother is required')
        .trim()
        .matches(/^[a-zA-Z-' ]+$/)
        .withMessage("Can only contain: a-z, A-Z, - and '")
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('nationality')
        .exists()
        .withMessage('Nationality is required')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('birthplace')
        .exists()
        .withMessage('Birthplace is required')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('birthdate')
        .exists()
        .withMessage('Birthdate is required')
        .notEmpty()
        .withMessage("Birthdate must be filled")
        .trim()
        .isDate({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD')
        .custom(birthdt => {
            let today = new Date(); 
            let inserted_date = new Date(birthdt);
            inserted_date.setDate( inserted_date.getDate() + 1 );
            today.setHours(0, 0, 0, 0);
            inserted_date.setHours(0, 0, 0, 0);
            if( inserted_date >= today)
                return false;
            else
                return true;
        })
        .withMessage('Birthdate must be before today'),
    body('apparent_age')
        .exists()
        .withMessage('Aparent age is required')
        .trim()
        .isNumeric()
        .withMessage("Aparent age must be a number"),
    body('marital_status')
        .exists()
        .withMessage('Marital status is required')
        .notEmpty()
        .withMessage("Marital status must be filled")
        .trim()
        .isIn(IndividualMaritalSatus)
        .withMessage('Invalid marital status'),
    body('profession')
        .exists()
        .withMessage('Profession is required')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('residence_id')
        .exists()
        .withMessage('Residence id is required')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .custom(async element => {
            const findCode = await GeografiaModel.findOne( {'ID': element} );
            if(findCode)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Residence id does not match an existing location'),
    body('workplace')
        .exists()
        .withMessage('Workplace is required')
        .trim()
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('doc_num')
        .exists()
        .withMessage('Document number is required')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .matches(/^[a-zA-Z0-9-_ ]+$/)
        .withMessage("Can only contain: a-z, A-Z, 0-9, - and _")
        .custom(async element => {
            const findCode = await IndividualModel.findOne( {'NUM_DOC': element} );
            if(findCode)
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('Document number already exists'),
    body('doc_issuance_date')
        .exists()
        .withMessage('Document issuance date is required')
        .notEmpty()
        .withMessage("Document issuance date must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss')
        .custom(issuancedt => {
            let today = new Date(); 
            let inserted_date = new Date(issuancedt)
            if(today < inserted_date )
                return false;
            else
                return true;
        })
        .withMessage('Document issuance date must be before today'),
    body('doc_issuance_place')
        .exists()
        .withMessage('Document issuance place is required')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('height')
        .exists()
        .withMessage('Height is required')
        .trim()
        .isNumeric()
        .withMessage("Height must be a number"),
    body('hair')
        .exists()
        .withMessage('Hair is required')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('beard')
        .exists()
        .withMessage('Beard is required')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('nose')
        .exists()
        .withMessage('Nose is required')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('mouth')
        .exists()
        .withMessage('Mouth is required')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('face')
        .exists()
        .withMessage('Face is required')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('colour')
        .exists()
        .withMessage('Colour is required')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('tattoos')
        .exists()
        .withMessage('Tattoos is required')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('police_classification')
        .exists()
        .withMessage('Police classification is required')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(IndividualStates)
        .withMessage('Invalid state type'),
    body()
        .custom(value => {
            //convert object keys into column names
            var creatList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for creation and see if the ones sent match
            const allowCreation = ['NOME', 'ALCUNHA', 'PAI', 'MAE', 'NACIONALIDADE', 'LOCAL_NASCIMENTO', 'DATA_NASCIMENTO', 'IDADE_APARENTE', 
                                  'ESTADO_CIVIL', 'PROFISSAO', 'ID_RESIDENCIA', 'LOCAL_TRABALHO', 'NUM_DOC', 'DATA_EMISSAO_DOC', 'LOCAL_EMISSAO_DOC', 
                                  'ALTURA', 'CABELO', 'BARBA', 'NARIZ', 'BOCA', 'ROSTO', 'COR', 'TATUAGENS', 'CLASSIFICACAO_POLICIAL', 'ESTADO'];
            return creatList.every(profile => allowCreation.includes(profile));
        })
        .withMessage('Invalid extra fields!')
];

exports.updateIndividualSchema = [
    body('name')
        .optional()
        .notEmpty()
        .withMessage("Name must be filled")
        .trim()
        .matches(/^[a-zA-Z-' ]+$/)
        .withMessage("Can only contain: a-z, A-Z, - and '")
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('nickname')
        .optional()
        .notEmpty()
        .withMessage("Nickname must be filled")
        .trim()
        .matches(/^[a-zA-Z0-9-'_ ]+$/)
        .withMessage("Can only contain: a-z, A-Z, 0-9, _, - and '")
        .isLength({ min: 1 })
        .withMessage('Must be at least 1 char long'),
    body('father')
        .optional()
        .notEmpty()
        .withMessage("Father must be filled")
        .trim()
        .matches(/^[a-zA-Z-' ]+$/)
        .withMessage("Can only contain: a-z, A-Z, - and '")
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('mother')
        .optional()
        .notEmpty()
        .withMessage("Mother must be filled")
        .trim()
        .matches(/^[a-zA-Z-' ]+$/)
        .withMessage("Can only contain: a-z, A-Z, - and '")
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('nationality')
        .optional()
        .notEmpty()
        .withMessage("Nationality must be filled")
        .trim()
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('birthplace')
        .optional()
        .notEmpty()
        .withMessage("Birthplace must be filled")
        .trim()
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('birthdate')
        .optional()
        .notEmpty()
        .withMessage("Birthdate must be filled")
        .trim()
        .isDate({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD')
        .custom(birthdt => {
            let today = new Date(); 
            let inserted_date = new Date(birthdt);
            inserted_date.setDate( inserted_date.getDate() + 1 );
            today.setHours(0, 0, 0, 0);
            inserted_date.setHours(0, 0, 0, 0);
            if( inserted_date >= today)
                return false;
            else
                return true;
        })
        .withMessage('Birthdate must be before today'),
    body('apparent_age')
        .optional()
        .notEmpty()
        .withMessage("Aparent age must be filled")
        .trim()
        .isNumeric()
        .withMessage("Aparent age must be a number"),
    body('marital_status')
        .optional()
        .notEmpty()
        .withMessage("Marital status must be filled")
        .trim()
        .isIn(IndividualMaritalSatus)
        .withMessage('Invalid marital status'),
    body('profession')
        .optional()
        .notEmpty()
        .withMessage("Profession must be filled")
        .trim()
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('residence_id')
        .optional()
        .notEmpty()
        .withMessage("Residence id must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .custom(async element => {
            const findCode = await GeografiaModel.findOne( {'ID': element} );
            if(findCode)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Residence id does not match an existing location'),
    body('workplace')
        .optional()
        .notEmpty()
        .withMessage("Workplace must be filled")
        .trim()
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('doc_num')
        .optional()
        .notEmpty()
        .withMessage("Document number must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .matches(/^[a-zA-Z0-9-_ ]+$/)
        .withMessage("Can only contain: a-z, A-Z, 0-9, - and _")
        .custom(async (element, {req}) => {
            const findIndividual = await IndividualModel.findOne( {'ID': req.params.id} );
            if(findIndividual){
                const findDocNum = await IndividualModel.findOne( {'NUM_DOC': element} );
                if(findDocNum){
                    if(findDocNum.NUM_DOC === findIndividual.NUM_DOC)
                        return Promise.resolve();
                    else
                        return Promise.reject();
                }
                else
                    return Promise.resolve();
            }
            else
                return Promise.resolve();
        })
        .withMessage('Document number already exists'),
    body('doc_issuance_date')
        .optional()
        .notEmpty()
        .withMessage("Document issuance date must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss')
        .custom(issuancedt => {
            let today = new Date(); 
            let inserted_date = new Date(issuancedt)
            if(today < inserted_date )
                return false;
            else
                return true;
        })
        .withMessage('Document issuance date must be before today'),
    body('doc_issuance_place')
        .optional()
        .notEmpty()
        .withMessage("Document issuance place must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('height')
        .optional()
        .notEmpty()
        .withMessage("Height must be filled")
        .trim()
        .isNumeric()
        .withMessage("Height must be a number"),
    body('hair')
        .optional()
        .notEmpty()
        .withMessage("Hair must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('beard')
        .optional()
        .notEmpty()
        .withMessage("Beard must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('nose')
        .optional()
        .notEmpty()
        .withMessage("Nose must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('mouth')
        .optional()
        .notEmpty()
        .withMessage("Mouth must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('face')
        .optional()
        .notEmpty()
        .withMessage("Face must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('colour')
        .optional()
        .notEmpty()
        .withMessage("Colour must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('tattoos')
        .optional()
        .notEmpty()
        .withMessage("Tattoos must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('police_classification')
        .optional()
        .notEmpty()
        .withMessage("Police classification must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(IndividualStates)
        .withMessage('Invalid state type'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(async (value, {req}) => {
            const findIndividual = await IndividualModel.findOne( {'ID': req.params.id} );
            if(findIndividual)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('The Individual you want to update does not exist!')
        .custom(value => {
            // convert object keys into colum names
            var updatesList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for updating and see if the ones sent match
            const allowUpdates = ['NOME', 'ALCUNHA', 'PAI', 'MAE', 'NACIONALIDADE', 'LOCAL_NASCIMENTO', 'DATA_NASCIMENTO', 'IDADE_APARENTE', 
                                  'ESTADO_CIVIL', 'PROFISSAO', 'ID_RESIDENCIA', 'LOCAL_TRABALHO', 'NUM_DOC', 'DATA_EMISSAO_DOC', 'LOCAL_EMISSAO_DOC', 
                                  'ALTURA', 'CABELO', 'BARBA', 'NARIZ', 'BOCA', 'ROSTO', 'COR', 'TATUAGENS', 'CLASSIFICACAO_POLICIAL', 'ESTADO'];
            return updatesList.every(parameter => allowUpdates.includes(parameter));
        })
        .withMessage('Invalid updates!')
];

exports.getIndividualsSchema = [
    body('id')
        .optional()
        .notEmpty()
        .withMessage("Id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Individual id must be a number"),
    body('user_id')
        .optional()
        .notEmpty()
        .withMessage("User id must be filled")
        .trim()
        .isNumeric()
        .withMessage("User id must be a number"),
    body('name')
        .optional()
        .notEmpty()
        .withMessage("Name must be filled")
        .trim()
        .matches(/^[a-zA-Z-' ]+$/)
        .withMessage("Can only contain: a-z, A-Z, - and '")
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('nickname')
        .optional()
        .notEmpty()
        .withMessage("Nickname must be filled")
        .trim()
        .matches(/^[a-zA-Z0-9-'_ ]+$/)
        .withMessage("Can only contain: a-z, A-Z, 0-9, _, - and '")
        .isLength({ min: 1 })
        .withMessage('Must be at least 1 char long'),
    body('father')
        .optional()
        .notEmpty()
        .withMessage("Father must be filled")
        .trim()
        .matches(/^[a-zA-Z-' ]+$/)
        .withMessage("Can only contain: a-z, A-Z, - and '")
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('mother')
        .optional()
        .notEmpty()
        .withMessage("Mother must be filled")
        .trim()
        .matches(/^[a-zA-Z-' ]+$/)
        .withMessage("Can only contain: a-z, A-Z, - and '")
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('nationality')
        .optional()
        .notEmpty()
        .withMessage("Nationality must be filled")
        .trim()
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('birthplace')
        .optional()
        .notEmpty()
        .withMessage("Birthplace must be filled")
        .trim()
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('birthdate')
        .optional()
        .notEmpty()
        .withMessage("Birthdate must be filled")
        .trim()
        .isDate({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD'),
    body('birthdate_limit')
        .optional()
        .notEmpty()
        .withMessage("Birthdate limit must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss')
        .custom((birthdate_lim, { req }) => {
            if(req.body.birthdate && birthdate_lim <= req.body.birthdate)
                return false;
            else
                return true;
        })
        .withMessage('End date must be after start date'),
    body('birthdate_range')
        .optional()
        .notEmpty()
        .withMessage("Indicator must be filled")
        .trim()
        .isIn(['yes', 'no'])
        .withMessage('Invalid indicator')
        .custom((value, { req }) => { 
            if(value === 'yes' && !req.body.birthdate && !req.body.birthdate_limit)
                return false;
            else
                return true;
        })
        .withMessage('No range provided'),
    body('apparent_age')
        .optional()
        .notEmpty()
        .withMessage("Apparent age must be filled")
        .trim()
        .isNumeric()
        .withMessage("Apparent age must be a number"),
    body('apparent_age_limit')
        .optional()
        .notEmpty()
        .withMessage("Apparent age limit must be filled")
        .trim()
        .isNumeric()
        .withMessage("Apparent age limit must be a number")
        .custom((apparent_age_lim, { req }) => {
            if(req.body.apparent_age && apparent_age_lim <= req.body.apparent_age)
                return false;
            else
                return true;
        })
        .withMessage('End age must be higher than start age'),
    body('apparent_age_range')
        .optional()
        .notEmpty()
        .withMessage("Indicator must be filled")
        .trim()
        .isIn(['yes', 'no'])
        .withMessage('Invalid indicator')
        .custom((value, { req }) => { 
            if(value === 'yes' && !req.body.apparent_age && !req.body.apparent_age_limit)
                return false;
            else
                return true;
        })
        .withMessage('No range provided'),
    body('marital_status')
        .optional()
        .notEmpty()
        .withMessage("Marital status must be filled")
        .trim()
        .isIn(IndividualMaritalSatus)
        .withMessage('Invalid marital status'),
    body('profession')
        .optional()
        .notEmpty()
        .withMessage("Profession must be filled")
        .trim()
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('residence_id')
        .optional()
        .notEmpty()
        .withMessage("Residence id must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('workplace')
        .optional()
        .notEmpty()
        .withMessage("Workplace must be filled")
        .trim()
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('doc_num')
        .optional()
        .notEmpty()
        .withMessage("Document number must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .matches(/^[a-zA-Z0-9-_ ]+$/)
        .withMessage("Can only contain: a-z, A-Z, 0-9, - and _"),
    body('doc_issuance_date')
        .optional()
        .notEmpty()
        .withMessage("Document issuance date must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss'),
    body('doc_issuance_date_limit')
        .optional()
        .notEmpty()
        .withMessage("Document issuance date limit must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss')
        .custom((doc_issuance_date_lim, { req }) => {
            if(req.body.doc_issuance_date && doc_issuance_date_lim <= req.body.doc_issuance_date)
                return false;
            else
                return true;
        })
        .withMessage('End date must be after start date'),
    body('doc_issuance_date_range')
        .optional()
        .notEmpty()
        .withMessage("Indicator must be filled")
        .trim()
        .isIn(['yes', 'no'])
        .withMessage('Invalid indicator')
        .custom((value, { req }) => { 
            if(value === 'yes' && !req.body.doc_issuance_date && !req.body.doc_issuance_date_limit)
                return false;
            else
                return true;
        })
        .withMessage('No range provided'),
    body('doc_issuance_place')
        .optional()
        .notEmpty()
        .withMessage("Document issuance place must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('height')
        .optional()
        .notEmpty()
        .withMessage("Height must be filled")
        .trim()
        .isNumeric()
        .withMessage("Height must be a number"),
    body('height_limit')
        .optional()
        .notEmpty()
        .withMessage("Height limit must be filled")
        .trim()
        .isNumeric()
        .withMessage("Height limit must be a number").custom((height_lim, { req }) => {
            if(req.body.height && height_lim <= req.body.height)
                return false;
            else
                return true;
        })
        .withMessage('End height must be higher than start height'),
    body('height_range')
        .optional()
        .notEmpty()
        .withMessage("Indicator must be filled")
        .trim()
        .isIn(['yes', 'no'])
        .withMessage('Invalid indicator')
        .custom((value, { req }) => { 
            if(value === 'yes' && !req.body.height && !req.body.height_limit)
                return false;
            else
                return true;
        })
        .withMessage('No range provided'),
    body('hair')
        .optional()
        .notEmpty()
        .withMessage("Hair must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('beard')
        .optional()
        .notEmpty()
        .withMessage("Beard must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('nose')
        .optional()
        .notEmpty()
        .withMessage("Nose must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('mouth')
        .optional()
        .notEmpty()
        .withMessage("Mouth must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('face')
        .optional()
        .notEmpty()
        .withMessage("Face must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('colour')
        .optional()
        .notEmpty()
        .withMessage("Colour must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('tattoos')
        .optional()
        .notEmpty()
        .withMessage("Tattoos must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('police_classification')
        .optional()
        .notEmpty()
        .withMessage("Police classification must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),

    body('state')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(IndividualStates)
        .withMessage('Invalid state type'), 
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
            const allowSearch = ['ID', 'ID_UTILIZADOR', 'NOME', 'ALCUNHA', 'PAI', 'MAE', 'NACIONALIDADE', 'LOCAL_NASCIMENTO', 'DATA_NASCIMENTO', 
                                 'IDADE_APARENTE', 'ESTADO_CIVIL', 'PROFISSAO', 'ID_RESIDENCIA', 'LOCAL_TRABALHO', 'NUM_DOC', 'DATA_EMISSAO_DOC', 
                                 'LOCAL_EMISSAO_DOC', 'ALTURA', 'CABELO', 'BARBA', 'NARIZ', 'BOCA', 'ROSTO', 'COR', 'TATUAGENS', 'CLASSIFICACAO_POLICIAL', 
                                 'ESTADO', 'DATA_REGISTO', 'birthdate_limit', 'birthdate_range', 'apparent_age_limit', 'apparent_age_range', 
                                 'doc_issuance_date_limit', 'doc_issuance_date_range', 'height_limit', 'height_range', 'created_at_limit', 
                                 'created_at_range'];
            return searchList.every(parameter => allowSearch.includes(parameter));
        })
        .withMessage('Invalid extra fields!')
];

exports.deleteIndividualSchema = [
    body()
        .custom(async (value, {req}) => {
            const findIndividual = await IndividualModel.findOne( {'ID': req.params.id} );
            if(findIndividual)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Individual not found!')
        .custom(async (value, {req}) => {
            const findPrecedents = await PrecedentModel.findOne( {'ID_INDIVIDUO': req.params.id} );
            if(findPrecedents)
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('Individual has precedents!')
        .custom(async (value, {req}) => {
            const findFingerprint = await FingerprintModel.findOne( {'ID_INDIVIDUO': req.params.id} );
            if(findFingerprint)
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('Individual has fingerprints!')
        .custom(async (value, {req}) => {
            const findPhotos = await PhotoModel.findOne( {'ID_INDIVIDUO': req.params.id} );
            if(findPhotos)
                return Promise.reject();
            else
                return Promise.resolve();
        })
        .withMessage('Individual has photos!')
];