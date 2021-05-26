const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
const logModel = require('./log.model');
const Role = require('../utils/userRoles.utils');
class UserModel {
    tableName = 'utilizador';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (user)
        return result[0];
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
    
    getVal = async (id) => {
        let nv = await this.findOne({'ID': id});
        const { ID, ...newVal } = nv;
        return newVal;
    }

    create = async ({ username, profile_id, name, email, password, state = 'A' }, u_id) => {
        const sql = `INSERT INTO ${this.tableName}
        (UTILIZADOR, ID_PERFIL, NOME, EMAIL, SENHA, ESTADO) VALUES (?,?,?,?,?,?)`;

        const result = await query(sql, [username, profile_id, name, email, password, state]);
        let affectedRows = result ? result.affectedRows : 0;
        if(result){
            const newVal = await this.getVal(result.insertId);
            const resultLog = await logModel.logChange(u_id, result.insertId, null, newVal, 'Criar');
            affectedRows = resultLog ? affectedRows + resultLog : 0;
        }

        return affectedRows;
    }

    update = async (params, username, u_id) => {
        let currentUser= await this.findOne( {'UTILIZADOR': username} );
        const { ID, ...prevVal} = currentUser;
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE UTILIZADOR = ?`;

        const result = await query(sql, [...values, username]);
        
        if(result && result.changedRows){
            const newVal = await this.getVal(currentUser.ID);
            const resultLog = await logModel.logChange(u_id, currentUser.ID, prevVal, newVal, 'Editar');
        }

        return result;
    }

    delete = async (id, u_id) => {
        let currentUser = await this.findOne( {'ID': id} );
        const { ID, ...prevVal} = currentUser;
        const sql = `DELETE FROM ${this.tableName}
        WHERE ID = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;
        if(affectedRows){
            const resultLog = await logModel.logChange(u_id, currentUser.ID, prevVal, null, 'Eliminar');
        }

        return affectedRows;
    }
}

module.exports = new UserModel;