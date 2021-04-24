const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
class PhotoModel {
    tableName = 'fotos';

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

        // return back the first row (photo)
        return result[0];
    }

    findPhoto = async (photo) => {
        const sql = `SELECT * FROM ${this.tableName}
        WHERE FOTO_ESQUERDA = ? OR FOTO_FRONTAL = ? OR FOTO_DIREITA = ?`;

        const result = await query(sql, [photo, photo, photo]);
        // return back the first row (photo)
        return result[0];
    }

    create = async ({ individual_id, l_photo, f_photo, r_photo, state='A'}) => {
        let deactivation = 'OK';
        if(state == 'A') {
            const photos = await this.findMany({ 'ID_INDIVIDUO': individual_id, 'ESTADO': 'A' });
            for( let photo of photos ){
                const deactivate = await this.update( {'ESTADO': 'I'}, photo.ID );
                if(!deactivate) {
                    deactivation = 'Something went wrong';
                }
            }
        }
        if( deactivation != 'OK' )
            return deactivation;
        const sql = `INSERT INTO ${this.tableName}
        (ID_INDIVIDUO, FOTO_ESQUERDA, FOTO_FRONTAL, FOTO_DIREITA, ESTADO) VALUES (?,?,?,?,?)`;

        const result = await query(sql, [individual_id, l_photo, f_photo, r_photo, state]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }

    update = async (params, id) => {
        let deactivation = 'OK';
        if(params.ESTADO == 'A') {
            const findphoto = await this.findOne({ 'ID': id});
            if(findphoto) {
                const activePhotos = await this.findMany({ 'ID_INDIVIDUO': findphoto.ID_INDIVIDUO, 'ESTADO': 'A' });
                for( let photo of activePhotos ){
                    console.log("photo.ID: " + photo.ID);
                    const deactivate = await this.update( {'ESTADO': 'I'}, photo.ID );
                    if(!deactivate) {
                        deactivation = 'Something went wrong';
                    }
                }
            }
        }
        if( deactivation != 'OK' )
            return deactivation;
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE ID = ?`;

        const result = await query(sql, [...values, id]);

        return result;
    }

    delete = async (id) => {
        const sql = `DELETE FROM ${this.tableName}
        WHERE ID = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;

        return affectedRows;
    }
}

module.exports = new PhotoModel;