const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
class ProfileModel {
    tableName = 'perfil';

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

        // return back the first row (profile)
        return result[0];
    }

    create = async ({ code, description, state = 'A' }) => {
        const sql = `INSERT INTO ${this.tableName}
        (CODIGO, DESCRICAO, ESTADO) VALUES (?,?,?)`;

        const result = await query(sql, [code, description, state]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, code) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE CODIGO = ?`;

        const result = await query(sql, [...values, code]);

        return result;
    }

    delete = async (code) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE CODIGO = ?`;
        const result = await query(sql, [code]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new ProfileModel;