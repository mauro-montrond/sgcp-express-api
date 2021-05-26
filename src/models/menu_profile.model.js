const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets, multipleRowInsert, multipleRowOrSetter } = require('../utils/common.utils');
const MenuModel = require('./menu.model');
const logModel = require('./log.model');
class Menu_ProfileModel {
    tableName = 'menu_perfil';

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

    /*
    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (profile)
        return result[0];
    }
    */

    findOne = async (params) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnGets, values } = multipleColumnGets(params)
        sql += ` WHERE ${columnGets}`;

        const result = await query(sql, [...values]);

        // return back the first row (menu_profile)
        return result[0];
    }

    getVal = async (profile_id, menu_id) => {
        let nv = await this.findOne({'ID_PERFIL': profile_id, 'ID_MENU': menu_id});
        if(nv){
            const { ID, ...newVal } = nv;
            return newVal;
        }
        return null;
    }

    create = async ({ profile_id, menu_id, state = 'A'}, u_id) => {

        let inserts = [];
        let updates = [];
        let updatesPrev = [];
        let findElemnt = await this.findOne({'ID_PERFIL': profile_id, 'ID_MENU': menu_id});
        if(!findElemnt)
            inserts.push({'ID_PERFIL': profile_id, 'ID_MENU': menu_id, 'ESTADO': state});
        else if(findElemnt.ESTADO != state){
            updatesPrev.push(findElemnt);
            updates.push({'ID_PERFIL': profile_id, 'ID_MENU': menu_id, 'ESTADO': state});
        }

        let childs1 = await MenuModel.findMany( {'ID_MENU_PAI': menu_id} );
        if(childs1.length){
            for(const element of childs1){
                let findElemnt2 = await this.findOne({'ID_PERFIL': profile_id, 'ID_MENU': element.ID});
                if(!findElemnt2)
                    inserts.push( {'ID_PERFIL': profile_id, 'ID_MENU': element.ID, 'ESTADO': state} );
                else if(findElemnt2.ESTADO != state){
                    updatesPrev.push(findElemnt2);
                    updates.push({'ID_PERFIL': profile_id, 'ID_MENU': element.ID, 'ESTADO': state});
                }
                let childs2 = await MenuModel.findMany( {'ID_MENU_PAI': element.ID} );
                if(childs2.length){
                    for(const element2 of childs2){
                        let findElemnt3 = await this.findOne({'ID_PERFIL': profile_id, 'ID_MENU': element2.ID});
                        if(!findElemnt3)
                            inserts.push( {'ID_PERFIL': profile_id, 'ID_MENU': element2.ID, 'ESTADO': state} );
                        else if(findElemnt3.ESTADO != state){
                            updatesPrev.push(findElemnt3);
                            updates.push({'ID_PERFIL': profile_id, 'ID_MENU': element2.ID, 'ESTADO': state});
                        }
                    }
                }
            }
        }
        if(inserts.length || updates.length){
            
            const fullList = inserts.concat(updates);
            const { columnGets, values } = multipleRowInsert(fullList);
    
            const sql = `INSERT INTO ${this.tableName}
            (ID_PERFIL, ID_MENU, ESTADO) VALUES ${columnGets} ON DUPLICATE KEY UPDATE ESTADO = ?`;
            const result = await query(sql, [...values, state]);
            let affectedRows = result ? result.affectedRows : -1;

            if(affectedRows != -1){
                for(let i = 0; i < inserts.length; i++){
                    const currentItem = await this.findOne({'ID_PERFIL': inserts[i].ID_PERFIL, 'ID_MENU': inserts[i].ID_MENU});
                    const newVal = await this.getVal(inserts[i].ID_PERFIL, inserts[i].ID_MENU);
                    const resultLog = await logModel.logChange(u_id, this.tableName, currentItem.ID, null, newVal, 'Criar');
                    affectedRows = resultLog ? affectedRows + resultLog : -1;
                }
                for(let i = 0; i < updates.length; i++){
                    const { ID, ...prevVal } = updatesPrev[i];
                    const newVal = await this.getVal(updates[i].ID_PERFIL, updates[i].ID_MENU);
                    const resultLog = await logModel.logChange(u_id, this.tableName, updatesPrev[i].ID, prevVal, newVal, 'Editar');
                    affectedRows = resultLog ? affectedRows + resultLog : -1;
                }
            }
    
            return affectedRows;

        }
        return 0;
    }

    update = async (params, profile_id, menu_id, u_id) => {

        let updates = [];
        let updatesPrev = [];
        let currentItem = await this.findOne({'ID_PERFIL': profile_id, 'ID_MENU':menu_id});
        if(params.ESTADO && currentItem.ESTADO != params.ESTADO){
            updates.push({'ID_PERFIL': profile_id, 'ID_MENU': menu_id});
            updatesPrev.push(currentItem);
        }

        let childs1 = await MenuModel.findMany( {'ID_MENU_PAI': menu_id} );
        if(childs1.length){
            for(const element of childs1){
                let prev1 = await this.findOne({'ID_PERFIL': profile_id, 'ID_MENU': element.ID});
                if(params.ESTADO && prev1.ESTADO != params.ESTADO){
                    updates.push( {'ID_PERFIL': profile_id, 'ID_MENU': element.ID} );
                    updatesPrev.push(prev1);
                }
                let childs2 = await MenuModel.findMany( {'ID_MENU_PAI': element.ID} );
                if(childs2.length){
                    for(const element2 of childs2){
                        let prev2 = await this.findOne({'ID_PERFIL': profile_id, 'ID_MENU': element2.ID});
                        if(params.ESTADO && prev2.ESTADO != params.ESTADO){
                            updates.push( {'ID_PERFIL': profile_id, 'ID_MENU': element2.ID} );
                            updatesPrev.push(prev2);
                        }
                    }
                }
            }
        }
        
        if(params.ESTADO && params.ESTADO == 'A'){
            let currentMenu = await MenuModel.findOne( {'ID': menu_id} );
            if(currentMenu.ID_MENU_PAI){
                let parent1 = await MenuModel.findOne( {'ID': currentMenu.ID_MENU_PAI} );
                let prev1 = await this.findOne({'ID_PERFIL': profile_id, 'ID_MENU': parent1.ID});
                if(prev1.ESTADO != 'A'){
                    updates.push( {'ID_PERFIL': profile_id, 'ID_MENU': parent1.ID} );
                    updatesPrev.push(prev1);
                }
                if(parent1.ID_MENU_PAI){
                    let parent2 = await MenuModel.findOne( {'ID': parent1.ID_MENU_PAI} );
                    let prev2 = await this.findOne({'ID_PERFIL': profile_id, 'ID_MENU': parent2.ID});
                    if(prev2.ESTADO != 'A'){
                        updates.push( {'ID_PERFIL': profile_id, 'ID_MENU': parent1.ID_MENU_PAI} );
                        updatesPrev.push(prev2);
                    }
                }
            }

        }

        if(updates.length){
            const { columnSet, values } = multipleColumnSet(params);
            const { rowsOr, valuesOr } = multipleRowOrSetter(updates);
            const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE ${rowsOr}`;
            const result = await query(sql, [...values, ...valuesOr]);
    
            if(result.affectedRows){
                for(let i = 0; i < updates.length; i++){
                    const { ID, ...prevVal } = updatesPrev[i];
                    const newVal = await this.getVal(updates[i].ID_PERFIL, updates[i].ID_MENU);
                    const resultLog = await logModel.logChange(u_id, this.tableName, updatesPrev[i].ID, prevVal, newVal, 'Editar');
                    result.affectedRows = resultLog ? result.affectedRows + resultLog : -1;
                }
            }
    
    
            return result;
        }
        const noUpdates = {};
        noUpdates['affectedRows'] = 1;
        noUpdates['changedRows'] = 0;
        return noUpdates;
    }

    delete = async (profile_id, menu_id, u_id) => {
        let deletes = [];
        let deletesPrev = [];
        let currentItem = await this.findOne({'ID_PERFIL': profile_id, 'ID_MENU':menu_id}); 

        deletes.push({'ID_PERFIL': profile_id, 'ID_MENU': menu_id});
        deletesPrev.push(currentItem);

        let childs1 = await MenuModel.findMany( {'ID_MENU_PAI': menu_id} );
        if(childs1.length){
            for(const element of childs1){
                deletes.push( {'ID_PERFIL': profile_id, 'ID_MENU': element.ID} );
                let currentChild1 = await this.findOne({'ID_PERFIL': profile_id, 'ID_MENU':element.ID});
                deletesPrev.push(currentChild1);
                let childs2 = await MenuModel.findMany( {'ID_MENU_PAI': element.ID} );
                if(childs2.length){
                    for(const element2 of childs2){
                        deletes.push( {'ID_PERFIL': profile_id, 'ID_MENU': element2.ID} );
                        let currentChild2 = await this.findOne({'ID_PERFIL': profile_id, 'ID_MENU':element2.ID});
                        deletesPrev.push(currentChild2);
                    }
                }
            }
        }
        const { rowsOr, valuesOr } = multipleRowOrSetter(deletes);
        const sql = `DELETE FROM ${this.tableName}
        WHERE ${rowsOr}`;
        
        const result = await query(sql, [...valuesOr]);
        const affectedRows = result ? result.affectedRows : 0;
        if(affectedRows){
            for(let i = 0; i < deletesPrev.length; i++){
                const currentId = deletesPrev[i].ID;
                const {ID, ...prevVal} =  deletesPrev[i];
                const resultLog = await logModel.logChange(u_id, this.tableName, currentId, prevVal, null, 'Eliminar');
            }

        }

        return affectedRows;
    }
}

module.exports = new Menu_ProfileModel;