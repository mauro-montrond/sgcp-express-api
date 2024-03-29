const IndividualFullModel = require('../models/individualFull.model');
const HttpException = require('../utils/HttpException.utils');
const { getNormalizedColumnsValues } = require('../utils/individualFullColumnNormalizer.utils');
const { validationResult } = require('express-validator');
const dotenv = require('dotenv');
dotenv.config();
// new
// const fs = require('fs');
const path = require('path');
// end new

/******************************************************************************
 *                              Individual Full Controller
 ******************************************************************************/
class IndividualFullController {
    getAllIndividualFull = async (req, res, next) => {
        let individualList = await IndividualFullModel.find();
        if (!individualList.length) {
            throw new HttpException(404, 'Individuals not found');
        }

        res.send(individualList);
    };

    getIndividualFullById = async (req, res, next) => {
        const individual = await IndividualFullModel.findOne({ ID_INDIVIDUO: req.params.id });
        if (!individual) {
            throw new HttpException(404, 'Individual not found');
        }
        res.send(individual);
    };

    getIndividualsFullByParams = async (req, res, next) => {
        this.checkValidation(req);
        // convert the re.body keys into the actual names of the table's colums
        let individualList = getNormalizedColumnsValues(req.body);
        let sorter = individualList['sorter'];
        delete individualList['sorter'];
        const individuals = await IndividualFullModel.findMany(individualList, sorter);
        //const individuals = await IndividualFullModel.findMany(individualList, 'ID_INDIVIDUO');
        //const individuals = await IndividualFullModel.findMany(individualList, 'ID_CADASTRANTE_INDIVIDUO');
        //const individuals = await IndividualFullModel.findMany(individualList, 'ID_CADASTRANTE_ANTECEDENTE');
        if (!individuals.length) {
            throw new HttpException(404, 'Individuals not found');
        }
        
        res.send(individuals);
    };

    createIndividualFull = async (req, res, next) => {
        this.checkValidation(req);
        
        if(!req.currentUser){
            throw new HttpException(401, 'Unauthorized');
        }
        const { SENHA, ...userWithoutPassword } = req.currentUser;
        const result = await IndividualFullModel.createFull(req.body, req.files, userWithoutPassword.ID);

        if (!result) {
            throw new HttpException(500, 'Something went wrong');
        }

        res.status(201).send('Individual was created!');
    };

