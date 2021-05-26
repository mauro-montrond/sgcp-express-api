const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
const logModel = require('./log.model');
class PrecedentuModel {
    tableName = 'antecedente';

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
        //console.log("params keys: " + Object.keys(params).length);

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

        // return back the first row (precedent)
        return result[0];
    }

    getVal = async (id) => {
        let nv = await this.findOne({'ID': id});
        const { ID, ...newVal } = nv;
        return newVal;
    }

    create = async ({ individual_id, reference_num, detention_reason, destination, date = new Date(), state = 'A'}, user_id, full) => {
        const sql = `INSERT INTO ${this.tableName}
        (ID_UTILIZADOR, ID_INDIVIDUO, NO_REFERENCIA, MOTIVO_DETENCAO, DESTINO, DATA, ESTADO) VALUES (?,?,?,?,?,?,?)`;

        let result = await query(sql, [user_id, individual_id, reference_num, detention_reason, destination, date, state]);
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
        let currentPrecedent = await this.findOne( {'ID': id} );
        const { ID, ...prevVal} = currentPrecedent;
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE ID = ?`;

        const result = await query(sql, [...values, id]);
        
        if(result && result.changedRows){
            const newVal = await this.getVal(currentPrecedent.ID);
            const resultLog = await logModel.logChange(u_id, this.tableName, currentPrecedent.ID, prevVal, newVal, 'Editar');
        }

        return result;
    }

    delete = async (id, u_id) => {
        let currentPrecedent= await this.findOne( {'ID': id} );
        const { ID, ...prevVal} = currentPrecedent;
        const sql = `DELETE FROM ${this.tableName}
        WHERE ID = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;
        if(affectedRows){
            const resultLog = await logModel.logChange(u_id, this.tableName, currentPrecedent.ID, prevVal, null, 'Eliminar');
        }

        return affectedRows;
    }

    deleteFull = async (id, u_id, full) => {
        let precedentList = await this.findMany( {'ID_INDIVIDUO': id} );
        const sql = `DELETE FROM ${this.tableName}
        WHERE ID_INDIVIDUO = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;
        if(affectedRows){
            for(let i = 0; i < precedentList.length; i++){
                const currentPrecedent = precedentList[i];
                const { ID, ...prevVal} = currentPrecedent;
                const resultLog = await logModel.logChange(u_id, this.tableName, currentPrecedent.ID, prevVal, null, 'Eliminar');
                result.affectedRows = resultLog ? result.affectedRows + resultLog : 0;
            }
        }

        if(!full)
            return affectedRows;
        else
            return result;
    }
}

module.exports = new PrecedentuModel;