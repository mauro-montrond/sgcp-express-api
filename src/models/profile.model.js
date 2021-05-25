const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
const logModel = require('./log.model');
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

    getVal = async (id) => {
        let nv = await this.findOne({'ID': id});
        const { ID, ...newVal } = nv;
        return newVal;
    }

    create = async ({ code, description, state = 'A' }, u_id) => {
        const sql = `INSERT INTO ${this.tableName}
        (CODIGO, DESCRICAO, ESTADO) VALUES (?,?,?)`;

        const result = await query(sql, [code, description, state]);
        let affectedRows = result ? result.affectedRows : 0;
        if(result){
            const newVal = await this.getVal(result.insertId);
            const resultLog = await logModel.logChange(u_id, result.insertId, null, newVal, 'Criar');
            affectedRows = resultLog ? affectedRows + resultLog : 0;
        }

        return affectedRows;
    }

    update = async (params, code, u_id) => {
        let currentProfile = await this.findOne( {'CODIGO': code} );
        const { ID, ...prevVal} = currentProfile;
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE CODIGO = ?`;

        const result = await query(sql, [...values, code]);
        
        if(result && result.changedRows){
            const newVal = await this.getVal(currentProfile.ID);
            const resultLog = await logModel.logChange(u_id, currentProfile.ID, prevVal, newVal, 'Editar');
        }

        return result;
    }

    delete = async (code, u_id) => {
        let currentProfile = await this.findOne( {'CODIGO': code} );
        const { ID, ...prevVal} = currentProfile;
        const sql = `DELETE FROM ${this.tableName}
        WHERE CODIGO = ?`;
        const result = await query(sql, [code]);
        const affectedRows = result ? result.affectedRows : 0;
        if(affectedRows){
            const resultLog = await logModel.logChange(u_id, currentProfile.ID, prevVal, null, 'Eliminar');
        }

        return affectedRows;
    }
}

module.exports = new ProfileModel;