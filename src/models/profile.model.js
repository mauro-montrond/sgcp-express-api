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

    logPrep = (u_id, id, prevVal, newVal, act) => {
        const newLog = {
            user_id: u_id, 
            table: this.tableName, 
            object_id: id, 
            previous_value: prevVal, 
            new_value: newVal, 
            action: act
        };
        return newLog;
    }

    profileLog = async (u_id, id, prevVal, act) => {
        let newLog = null;
        if(act != 'Eliminar'){
            let nv = await this.findOne({'ID': id});
            const { ID, ...newVal } = nv;
            newLog = this.logPrep(u_id, id, prevVal, newVal, act);
        }
        else{
            newLog = this.logPrep(u_id, id, prevVal, null, act);
        }
        return await logModel.create(newLog);
    }

    create = async ({ code, description, state = 'A' }, u_id) => {
        const sql = `INSERT INTO ${this.tableName}
        (CODIGO, DESCRICAO, ESTADO) VALUES (?,?,?)`;

        const result = await query(sql, [code, description, state]);
        const affectedRows = result ? result.affectedRows : 0;
        if(result){
            const resultLog = await this.profileLog(u_id, result.insertId, null, 'Criar');
            affectedRows = resultLog ? affectedRows + resultLog : 0;
        }

        return affectedRows;
    }

    update = async (params, code) => {
        let currentProfile = await this.findOne( {'CODIGO': code} );
        const { ID, ...prevVal} = currentProfile;
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE CODIGO = ?`;

        const result = await query(sql, [...values, code]);
        
        if(result && result.changedRows){
            const resultLog = await this.profileLog(u_id, currentMenu.ID, prevVal, 'Editar');
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
            const resultLog = await this.profileLog(u_id, currentProfile.ID, prevVal, 'Eliminar');
        }

        return affectedRows;
    }
}

module.exports = new ProfileModel;