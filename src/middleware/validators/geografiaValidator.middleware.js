const { body } = require('express-validator');
const { getNormalizedColumns } = require('../../utils/geografiaColumnNormalizer.utils.js');

exports.getGeografiasSchema = [
    body('id')
        .optional()
        .notEmpty()
        .withMessage("Id must be filled")
        .trim(),
    body('name')
        .optional()
        .notEmpty()
        .withMessage("Name must be filled")
        .trim(),
    body('name_norm')
        .optional()
        .notEmpty()
        .withMessage("Normalized name must be filled")
        .trim(),
    body('country')
        .optional()
        .notEmpty()
        .withMessage("Country must be filled")
        .trim(),      
    body('island')
        .optional()
        .notEmpty()
        .withMessage("Island must be filled")
        .trim(),
    body('county')
        .optional()
        .notEmpty()
        .withMessage("County must be filled")
        .trim(),
    body('parish')
        .optional()
        .notEmpty()
        .withMessage("Parish must be filled")
        .trim(),
    body('district')
        .optional()
        .notEmpty()
        .withMessage("District must be filled")
        .trim(),
    body('detail_level')
        .optional()
        .notEmpty()
        .withMessage("Level of detail must be filled")
        .trim()
        .isNumeric()
        .withMessage("Level of detail must be a number"),
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
            // convert updates keys into colum names
            var updatesList = getNormalizedColumns(Object.keys(value));
            //Set the allowed field for creation and see if the ones sent match
            const allowUpdates = ['ID', 'NOME', 'PAIS', 'ILHA', 'CONCELHO', 'FREGUESIA', 'ZONA', 'NOME_NORM', 'NIVEL_DETALHE', 'DATA_REGISTO', 
                                  'created_at_limit', 'created_at_range'];
            return updatesList.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid extra fields!')
];