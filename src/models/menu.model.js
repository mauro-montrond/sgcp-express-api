const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
const logModel = require('./log.model');
const { update } = require('./user.model');
class MenuModel {
    tableName = 'menu';

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

    menuLog = async (u_id, id, prevVal, act) => {
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

    create = async ({ code, title, description, parent_menu = null, state = 'A'}, u_id) => {
        const sql = `INSERT INTO ${this.tableName}
        (CODIGO, TITULO, DESCRICAO, ID_MENU_PAI, ESTADO) VALUES (?,?,?,?,?)`;

        const result = await query(sql, [code, title, description, parent_menu, state]);
        let affectedRows = result ? result.affectedRows : 0;
        if(result){
            const resultLog = await this.menuLog(u_id, result.insertId, null, 'Criar');
            affectedRows = resultLog ? affectedRows + resultLog : 0;
        }
        return affectedRows;
    }

    update = async (params, code, u_id) => {
        let affectedRowsTotal = 0;
        let changedRowsTotal = 0;
        let warningStatusTotal = 0;
        let currentMenu = await this.findOne( {'CODIGO': code} );
        let state;
        if(params.ESTADO)
            state = params.ESTADO;
        else {
            state = currentMenu.ESTADO;
        }

        if(params.ESTADO){
            let updates1 =[];
            let prevVals1 =[];
            let childs1 = await this.findMany( {'ID_MENU_PAI': currentMenu.ID} );
            if(childs1.length){
                for(const element of childs1){
                    if(element.ESTADO != params.ESTADO){
                        updates1.push(element.ID);
                        prevVals1.push(element);
                    }
                
                    let childs2 = await this.findMany( {'ID_MENU_PAI': element.ID} );
                    if(childs2.length){
                        for(const element2 of childs2){
                            if(element2.ESTADO != params.ESTADO){
                                updates1.push(element2.ID);
                                prevVals1.push(element);
                            }
                        }
                    }
                }
                if(updates1.length){
                    let sql1 = `UPDATE ${this.tableName} SET ESTADO = ? WHERE ID IN (${updates1})`;
                    let result1 = await query(sql1, [params.ESTADO]);
                    affectedRowsTotal += result1.affectedRows;
                    changedRowsTotal += result1.changedRows;
                    warningStatusTotal += result1.warningStatus;
                    if(result1){
                        for(let i = 0; i < updates1.length; i++){
                            const { ID, ...prevVal } = prevVals1[i];
                            console.log("res1 1");
                            const resultLog = await this.menuLog(u_id, updates1[i], prevVal, 'Editar');
                            console.log("res1 1");
                        }
                    }
                }
            }
        }
        
        if(state == 'A'){
            let updates2 =[];
            let prevVals2 =[];
            let parent1;
            if(params.ID_MENU_PAI){
                parent1 = await this.findOne( {'ID': params.ID_MENU_PAI} );
            }
            else if (currentMenu.ID_MENU_PAI){
                parent1 = await this.findOne( {'ID': currentMenu.ID_MENU_PAI} )
            }
            if(parent1){
                if(parent1.ESTADO == 'I'){
                    updates2.push(parent1.ID);
                    prevVals2.push(parent1);
                }
                if(parent1.ID_MENU_PAI){
                    let parent2 = await this.findOne( {'ID': parent1.ID_MENU_PAI} );
                    if(parent2.ESTADO == 'I'){
                        updates2.push(parent2.ID);
                        prevVals2.push(parent2);
                    }
                }
                if(updates2.length){
                    let sql2 = `UPDATE ${this.tableName} SET ESTADO = ? WHERE ID IN (${updates2})`;
                    let result2 = await query(sql2, [state]);
                    affectedRowsTotal += result2.affectedRows;
                    changedRowsTotal += result2.changedRows;
                    warningStatusTotal += result2.warningStatus;
                    if(result2){
                        for(let i = 0; i < updates2.length; i++){
                            const { ID, ...prevVal } = prevVals2[i];
                            const resultLog = await this.menuLog(u_id, updates2[i], prevVal, 'Editar');
                        }
                    }
                }
            }
        }

        const { ID, ...prevVal} = currentMenu;

        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE CODIGO = ?`;

        let result = await query(sql, [...values, code]);
        if(result){
            if(result.changedRows){
                const resultLog = await this.menuLog(u_id, currentMenu.ID, prevVal, 'Editar');
            }
            result.affectedRows += affectedRowsTotal;
            result.changedRows += changedRowsTotal;
            result.warningStatus += warningStatusTotal;
            result.info = `Rows matched: ${result.affectedRows}  Changed: ${result.changedRows}  Warnings: ${result.warningStatus}`;
        }

        return result;
    }

    delete = async (code, u_id) => {
        let currentMenu = await this.findOne( {'CODIGO': code} );
        const { ID, ...prevVal} = currentMenu;
        const sql = `DELETE FROM ${this.tableName}
        WHERE CODIGO = ?`;
        const result = await query(sql, [code]);
        const affectedRows = result ? result.affectedRows : 0;
        if(affectedRows){
            const resultLog = await this.menuLog(u_id, currentMenu.ID, prevVal, 'Eliminar');
        }

        return affectedRows;
    }
}

module.exports = new MenuModel;