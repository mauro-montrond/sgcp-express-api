const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
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

    create = async ({ code, description, parent_menu = null, state = 'A'}) => {
        const sql = `INSERT INTO ${this.tableName}
        (CODIGO, DESCRICAO, ID_MENU_PAI, ESTADO) VALUES (?,?,?,?)`;

        const result = await query(sql, [code, description, parent_menu, state]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, code) => {
        let affectedRowsTotal = 0;
        let changedRowsTotal = 0;
        let currentMenu = await this.findOne( {'CODIGO': code} );
        let state;
        if(params.ESTADO)
            state = params.ESTADO;
        else {
            state = currentMenu.ESTADO;
        }

        if(params.ESTADO){
            let updates1 =[];
            let childs1 = await this.findMany( {'ID_MENU_PAI': currentMenu.ID} );
            if(childs1.length){
                for(const element of childs1){
                    updates1.push(element.ID);

                    affectedRowsTotal += 1;
                    changedRowsTotal += 1;
                
                    let childs2 = await this.findMany( {'ID_MENU_PAI': element.ID} );
                    if(childs2.length){
                        for(const element2 of childs2){
                            updates1.push(element2.ID);
                            affectedRowsTotal += 1;
                            changedRowsTotal += 1;
                        }
                    }
                }
                let sql1 = `UPDATE ${this.tableName} SET ESTADO = ? WHERE ID IN (${updates1})`;
                let result1 = await query(sql1, [params.ESTADO]);
            }
        }
        
        if(state == 'A'){
            let updates2 =[];
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
                    affectedRowsTotal += 1;
                    changedRowsTotal += 1;
                }
                if(parent1.ID_MENU_PAI){
                    let parent2 = await this.findOne( {'ID': parent1.ID_MENU_PAI} );
                    if(parent2.ESTADO == 'I'){
                        updates2.push(parent2.ID);
                        affectedRowsTotal += 1;
                        changedRowsTotal += 1;
                    }
                }
                if(updates2.length){
                    let sql2 = `UPDATE ${this.tableName} SET ESTADO = ? WHERE ID IN (${updates2})`;
                    let result2 = await query(sql2, [state]);
                }
            }
        }

        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE CODIGO = ?`;

        let result = await query(sql, [...values, code]);
        if(result){
            result.affectedRows += affectedRowsTotal;
            result.changedRows += changedRowsTotal;
            let regex = /Warnings/i;
            let newT = result.info.replace(regex, `Affected rows: ${result.affectedRows}  Changed rows: ${result.changedRows}  Warnings`);
            result.info = newT;
        }

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

module.exports = new MenuModel;