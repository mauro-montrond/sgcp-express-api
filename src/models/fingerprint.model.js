const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
const logModel = require('./log.model');
class FingerprintModel {
    tableName = 'digitais';

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

        // return back the first row (fingerprint)
        return result[0];
    }

    findFingerprint = async (fingerprint) => {
        const sql = `SELECT * FROM ${this.tableName}
        WHERE POLEGAR_DIREITO = ? OR INDICADOR_DIREITO = ? OR MEDIO_DIREITO = ? OR ANELAR_DIREITO = ? OR MINDINHO_DIREITO = ? OR 
        POLEGAR_ESQUERDO = ? OR INDICADOR_ESQUERDO = ? OR MEDIO_ESQUERDO = ? OR ANELAR_ESQUERDO = ? OR MINDINHO_ESQUERDO = ?`;

        const result = await query(sql, [fingerprint, fingerprint, fingerprint, fingerprint, fingerprint, 
                                         fingerprint, fingerprint, fingerprint, fingerprint, fingerprint]);
        // return back the first row (fingerprint)
        return result[0];
    }

    getVal = async (id) => {
        let nv = await this.findOne({'ID': id});
        const { ID, ...newVal } = nv;
        return newVal;
    }

    create = async ({ individual_id, r_thumb, r_index, r_middle, r_ring, r_little, l_thumb, l_index, l_middle, l_ring, l_little }, u_id) => {
        const sql = `INSERT INTO ${this.tableName}
        (ID_INDIVIDUO, POLEGAR_DIREITO, INDICADOR_DIREITO, MEDIO_DIREITO, ANELAR_DIREITO, MINDINHO_DIREITO, 
         POLEGAR_ESQUERDO, INDICADOR_ESQUERDO, MEDIO_ESQUERDO, ANELAR_ESQUERDO, MINDINHO_ESQUERDO) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

        const result = await query(sql, [individual_id, r_thumb, r_index, r_middle, r_ring, r_little, l_thumb, l_index, l_middle, l_ring, l_little]);
        let affectedRows = result ? result.affectedRows : 0;
        if(result){
            const newVal = await this.getVal(result.insertId);
            const resultLog = await logModel.logChange(u_id, this.tableName, result.insertId, null, newVal, 'Criar');
            affectedRows = resultLog ? affectedRows + resultLog : 0;
        }

        return affectedRows;
    }

    update = async (params, individual_id, u_id) => {
        let currentFingerprint = await this.findOne( {'ID_INDIVIDUO': individual_id} );
        const { ID, ...prevVal} = currentFingerprint;
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE ID_INDIVIDUO = ?`;

        const result = await query(sql, [...values, individual_id]);
        
        if(result && result.changedRows){
            const newVal = await this.getVal(currentFingerprint.ID);
            const resultLog = await logModel.logChange(u_id, this.tableName, currentFingerprint.ID, prevVal, newVal, 'Editar');
        }

        return result;
    }

    delete = async (individual_id, u_id) => {
        let currentFingerprint = await this.findOne( {'ID_INDIVIDUO': individual_id} );
        const { ID, ...prevVal} = currentFingerprint;
        const sql = `DELETE FROM ${this.tableName}
        WHERE ID_INDIVIDUO = ?`;
        const result = await query(sql, [individual_id]);
        const affectedRows = result ? result.affectedRows : 0;
        if(affectedRows){
            const resultLog = await logModel.logChange(u_id, this.tableName, currentFingerprint.ID, prevVal, null, 'Eliminar');
        }

        return affectedRows;
    }
}

module.exports = new FingerprintModel;