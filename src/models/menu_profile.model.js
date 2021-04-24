const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets, multipleRowInsert, multipleRowOrSetter } = require('../utils/common.utils');
const MenuModel = require('./menu.model');
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

    create = async ({ profile_id, menu_id, state = 'A'}) => {

        let inserts = [];
        inserts.push({'ID_PERFIL': profile_id, 'ID_MENU': menu_id, 'ESTADO': state});

        let childs1 = await MenuModel.findMany( {'ID_MENU_PAI': menu_id} );
        if(childs1.length){
            for(const element of childs1){
                inserts.push( {'ID_PERFIL': profile_id, 'ID_MENU': element.ID, 'ESTADO': state} );
                let childs2 = await MenuModel.findMany( {'ID_MENU_PAI': element.ID} );
                if(childs2.length){
                    for(const element2 of childs2){
                        inserts.push( {'ID_PERFIL': profile_id, 'ID_MENU': element2.ID, 'ESTADO': state} );
                    }
                }
            }
        }
        const { columnGets, values } = multipleRowInsert(inserts);

        const sql = `INSERT INTO ${this.tableName}
        (ID_PERFIL, ID_MENU, ESTADO) VALUES ${columnGets} ON DUPLICATE KEY UPDATE ESTADO = ?`;
        const result = await query(sql, [...values, state]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, profile_id, menu_id) => {

        let updates = [];
        updates.push({'ID_PERFIL': profile_id, 'ID_MENU': menu_id});

        let childs1 = await MenuModel.findMany( {'ID_MENU_PAI': menu_id} );
        if(childs1.length){
            for(const element of childs1){
                updates.push( {'ID_PERFIL': profile_id, 'ID_MENU': element.ID} );
                let childs2 = await MenuModel.findMany( {'ID_MENU_PAI': element.ID} );
                if(childs2.length){
                    for(const element2 of childs2){
                        updates.push( {'ID_PERFIL': profile_id, 'ID_MENU': element2.ID} );
                    }
                }
            }
        }
        const { columnSet, values } = multipleColumnSet(params);
        const { rowsOr, valuesOr } = multipleRowOrSetter(updates);
        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE ${rowsOr}`;
        return await query(sql, [...values, ...valuesOr]);
    }

    delete = async (profile_id, menu_id) => {
        let deletes = [];
        deletes.push({'ID_PERFIL': profile_id, 'ID_MENU': menu_id});

        let childs1 = await MenuModel.findMany( {'ID_MENU_PAI': menu_id} );
        if(childs1.length){
            for(const element of childs1){
                deletes.push( {'ID_PERFIL': profile_id, 'ID_MENU': element.ID} );
                let childs2 = await MenuModel.findMany( {'ID_MENU_PAI': element.ID} );
                if(childs2.length){
                    for(const element2 of childs2){
                        deletes.push( {'ID_PERFIL': profile_id, 'ID_MENU': element2.ID} );
                    }
                }
            }
        }
        const { rowsOr, valuesOr } = multipleRowOrSetter(deletes);
        const sql = `DELETE FROM ${this.tableName}
        WHERE ${rowsOr}`;
        const result = await query(sql, [...valuesOr]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new Menu_ProfileModel;