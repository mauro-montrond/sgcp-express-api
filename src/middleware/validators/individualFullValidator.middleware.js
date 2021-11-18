const { body } = require('express-validator');
const IndividualStates = require('../../utils/individualStates.utils.js');
const PhotoStates = require('../../utils/photoStates.utils.js');
const PrecedentStates = require('../../utils/precedentStates.utils.js');
const IndividualMaritalSatus = require('../../utils/individualMaritalSatus.utils.js');
const { getNormalizedColumns } = require('../../utils/individualFullColumnNormalizer.utils.js');
const IndividualModel  = require('../../models/individual.model');
// const UserModel  = require('../../models/user.model');
const GeografiaModel  = require('../../models/geografia.model');
const PrecedentModel  = require('../../models/precedent.model');
// const FingerprintModel  = require('../../models/fingerprint.model');
const PhotoModel  = require('../../models/photo.model');

exports.createIndividualFullSchema = [
    body('individual_name')
        .exists()
        .withMessage('Individual name is required')
        .trim()
        .matches(/^[a-zA-Z-' ]+$/)
        .withMessage("Can only contain: a-z, A-Z, - and '")
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('nickname')
        .optional()
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
        .optional()
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
        .optional()
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
        .optional()
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
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('beard')
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('nose')
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('mouth')
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('face')
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('colour')
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('tattoos')
        .optional()
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('police_classification')
        .exists()
        .withMessage('Police classification is required')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('individualState')
        .optional()
        .notEmpty()
        .withMessage("Individual state must be filled")
        .trim()
        .isIn(IndividualStates)
        .withMessage('Invalid state type'),
    ////////// fingerprints //////////
    body('r_thumbFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        // .custom( (value, {req, path}) => !!req.files[path])
        .custom( (value, {req, path}) => {
            // if (req.photoValidationError)
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('r_indexFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        // .custom( (value, {req, path}) => !!req.files[path])
        .custom( (value, {req, path}) => {
            // if (req.photoValidationError)
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('r_middleFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        // .custom( (value, {req, path}) => !!req.files[path])
        .custom( (value, {req, path}) => {
            // if (req.photoValidationError)
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('r_ringFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        // .custom( (value, {req, path}) => !!req.files[path])
        .custom( (value, {req, path}) => {
            // if (req.photoValidationError)
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('r_littleFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        // .custom( (value, {req, path}) => !!req.files[path])
        .custom( (value, {req, path}) => {
            // if (req.photoValidationError)
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_thumbFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        // .custom( (value, {req, path}) => !!req.files[path])
        .custom( (value, {req, path}) => {
            // if (req.photoValidationError)
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_indexFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        // .custom( (value, {req, path}) => !!req.files[path])
        .custom( (value, {req, path}) => {
            // if (req.photoValidationError)
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_middleFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        // .custom( (value, {req, path}) => !!req.files[path])
        .custom( (value, {req, path}) => {
            // if (req.photoValidationError)
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_ringFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        // .custom( (value, {req, path}) => !!req.files[path])
        .custom( (value, {req, path}) => {
            // if (req.photoValidationError)
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_littleFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        // .custom( (value, {req, path}) => !!req.files[path])
        .custom( (value, {req, path}) => {
            // if (req.photoValidationError)
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    ////////// photos //////////
    body('l_photoFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        // .custom( (value, {req, path}) => !!req.files[path])
        .custom( (value, {req, path}) => {
            // if (req.photoValidationError)
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path] && !!req.files["f_photoFile"]) {
                if(req.files[path][0].originalname == req.files["f_photoFile"][0].originalname)
                    return false;
            }
            if (!!req.files[path] && !!req.files["r_photoFile"]) {
                if(req.files[path][0].originalname == req.files["r_photoFile"][0].originalname)
                    return false;
            }
            return true;
        })
        .withMessage('each photo must be different!'),
    body('f_photoFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        // .custom( (value, {req, path}) => !!req.files[path])
        .custom( (value, {req, path}) => {
            // if (req.photoValidationError)
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path] && !!req.files["l_photoFile"]) {
                if(req.files[path][0].originalname == req.files["l_photoFile"][0].originalname)
                    return false;
            }
            if (!!req.files[path] && !!req.files["r_photoFile"]) {
                if(req.files[path][0].originalname == req.files["r_photoFile"][0].originalname)
                    return false;
            }
            return true;
        })
        .withMessage('each photo must be different!'),
    body('r_photoFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        // .custom( (value, {req, path}) => !!req.files[path])
        .custom( (value, {req, path}) => {
            // if (req.photoValidationError)
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path] && !!req.files["l_photoFile"]) {
                if(req.files[path][0].originalname == req.files["l_photoFile"][0].originalname)
                    return false;
            }
            if (!!req.files[path] && !!req.files["f_photoFile"]) {
                if(req.files[path][0].originalname == req.files["f_photoFile"][0].originalname)
                    return false;
            }
            return true;
        })
        .withMessage('each photo must be different!'),
    body('photoState')
        .optional()
        .notEmpty()
        .withMessage("Photos state must be filled")
        .trim()
        .isIn(PhotoStates)
        .withMessage('Invalid state type'),
    ////////// precedent //////////
    body('reference_num')
        .exists()
        .withMessage('Reference number is required')
        .notEmpty()
        .withMessage("Reference number must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('detention_reason')
        .exists()
        .withMessage('Detention reason is required')
        .notEmpty()
        .withMessage("Detention reason must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('destination')
        .exists()
        .withMessage('Destination is required')
        .notEmpty()
        .withMessage("Destination must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
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
    body('precedentState')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(PrecedentStates)
        .withMessage('Invalid state type'),

    body()
        .custom((value, {req}) => {
            if(req.body.r_photo || req.body.f_photo|| req.body.l_photo ||
               req.body.r_thumb || req.body.r_index|| req.body.r_middle || req.body.r_ring || req.body.r_little ||
               req.body.l_thumb || req.body.l_index|| req.body.l_middle || req.body.l_ring || req.body.l_little) {
                   return false;
            } else {
                // get  a list of all the parameters from body
                var prepList = Object.keys(value);
                // add the files to the list
                Object.keys(req.files).forEach(file => {
                    prepList.push(file);
                });
                //convert the elements on the list into column names
                var creatList = getNormalizedColumns(prepList);
                //Set the allowed field for creation and see if the ones sent match
                const allowCreation = ['NOME_INDIVIDUO', 'ALCUNHA', 'PAI', 'MAE', 'NACIONALIDADE', 'LOCAL_NASCIMENTO', 'DATA_NASCIMENTO', 'IDADE_APARENTE', 
                                      'ESTADO_CIVIL', 'PROFISSAO', 'ID_RESIDENCIA', 'LOCAL_TRABALHO', 'NUM_DOC', 'DATA_EMISSAO_DOC', 'LOCAL_EMISSAO_DOC', 
                                      'ALTURA', 'CABELO', 'BARBA', 'NARIZ', 'BOCA', 'ROSTO', 'COR', 'TATUAGENS', 'CLASSIFICACAO_POLICIAL', 'ESTADO_INDIVIDUO',
                                      // fingerprints //
                                      'POLEGAR_DIREITO', 'INDICADOR_DIREITO', 'MEDIO_DIREITO', 'ANELAR_DIREITO', 'MINDINHO_DIREITO', 
                                      'POLEGAR_ESQUERDO', 'INDICADOR_ESQUERDO', 'MEDIO_ESQUERDO', 'ANELAR_ESQUERDO', 'MINDINHO_ESQUERDO',
                                      // photos //
                                      'FOTO_ESQUERDA', 'FOTO_FRONTAL', 'FOTO_DIREITA', 'ESTADO_FOTOS',
                                      // precedent //
                                      'NO_REFERENCIA', 'MOTIVO_DETENCAO', 'DESTINO', 'DATA', 'ESTADO_ANTECEDENTE'];
                return creatList.every(profile => allowCreation.includes(profile));
            }
        })
        .withMessage('Invalid extra fields!')
];

exports.updateIndividualFullSchema = [
    body('individual_name')
        .optional()
        .notEmpty()
        .withMessage("Individual name must be filled")
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
    body('individualState')
        .optional()
        .notEmpty()
        .withMessage("Individual state must be filled")
        .trim()
        .isIn(IndividualStates)
        .withMessage('Invalid state type'),
    /// fingerprint ///
    body('r_thumbFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('r_indexFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('r_middleFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('r_ringFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('r_littleFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_thumbFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_indexFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_middleFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_ringFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    body('l_littleFile')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg" && req.files[path][0].mimetype !== "image/png")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg nor png file!')
        .custom((value, {req, path}) => {
            if(!!req.files[path]) {
                if ( checkDuplicateFingerprint(req, req.files[path][0].originalname) > 1)
                    return false;
                else
                    return true;
            }
            return true;
        })
        .withMessage('Each fingerprint must be different'),
    /// photos ///
    body('photo_id')
        .optional()
        .notEmpty()
        .withMessage("Photo id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Photo id must be a number")
        .custom(async (element, {req}) => {
            const currentIndinviduo = await IndividualModel.findOne( {'ID': req.params.id} );
            if(currentIndinviduo){
                const hasPhoto = await PhotoModel.findOne({'ID_INDIVIDUO': currentIndinviduo.ID})
                if (!hasPhoto && element)
                    return Promise.reject();
                else
                    return Promise.resolve();
            }
            else 
                return Promise.resolve();
        })
        .withMessage('The individual has no photos')
        .custom(async (element, {req}) => {
            const hasPhoto = await PhotoModel.findOne({'ID_INDIVIDUO': req.params.id})
            if (hasPhoto){
                const currentPhoto = await PhotoModel.findOne({'ID': element});
                if(currentPhoto && currentPhoto.ID_INDIVIDUO == req.params.id)
                    return Promise.resolve()
                else
                    return Promise.reject();
            }
            else
                return Promise.resolve();
        })
        .withMessage('The individual has no photos with that id'),
    body('l_photoFile')
        .custom((element, {req, path}) => {
            if (!req.body.photo_id && req.files[path])
                return false;
            else
                return true;
        })
        .withMessage('No photo specified')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path] && !!req.files["f_photoFile"]) {
                if(req.files[path][0].originalname == req.files["f_photoFile"][0].originalname)
                    return false;
            }
            if (!!req.files[path] && !!req.files["r_photoFile"]) {
                if(req.files[path][0].originalname == req.files["r_photoFile"][0].originalname)
                    return false;
            }
            return true;
        })
        .withMessage('each photo must be different!'),
    body('f_photoFile')
        .custom((element, {req, path}) => {
            if (!req.body.photo_id && req.files[path])
                return false;
            else
                return true;
        })
        .withMessage('No photo specified')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path] && !!req.files["l_photoFile"]) {
                if(req.files[path][0].originalname == req.files["l_photoFile"][0].originalname)
                    return false;
            }
            if (!!req.files[path] && !!req.files["r_photoFile"]) {
                if(req.files[path][0].originalname == req.files["r_photoFile"][0].originalname)
                    return false;
            }
            return true;
        })
        .withMessage('each photo must be different!'),
    body('r_photoFile')
        .custom((element, {req, path}) => {
            if (!req.body.photo_id && req.files[path])
                return false;
            else
                return true;
        })
        .withMessage('No photo specified')
        .custom( (value, {req, path}) => {
            if(!req.files[path] && value) {
                if(!eval('req.' + path + 'ValidationError'))
                    return false;
            }
            return true;
        })
        .withMessage('not a image input!')
        .custom( (value, {req, path}) => {
            if (eval('req.' + path + 'ValidationError'))
                return false;
            return true;
        })
        .withMessage('not a image file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path]) {
                if(req.files[path][0].mimetype !== "image/jpeg")
                    return false;
            }
            return true;
        })
        .withMessage('not a jpeg file!')
        .custom( (value, {req, path}) => {
            if (!!req.files[path] && !!req.files["l_photoFile"]) {
                if(req.files[path][0].originalname == req.files["l_photoFile"][0].originalname)
                    return false;
            }
            if (!!req.files[path] && !!req.files["f_photoFile"]) {
                if(req.files[path][0].originalname == req.files["f_photoFile"][0].originalname)
                    return false;
            }
            return true;
        })
        .withMessage('each photo must be different!'),
    body('photoState')
        .optional()
        .notEmpty()
        .withMessage("Photo state must be filled")
        .trim()
        .isIn(PhotoStates)
        .withMessage('Invalid state type')
        .custom((element, {req}) => {
            if (!req.body.photo_id && element)
                return false;
            else
                return true;
        })
        .withMessage('No photo specified'),
    /// precedent ///
    body('precedent_id')
        .optional()
        .notEmpty()
        .withMessage("Precedent id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Precedent id must be a number")
        .custom(async (element, {req}) => {
            const currentIndinviduo = await IndividualModel.findOne( {'ID': req.params.id} );
            if(currentIndinviduo){
                const hasPrecedent = await PrecedentModel.findOne({'ID_INDIVIDUO': currentIndinviduo.ID})
                if (!hasPrecedent && element)
                    return Promise.reject();
                else
                    return Promise.resolve();
            }
            else 
                return Promise.resolve();
        })
        .withMessage('The individual has no precedents')
        .custom(async (element, {req}) => {
            const hasPrecedent= await PrecedentModel.findOne({'ID_INDIVIDUO': req.params.id})
            if (hasPrecedent){
                const currentPrecedent = await PrecedentModel.findOne({'ID': element});
                if(currentPrecedent && currentPrecedent.ID_INDIVIDUO == req.params.id)
                    return Promise.resolve()
                else
                    return Promise.reject();
            }
            else
                return Promise.resolve();
        })
        .withMessage('The individual has no precedents with that id'),
    body('reference_num')
        .optional()
        .notEmpty()
        .withMessage("Reference number must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .custom((element, {req}) => {
            if (!req.body.precedent_id && element)
                return false;
            else
                return true;
        })
        .withMessage('No precedent specified'),
    body('detention_reason')
        .optional()
        .notEmpty()
        .withMessage("Detention reason must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .custom((element, {req}) => {
            if (!req.body.precedent_id && element)
                return false;
            else
                return true;
        })
        .withMessage('No precedent specified'),
    body('destination')
        .optional()
        .notEmpty()
        .withMessage("Destination must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .custom((element, {req}) => {
            if (!req.body.precedent_id && element)
                return false;
            else
                return true;
        })
        .withMessage('No precedent specified'),
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
        .withMessage("Date can't be after today")
        .custom((element, {req}) => {
            if (!req.body.precedent_id && element)
                return false;
            else
                return true;
        })
        .withMessage('No precedent specified'),
    body('precedentState')
        .optional()
        .notEmpty()
        .withMessage("Precedent state must be filled")
        .trim()
        .isIn(PrecedentStates)
        .withMessage('Invalid state type')
        .custom((element, {req}) => {
            if (!req.body.precedent_id && element)
                return false;
            else
                return true;
        })
        .withMessage('No precedent specified'),

    body()
        .custom((value, {req}) => {
            return !!(Object.keys(value).length + Object.keys(req.files).length);
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
        .custom((value, {req}) => {
            if(req.body.r_photo || req.body.f_photo|| req.body.l_photo ||
               req.body.r_thumb || req.body.r_index|| req.body.r_middle || req.body.r_ring || req.body.r_little ||
               req.body.l_thumb || req.body.l_index|| req.body.l_middle || req.body.l_ring || req.body.l_little) {
                   return false;
            } else {
                // get  a list of all the parameters from body
                var prepList = Object.keys(value);
                // add the files to the list
                Object.keys(req.files).forEach(file => {
                    prepList.push(file);
                });
                //convert the elements on the list into column names
                var updatesList = getNormalizedColumns(prepList);
                //Set the allowed field for updating and see if the ones sent match
                const allowUpdates = ['NOME_INDIVIDUO', 'ALCUNHA', 'PAI', 'MAE', 'NACIONALIDADE', 'LOCAL_NASCIMENTO', 'DATA_NASCIMENTO', 'IDADE_APARENTE', 
                                      'ESTADO_CIVIL', 'PROFISSAO', 'ID_RESIDENCIA', 'LOCAL_TRABALHO', 'NUM_DOC', 'DATA_EMISSAO_DOC', 'LOCAL_EMISSAO_DOC', 
                                      'ALTURA', 'CABELO', 'BARBA', 'NARIZ', 'BOCA', 'ROSTO', 'COR', 'TATUAGENS', 'CLASSIFICACAO_POLICIAL', 'ESTADO_INDIVIDUO',
                                      // fingerprints
                                      'POLEGAR_DIREITO', 'INDICADOR_DIREITO', 'MEDIO_DIREITO', 'ANELAR_DIREITO', 'MINDINHO_DIREITO', 
                                      'POLEGAR_ESQUERDO', 'INDICADOR_ESQUERDO', 'MEDIO_ESQUERDO', 'ANELAR_ESQUERDO', 'MINDINHO_ESQUERDO',
                                      // photos
                                      'ID_FOTOS', 'FOTO_ESQUERDA', 'FOTO_FRONTAL', 'FOTO_DIREITA', 'ESTADO_FOTOS',
                                      // precedent
                                      'ID_ANTECEDENTE', 'NO_REFERENCIA', 'MOTIVO_DETENCAO', 'DESTINO', 'DATA', 'ESTADO_ANTECEDENTE'];
                return updatesList.every(parameter => allowUpdates.includes(parameter));

            }
        })
        .withMessage('Invalid updates!')
];

exports.getIndividualsFullSchema = [
    body('individual_id')
        .optional()
        .notEmpty()
        .withMessage("Individual id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Individual id must be a number"),
    body('individual_name')
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
    body('workplace')
        .optional()
        .notEmpty()
        .withMessage("Workplace must be filled")
        .trim()
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    /// location ///
    body('residence_id')
        .optional()
        .notEmpty()
        .withMessage("Residence id must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('district_id')
        .optional()
        .notEmpty()
        .withMessage("Residence id must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('parish_id')
        .optional()
        .notEmpty()
        .withMessage("Residence id must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('county_id')
        .optional()
        .notEmpty()
        .withMessage("Residence id must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('island_id')
        .optional()
        .notEmpty()
        .withMessage("Island must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('country_id')
        .optional()
        .notEmpty()
        .withMessage("Country must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    /// physical description ///
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
    body('individualState')
        .optional()
        .notEmpty()
        .withMessage("Individual state must be filled")
        .trim()
        .isIn(IndividualStates)
        .withMessage('Invalid state type'), 
    body('individual_created_at')
        .optional()
        .notEmpty()
        .withMessage("Individual created at must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss'),
    body('individual_created_at_limit')
        .optional()
        .notEmpty()
        .withMessage("Individual created at limit must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss')
        .custom((created_at_lim, { req }) => {
            if(req.body.individual_created_at && created_at_lim <= req.body.individual_created_at)
                return false;
            else
                return true;
        })
        .withMessage('End date must be after start date'),
    body('individual_created_at_range')
        .optional()
        .notEmpty()
        .withMessage("Indicator must be filled")
        .trim()
        .isIn(['yes', 'no'])
        .withMessage('Invalid indicator')
        .custom((value, { req }) => { 
            if(value === 'yes' && !req.body.individual_created_at && !req.body.individual_created_at_limit)
                return false;
            else
                return true;
        })
        .withMessage('No range provided'),
    /// individual register ///
    body('individual_register_id')
        .optional()
        .notEmpty()
        .withMessage("Individual register's id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Individual register's id must be a number"),
    body('individual_register_name')
        .optional()
        .notEmpty()
        .withMessage("Individual register's name must be filled")
        .trim()
        .matches(/^[a-zA-Z-' ]+$/)
        .withMessage("Can only contain: a-z, A-Z, - and '")
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('individual_register_email')
        .notEmpty()
        .withMessage("Individual register's email must be filled")
        .optional()
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail()
        .trim(), 
    body('individual_register_profile')
        .optional()
        .notEmpty()
        .withMessage("Individual register's profile code must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .isLength({ max: 10 })
        .withMessage('Code can contain max 10 characters')
        .matches(/^[a-zA-Z0-9-_ ]+$/)
        .withMessage("Can only contain: letters a-z, A-Z, 0-9, - and _"), 
    body('individual_register_state')
        .optional()
        .notEmpty()
        .withMessage("Individual register's state must be filled")
        .trim()
        .isIn(IndividualStates)
        .withMessage('Invalid state type'), 
    body('individual_register_created_at')
        .optional()
        .notEmpty()
        .withMessage("Individual register's created at must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss'),
    body('individual_register_created_at_limit')
        .optional()
        .notEmpty()
        .withMessage("Individual register's created at limit must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss')
        .custom((created_at_lim, { req }) => {
            if(req.body.individual_register_created_at && created_at_lim <= req.body.individual_register_created_at)
                return false;
            else
                return true;
        })
        .withMessage('End date must be after start date'),
    body('individual_register_created_at_range')
        .optional()
        .notEmpty()
        .withMessage("Indicator must be filled")
        .trim()
        .isIn(['yes', 'no'])
        .withMessage('Invalid indicator')
        .custom((value, { req }) => { 
            if(value === 'yes' && !req.body.individual_register_created_at && !req.body.individual_register_created_at_limit)
                return false;
            else
                return true;
        })
        .withMessage('No range provided'),  
    /// fingerprints ///
    body('fingerprint_id')
        .optional()
        .notEmpty()
        .withMessage("Fingerprint id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Fingerprint id must be a number"),
    body('r_thumb')
        .optional()
        .notEmpty()
        .withMessage("Right thumb must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('r_index')
        .optional()
        .notEmpty()
        .withMessage("Right index finger must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('r_middle')
        .optional()
        .notEmpty()
        .withMessage("Right middle finger must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('r_ring')
        .optional()
        .notEmpty()
        .withMessage("Right ring finger must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('r_little')
        .optional()
        .notEmpty()
        .withMessage("Right little finger must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('l_thumb')
        .optional()
        .notEmpty()
        .withMessage("Left thumb must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('l_index')
        .optional()
        .notEmpty()
        .withMessage("Left index finger must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('l_middle')
        .optional()
        .notEmpty()
        .withMessage("Left middle finger must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('l_ring')
        .optional()
        .notEmpty()
        .withMessage("Left ring finger must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('l_little')
        .optional()
        .notEmpty()
        .withMessage("Left little finger must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('fingerprint_created_at')
        .optional()
        .notEmpty()
        .withMessage("Fingerprint created at must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss'),
    body('fingerprint_created_at_limit')
        .optional()
        .notEmpty()
        .withMessage("Fingerprint created at limit must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss')
        .custom((created_at_lim, { req }) => {
            if(req.body.fingerprint_created_at && created_at_lim <= req.body.fingerprint_created_at)
                return false;
            else
                return true;
        })
        .withMessage('End date must be after start date'),
    body('fingerprint_created_at_range')
        .optional()
        .notEmpty()
        .withMessage("Indicator must be filled")
        .trim()
        .isIn(['yes', 'no'])
        .withMessage('Invalid indicator')
        .custom((value, { req }) => { 
            if(value === 'yes' && !req.body.fingerprint_created_at && !req.body.fingerprint_created_at_limit)
                return false;
            else
                return true;
        })
        .withMessage('No range provided'),
    /// photos ///
    body('photo_id')
        .optional()
        .notEmpty()
        .withMessage("Photo id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Photo id must be a number"),
    body('l_photo')
        .optional()
        .notEmpty()
        .withMessage("Left photo must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('f_photo')
        .optional()
        .notEmpty()
        .withMessage("Frontal photo must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('r_photo')
        .optional()
        .notEmpty()
        .withMessage("Right photo must be filled")
        .trim()
        .isLength({ min: 6 })
        .withMessage('Must be at least 6 chars long'),
    body('photoState')
        .optional()
        .notEmpty()
        .withMessage("Photo state must be filled")
        .trim()
        .isIn(PhotoStates)
        .withMessage('Invalid state type'),
    body('photo_created_at')
        .optional()
        .notEmpty()
        .withMessage("Photo created at must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss'),
    body('photo_created_at_limit')
        .optional()
        .notEmpty()
        .withMessage("Photo created at limit must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss')
        .custom((created_at_lim, { req }) => {
            if(req.body.photo_created_at && created_at_lim <= req.body.photo_created_at)
                return false;
            else
                return true;
        })
        .withMessage('End date must be after start date'),
    body('photo_created_at_range')
        .optional()
        .notEmpty()
        .withMessage("Indicator must be filled")
        .trim()
        .isIn(['yes', 'no'])
        .withMessage('Invalid indicator')
        .custom((value, { req }) => { 
            if(value === 'yes' && !req.body.photo_created_at && !req.body.photo_created_at_limit)
                return false;
            else
                return true;
        })
        .withMessage('No range provided'),
    /// precedent ///
     body('precedent_id')
        .optional()
        .notEmpty()
        .withMessage("Precedent id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Precedent id must be a number"),     
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
    body('precedentState')
        .optional()
        .notEmpty()
        .withMessage("State must be filled")
        .trim()
        .isIn(PrecedentStates)
        .withMessage('Invalid state type'),
    body('precedent_created_at')
        .optional()
        .notEmpty()
        .withMessage("Precedent created at must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss'),
    body('precedent_created_at_limit')
        .optional()
        .notEmpty()
        .withMessage("Precedent created at limit must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss')
        .custom((created_at_lim, { req }) => {
            if(req.body.precedent_created_at && created_at_lim <= req.body.precedent_created_at)
                return false;
            else
                return true;
        })
        .withMessage('End date must be after start date'),
    body('precedent_created_at_range')
        .optional()
        .notEmpty()
        .withMessage("Indicator must be filled")
        .trim()
        .isIn(['yes', 'no'])
        .withMessage('Invalid indicator')
        .custom((value, { req }) => { 
            if(value === 'yes' && !req.body.precedent_created_at && !req.body.precedent_created_at_limit)
                return false;
            else
                return true;
        })
        .withMessage('No range provided'),
    /// precedent register ///
    body('precedent_register_id')
        .optional()
        .notEmpty()
        .withMessage("Precedent register's id must be filled")
        .trim()
        .isNumeric()
        .withMessage("Precedent register's id must be a number"),
    body('precedent_register_name')
        .optional()
        .notEmpty()
        .withMessage("Precedent register's name must be filled")
        .trim()
        .matches(/^[a-zA-Z-' ]+$/)
        .withMessage("Can only contain: a-z, A-Z, - and '")
        .isLength({ min: 2 })
        .withMessage('Must be at least 2 chars long'),
    body('precedent_register_email')
        .notEmpty()
        .withMessage("Precedent register's email must be filled")
        .optional()
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail()
        .trim(), 
    body('precedent_register_profile')
        .optional()
        .notEmpty()
        .withMessage("Precedent register's profile code must be filled")
        .trim()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long')
        .isLength({ max: 10 })
        .withMessage('Code can contain max 10 characters')
        .matches(/^[a-zA-Z0-9-_ ]+$/)
        .withMessage("Can only contain: letters a-z, A-Z, 0-9, - and _"), 
    body('precedent_register_state')
        .optional()
        .notEmpty()
        .withMessage("Precedent register's state must be filled")
        .trim()
        .isIn(IndividualStates)
        .withMessage('Invalid state type'), 
    body('precedent_register_created_at')
        .optional()
        .notEmpty()
        .withMessage("Precedent register's created at must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss'),
    body('precedent_register_created_at_limit')
        .optional()
        .notEmpty()
        .withMessage("Precedent register's created at limit must be filled")
        .trim()
        .isISO8601({ strict: true })
        .withMessage('Invalid date, insert a valid date in the format: YYYY-MM-DD hh:mm:ss')
        .custom((created_at_lim, { req }) => {
            if(req.body.precedent_register_created_at && created_at_lim <= req.body.precedent_register_created_at)
                return false;
            else
                return true;
        })
        .withMessage('End date must be after start date'),
    body('precedent_register_created_at_range')
        .optional()
        .notEmpty()
        .withMessage("Indicator must be filled")
        .trim()
        .isIn(['yes', 'no'])
        .withMessage('Invalid indicator')
        .custom((value, { req }) => { 
            if(value === 'yes' && !req.body.precedent_register_created_at && !req.body.precedent_register_created_at_limit)
                return false;
            else
                return true;
        })
        .withMessage('No range provided'),
    body('sorter')
        .exists()
        .withMessage('Sorter is required')
        .notEmpty()
        .withMessage("Sorter must be filled")
        .trim()
        .isIn(['ID_INDIVIDUO', 'ID_CADASTRANTE_INDIVIDUO', 'ID_CADASTRANTE_ANTECEDENTEO'])
        .withMessage('Invalid sorter'),


    body()
        .custom(value => {
            // convert object keys into colum names
            var searchList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for searching and see if the ones sent match
            const allowSearch = ['ID_INDIVIDUO', 'NOME_INDIVIDUO', 'ALCUNHA', 'PAI', 'MAE', 'NACIONALIDADE', 'LOCAL_NASCIMENTO', 
                                 'DATA_NASCIMENTO', 'IDADE_APARENTE', 'ESTADO_CIVIL', 'PROFISSAO', 'LOCAL_TRABALHO', 'NUM_DOC', 'DATA_EMISSAO_DOC', 
                                 'LOCAL_EMISSAO_DOC', 'ALTURA', 'CABELO', 'BARBA', 'NARIZ', 'BOCA', 'ROSTO', 'COR', 'TATUAGENS', 'CLASSIFICACAO_POLICIAL', 
                                 'ESTADO_INDIVIDUO', 'DATA_REGISTO_INDIVIDUO', 'birthdate_limit', 'birthdate_range', 'apparent_age_limit', 'apparent_age_range', 
                                 'doc_issuance_date_limit', 'doc_issuance_date_range', 'height_limit', 'height_range', 'individual_created_at_limit', 
                                 'individual_created_at_range',
                                 // residencia
                                 'ID_RESIDENCIA', 'ID_ZONA', 'ID_FREGUESIA', 'ID_CONCELHO', 'ID_ILHA', 'ID_PAIS',
                                 // fingerprint
                                 'ID_DIGITAIS', 'POLEGAR_DIREITO', 'INDICADOR_DIREITO', 'MEDIO_DIREITO', 'ANELAR_DIREITO', 'MINDINHO_DIREITO', 
                                 'POLEGAR_ESQUERDO', 'INDICADOR_ESQUERDO', 'MEDIO_ESQUERDO', 'ANELAR_ESQUERDO', 'MINDINHO_ESQUERDO', 'DATA_REGISTO_DIGITAIS', 
                                 'fingerprint_created_at_limit', 'fingerprint_created_at_range',
                                 // photo
                                 'ID_FOTOS', 'FOTO_ESQUERDA', 'FOTO_FRONTAL', 'FOTO_DIREITA', 'ESTADO_FOTOS', 'DATA_REGISTO_FOTOS', 
                                 'photo_created_at_limit', 'photo_created_at_range',
                                 // individual register
                                 'ID_CADASTRANTE_INDIVIDUO', `NOME_CADASTRANTE_INDIVIDUO`, 'EMAIL_CADASTRANTE_INDIVIDUO', 'PERFIL_CADASTRANTE_INDIVIDUO', 
                                 'ESTADO_CADASTRANTE_INDIVIDUO', 'DATA_REGISTO_CADASTRANTE_INDIVIDUO', 'individual_register_created_at_limit', 
                                 'individual_register_created_at_range',
                                 // precedent
                                 'ID_ANTECEDENTE', 'NO_REFERENCIA', 'MOTIVO_DETENCAO', 'DESTINO', 'DATA', 'ESTADO_ANTECEDENTE', 'DATA_REGISTO_ANTECEDENTE',
                                 'date_limit', 'date_range', 'precedent_created_at_limit', 'precedent_created_at_range',
                                // precedent register
                                'ID_CADASTRANTE_ANTECEDENTE', `NOME_CADASTRANTE_ANTECEDENTE`, 'EMAIL_CADASTRANTE_ANTECEDENTE', 'PERFIL_CADASTRANTE_ANTECEDENTE',
                                'ESTADO_CADASTRANTE_ANTECEDENTE', 'DATA_REGISTO_CADASTRANTE_ANTECEDENTE', 'precedent_register_created_at_limit', 'precedent_register_created_at_range', 'sorter'];
            
            searchList.forEach(item => {
                if(!allowSearch.includes(item))
                    console.log(item);
            });
            return searchList.every(parameter => allowSearch.includes(parameter));
        })
        .withMessage('Invalid extra fields!')
];

exports.deleteIndividualFullSchema = [
    body()
        .custom(async (value, {req}) => {
            const findIndividual = await IndividualModel.findOne( {'ID': req.params.id} );
            if(findIndividual)
                return Promise.resolve();
            else
                return Promise.reject();
        })
        .withMessage('Individual not found!')
];

checkDuplicateFingerprint = (req, fingerprint) => {
    let found = 0;
    if (fingerprint){
        if(req.files["r_thumbFile"] && req.files["r_thumbFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["r_indexFile"] && req.files["r_indexFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["r_middleFile"] && req.files["r_middleFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["r_ringFile"] && req.files["r_ringFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["r_littleFile"] && req.files["r_littleFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["l_thumbFile"] && req.files["l_thumbFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["l_indexFile"] && req.files["l_indexFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["l_middleFile"] && req.files["l_middleFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["l_ringFile"] && req.files["l_ringFile"][0].originalname == fingerprint)
            found += 1;
        if(req.body["l_littleFile"] && req.files["l_littleFile"][0].originalname == fingerprint)
            found += 1;
    }
    return found;
}