const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
class LogModel {
    tableName = 'logs';

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

        // return back the first row (menu)
        return result[0];
    }

    create = async ({ user_id, table, object_id, previous_value, new_value, action}) => {
        const sql = `INSERT INTO ${this.tableName}
        (ID_UTILIZADOR, TABELA, ID_OBJECTO, VALOR_ANTIGO, VALOR_NOVO, ACAO) VALUES (?,?,?,?,?,?)`;

        const result = await query(sql, [user_id, table, object_id, previous_value, new_value, action]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE ID = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
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

    logChange = async (u_id, id, prevVal, newVal, act) => {
        const newLog = this.logPrep(u_id, id, prevVal, newVal, act);
        return await this.create(newLog);
    }


}

module.exports = new LogModel;