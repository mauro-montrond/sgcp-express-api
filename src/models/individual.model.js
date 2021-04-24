const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
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

    create = async ({ name, nickname, father, mother, nationality, birthplace, birthdate, apparent_age, marital_status, profession, 
                      residence_id, workplace, doc_num, doc_issuance_date, doc_issuance_place, height, hair, beard, nose, mouth, face, colour, tattoos, 
                      police_classification, state = 'A'}, user_id) => {
        const sql = `INSERT INTO ${this.tableName}
        (ID_UTILIZADOR, NOME, ALCUNHA, PAI, MAE, NACIONALIDADE, LOCAL_NASCIMENTO, DATA_NASCIMENTO, IDADE_APARENTE, ESTADO_CIVIL, PROFISSAO, ID_RESIDENCIA, 
         LOCAL_TRABALHO, NUM_DOC, DATA_EMISSAO_DOC, LOCAL_EMISSAO_DOC, ALTURA, CABELO, BARBA, NARIZ, BOCA, ROSTO, COR, TATUAGENS, 
         CLASSIFICACAO_POLICIAL, ESTADO) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const result = await query(sql, [user_id, name, nickname, father, mother, nationality, birthplace, birthdate, apparent_age, marital_status, 
                                         profession, residence_id, workplace, doc_num, doc_issuance_date, doc_issuance_place, height, hair, beard, nose, 
                                         mouth, face, colour, tattoos, police_classification, state]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, id) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE ID = ?`;

        const result = await query(sql, [...values, id]);

        return result;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE ID = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new IndividualModel;