    updateIndividualFull = async (req, res, next) => {
        this.checkValidation(req);
        
        if(!req.currentUser){
            throw new HttpException(401, 'Unauthorized');
        }
        const { SENHA, ...userWithoutPassword } = req.currentUser;
        // do the update query and get the result
        // it can be partial edit
        // get the individual whose data we are going to update
        const individual = await IndividualFullModel.findOne({ ID_INDIVIDUO: req.params.id });
        // convert the re.body keys into the actual names of the tables columns, grouping each columns of each table
        let individualUpdates = {};
        if( Object.keys(req.body).includes('individual_name') )
            individualUpdates["NOME"] = Object.values(req.body)[Object.keys(req.body).indexOf("individual_name")];
        if( Object.keys(req.body).includes('nickname') )
            individualUpdates["ALCUNHA"] = Object.values(req.body)[Object.keys(req.body).indexOf("nickname")];
        if( Object.keys(req.body).includes('father') )
            individualUpdates["PAI"] = Object.values(req.body)[Object.keys(req.body).indexOf("father")];
        if( Object.keys(req.body).includes('mother') )
            individualUpdates["MAE"] = Object.values(req.body)[Object.keys(req.body).indexOf("mother")];
        if( Object.keys(req.body).includes('nationality') )
            individualUpdates["NACIONALIDADE"] = Object.values(req.body)[Object.keys(req.body).indexOf("nationality")];
        if( Object.keys(req.body).includes('birthplace') )
            individualUpdates["LOCAL_NASCIMENTO"] = Object.values(req.body)[Object.keys(req.body).indexOf("birthplace")];
        if( Object.keys(req.body).includes('birthdate') )
            individualUpdates["DATA_NASCIMENTO"] = Object.values(req.body)[Object.keys(req.body).indexOf("birthdate")];
        if( Object.keys(req.body).includes('apparent_age') )
            individualUpdates["IDADE_APARENTE"] = Object.values(req.body)[Object.keys(req.body).indexOf("apparent_age")];
        if( Object.keys(req.body).includes('marital_status') )
            individualUpdates["ESTADO_CIVIL"] = Object.values(req.body)[Object.keys(req.body).indexOf("marital_status")];
        if( Object.keys(req.body).includes('profession') )
            individualUpdates["PROFISSAO"] = Object.values(req.body)[Object.keys(req.body).indexOf("profession")];
        if( Object.keys(req.body).includes('residence_id') )
            individualUpdates["ID_RESIDENCIA"] = Object.values(req.body)[Object.keys(req.body).indexOf("residence_id")];
        if( Object.keys(req.body).includes('workplace') )
            individualUpdates["LOCAL_TRABALHO"] = Object.values(req.body)[Object.keys(req.body).indexOf("workplace")];
        if( Object.keys(req.body).includes('doc_num') )
            individualUpdates["NUM_DOC"] = Object.values(req.body)[Object.keys(req.body).indexOf("doc_num")];
        if( Object.keys(req.body).includes('doc_issuance_date') )
            individualUpdates["DATA_EMISSAO_DOC"] = Object.values(req.body)[Object.keys(req.body).indexOf("doc_issuance_date")];
        if( Object.keys(req.body).includes('doc_issuance_place') )
            individualUpdates["LOCAL_EMISSAO_DOC"] = Object.values(req.body)[Object.keys(req.body).indexOf("doc_issuance_place")];
        if( Object.keys(req.body).includes('height') )
            individualUpdates["ALTURA"] = Object.values(req.body)[Object.keys(req.body).indexOf("height")];
        if( Object.keys(req.body).includes('hair') )
            individualUpdates["CABELO"] = Object.values(req.body)[Object.keys(req.body).indexOf("hair")];
        if( Object.keys(req.body).includes('beard') )
            individualUpdates["BARBA"] = Object.values(req.body)[Object.keys(req.body).indexOf("beard")];
        if( Object.keys(req.body).includes('nose') )
            individualUpdates["NARIZ"] = Object.values(req.body)[Object.keys(req.body).indexOf("nose")];
        if( Object.keys(req.body).includes('mouth') )
            individualUpdates["BOCA"] = Object.values(req.body)[Object.keys(req.body).indexOf("mouth")];
        if( Object.keys(req.body).includes('face') )
            individualUpdates["ROSTO"] = Object.values(req.body)[Object.keys(req.body).indexOf("face")];
        if( Object.keys(req.body).includes('colour') )
            individualUpdates["COR"] = Object.values(req.body)[Object.keys(req.body).indexOf("colour")];
        if( Object.keys(req.body).includes('tattoos') )
            individualUpdates["TATUAGENS"] = Object.values(req.body)[Object.keys(req.body).indexOf("tattoos")];
        if( Object.keys(req.body).includes('police_classification') )
            individualUpdates["CLASSIFICACAO_POLICIAL"] = Object.values(req.body)[Object.keys(req.body).indexOf("police_classification")];
        if( Object.keys(req.body).includes('individualState') )
            individualUpdates["ESTADO"] = Object.values(req.body)[Object.keys(req.body).indexOf("individualState")];
        
        if(req.files){
            var filesList = [];
            var fileKeys = Object.keys(req.files);
            fileKeys.forEach(key => {
                filesList.push(key);
            });
            filesList.forEach( file => {
                let fileName = req.files[file][0].fieldname + '_' + Date.now() + path.extname(req.files[file][0].originalname);
                let fieldname = req.files[file][0].fieldname.substring(0, req.files[file][0].fieldname.indexOf("File"));
                // dynamically add each fileName to body
                eval("req.body." + fieldname + " = '" + fileName +"';");
            });
        }

        let fingerprintUpdates = {};
 
        if( Object.keys(req.body).includes('r_thumb') )
            fingerprintUpdates["POLEGAR_DIREITO"] = Object.values(req.body)[Object.keys(req.body).indexOf("r_thumb")];
        if( Object.keys(req.body).includes('r_index') )
            fingerprintUpdates["INDICADOR_DIREITO"] = Object.values(req.body)[Object.keys(req.body).indexOf("r_index")];
        if( Object.keys(req.body).includes('r_middle') )
            fingerprintUpdates["MEDIO_DIREITO"] = Object.values(req.body)[Object.keys(req.body).indexOf("r_middle")];
        if( Object.keys(req.body).includes('r_ring') )
            fingerprintUpdates["ANELAR_DIREITO"] = Object.values(req.body)[Object.keys(req.body).indexOf("r_ring")];
        if( Object.keys(req.body).includes('r_little') )
            fingerprintUpdates["MINDINHO_DIREITO"] = Object.values(req.body)[Object.keys(req.body).indexOf("r_little")];
        if( Object.keys(req.body).includes('l_thumb') )
            fingerprintUpdates["POLEGAR_ESQUERDO"] = Object.values(req.body)[Object.keys(req.body).indexOf("l_thumb")];
        if( Object.keys(req.body).includes('l_index') )
            fingerprintUpdates["INDICADOR_ESQUERDO"] = Object.values(req.body)[Object.keys(req.body).indexOf("l_index")];
        if( Object.keys(req.body).includes('l_middle') )
            fingerprintUpdates["MEDIO_ESQUERDO"] = Object.values(req.body)[Object.keys(req.body).indexOf("l_middle")];
        if( Object.keys(req.body).includes('l_ring') )
            fingerprintUpdates["ANELAR_ESQUERDO"] = Object.values(req.body)[Object.keys(req.body).indexOf("l_ring")];
        if( Object.keys(req.body).includes('l_little') )
            fingerprintUpdates["MINDINHO_ESQUERDO"] = Object.values(req.body)[Object.keys(req.body).indexOf("l_little")];

        let photoUpdates = {};

        if( Object.keys(req.body).includes('photo_id') )
            photoUpdates["ID"] = Object.values(req.body)[Object.keys(req.body).indexOf("photo_id")];
        if( Object.keys(req.body).includes('l_photo') )
            photoUpdates["FOTO_ESQUERDA"] = Object.values(req.body)[Object.keys(req.body).indexOf("l_photo")];
        if( Object.keys(req.body).includes('f_photo') )
            photoUpdates["FOTO_FRONTAL"] = Object.values(req.body)[Object.keys(req.body).indexOf("f_photo")];
        if( Object.keys(req.body).includes('r_photo') )
            photoUpdates["FOTO_DIREITA"] = Object.values(req.body)[Object.keys(req.body).indexOf("r_photo")];
        if( Object.keys(req.body).includes('photoState') )
            photoUpdates["ESTADO"] = Object.values(req.body)[Object.keys(req.body).indexOf("photoState")]; 

        let precedentUpdates = {};
        
        if( Object.keys(req.body).includes('precedent_id') )
            precedentUpdates["ID"] = Object.values(req.body)[Object.keys(req.body).indexOf("precedent_id")];
        if( Object.keys(req.body).includes('reference_num') )
            precedentUpdates["NO_REFERENCIA"] = Object.values(req.body)[Object.keys(req.body).indexOf("reference_num")];
        if( Object.keys(req.body).includes('detention_reason') )
            precedentUpdates["MOTIVO_DETENCAO"] = Object.values(req.body)[Object.keys(req.body).indexOf("detention_reason")];
        if( Object.keys(req.body).includes('destination') )
            precedentUpdates["DESTINO"] = Object.values(req.body)[Object.keys(req.body).indexOf("destination")];
        if( Object.keys(req.body).includes('precedentState') )
            precedentUpdates["ESTADO"] = Object.values(req.body)[Object.keys(req.body).indexOf("precedentState")]; 

        const result = await IndividualFullModel.updateFull(individualUpdates, fingerprintUpdates, photoUpdates, precedentUpdates, 
                                                            req.files, req.params.id, userWithoutPassword.ID);

        if (!result) {
            throw new HttpException(404, 'Something went wrong');
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows ? 'Individual not found' :
            affectedRows && changedRows ? 'Individual updated successfully' : 'Updated field';

        res.send({ message, info });
    };

    deleteIndividualFull = async (req, res, next) => {
        this.checkValidation(req);
        
        if(!req.currentUser){
            throw new HttpException(401, 'Unauthorized');
        }
        const { SENHA, ...userWithoutPassword } = req.currentUser;
        const result = await IndividualFullModel.deleteFull(req.params.id, userWithoutPassword.ID);
        if (!result) {
            throw new HttpException(404, 'Individual not found');
        } 
        res.send('Individual has been deleted');
    };

    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, 'Validation failed', errors);
        }
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new IndividualFullController;