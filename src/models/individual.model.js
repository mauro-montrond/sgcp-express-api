const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
const logModel = require('./log.model');
class IndividualModel {
    tableName = 'individuo';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findMany = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnGets, values } = multipleColumnGets(params)
        sql += ` WHERE ${columnGets}`;

        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (individual)
        return result[0];
    }

    getVal = async (id) => {
        let nv = await this.findOne({'ID': id});
        const { ID, ...newVal } = nv;
        return newVal;
    }

    create = async ({ name, nickname, father, mother, nationality, birthplace, birthdate, apparent_age = null, marital_status, profession = null, 
                      residence_id, workplace = null, doc_num, doc_issuance_date, doc_issuance_place, height, 
                      hair = null, beard = null, nose = null, mouth = null, face = null, colour = null, tattoos = null, 
                      police_classification, state = 'A'}, user_id, full) => {
        const sql = `INSERT INTO ${this.tableName}
        (ID_UTILIZADOR, NOME, ALCUNHA, PAI, MAE, NACIONALIDADE, LOCAL_NASCIMENTO, DATA_NASCIMENTO, IDADE_APARENTE, ESTADO_CIVIL, PROFISSAO, ID_RESIDENCIA, 
         LOCAL_TRABALHO, NUM_DOC, DATA_EMISSAO_DOC, LOCAL_EMISSAO_DOC, ALTURA, CABELO, BARBA, NARIZ, BOCA, ROSTO, COR, TATUAGENS, 
         CLASSIFICACAO_POLICIAL, ESTADO) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        let result = await query(sql, [user_id, name, nickname, father, mother, nationality, birthplace, birthdate, apparent_age, marital_status, 
                                         profession, residence_id, workplace, doc_num, doc_issuance_date, doc_issuance_place, height, hair, beard, nose, 
                                         mouth, face, colour, tattoos, police_classification, state]);                                 
        let affectedRows = result ? result.affectedRows : 0;
        
        if(result){
            const newVal = await this.getVal(result.insertId);
            const resultLog = await logModel.logChange(user_id, this.tableName, result.insertId, null, newVal, 'Criar');
            affectedRows = resultLog ? affectedRows + resultLog : 0;
            result.affectedRows = resultLog ? result.affectedRows + resultLog : 0;
        }
        if(!full)
            return affectedRows;
        else
            return result;
    }

    update = async (params, id, u_id) => {
        let currentIndividual = await this.findOne( {'ID': id} );
        const { ID, ...prevVal} = currentIndividual;
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE ID = ?`;

        const result = await query(sql, [...values, id]);
        
        if(result && result.changedRows){
            const newVal = await this.getVal(currentIndividual.ID);
            const resultLog = await logModel.logChange(u_id, this.tableName, currentIndividual.ID, prevVal, newVal, 'Editar');
        }

        return result;
    }

    delete = async (id, u_id, full) => {
        let currentIndividual = await this.findOne( {'ID': id} );
        const sql = `DELETE FROM ${this.tableName}
        WHERE ID = ?`;
        let result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;
        if(affectedRows){
            const { ID, ...prevVal} = currentIndividual;
            const resultLog = await logModel.logChange(u_id, this.tableName, currentIndividual.ID, prevVal, null, 'Eliminar');
            result.affectedRows = resultLog ? result.affectedRows + resultLog : 0;
        }
        if(!full)
            return affectedRows;
        else
            return result;
    }
}

module.exports = new IndividualModel;