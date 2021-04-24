const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
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

    create = async ({ individual_id, r_thumb, r_index, r_middle, r_ring, r_little, l_thumb, l_index, l_middle, l_ring, l_little }) => {
        const sql = `INSERT INTO ${this.tableName}
        (ID_INDIVIDUO, POLEGAR_DIREITO, INDICADOR_DIREITO, MEDIO_DIREITO, ANELAR_DIREITO, MINDINHO_DIREITO, 
         POLEGAR_ESQUERDO, INDICADOR_ESQUERDO, MEDIO_ESQUERDO, ANELAR_ESQUERDO, MINDINHO_ESQUERDO) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

        const result = await query(sql, [individual_id, r_thumb, r_index, r_middle, r_ring, r_little, l_thumb, l_index, l_middle, l_ring, l_little]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, individual_id) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE ID_INDIVIDUO = ?`;

        const result = await query(sql, [...values, individual_id]);

        return result;
    }

    delete = async (individual_id) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE ID_INDIVIDUO = ?`;
        const result = await query(sql, [individual_id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new FingerprintModel;