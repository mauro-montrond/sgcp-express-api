const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
const logModel = require('./log.model');
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

    getVal = async (id) => {
        let nv = await this.findOne({'ID': id});
        const { ID, ...newVal } = nv;
        return newVal;
    }

    create = async ({ individual_id, l_photo, f_photo, r_photo, state='A'}, u_id, full) => {
        let deactivation = 'OK';
        if(state == 'A') {
            const photos = await this.findMany({ 'ID_INDIVIDUO': individual_id, 'ESTADO': 'A' });
            for( let photo of photos ){
                const deactivate = await this.update( {'ESTADO': 'I'}, photo.ID, u_id );
                if(!deactivate) {
                    deactivation = 'Something went wrong';
                }
            }
        }
        if( deactivation != 'OK' )
            return deactivation;
        const sql = `INSERT INTO ${this.tableName}
        (ID_INDIVIDUO, FOTO_ESQUERDA, FOTO_FRONTAL, FOTO_DIREITA, ESTADO) VALUES (?,?,?,?,?)`;

        let result = await query(sql, [individual_id, l_photo, f_photo, r_photo, state]);
        let affectedRows = result ? result.affectedRows : 0;
        if(result){
            const newVal = await this.getVal(result.insertId);
            const resultLog = await logModel.logChange(u_id, this.tableName, result.insertId, null, newVal, 'Criar');
            affectedRows = resultLog ? affectedRows + resultLog : 0;
            result.affectedRows = resultLog ? result.affectedRows + resultLog : 0;
        }
        if(!full)
            return affectedRows;
        else
            return result;
    }

    update = async (params, id, u_id) => {
        let currentPhoto= await this.findOne( {'ID': id} );
        const { ID, ...prevVal} = currentPhoto;
        let deactivation = 'OK';
        if(params.ESTADO == 'A' && currentPhoto.ESTADO != 'A') {
            const findphoto = await this.findOne({ 'ID': id});
            if(findphoto) {
                const activePhotos = await this.findMany({ 'ID_INDIVIDUO': findphoto.ID_INDIVIDUO, 'ESTADO': 'A' });
                for( let photo of activePhotos ){
                    const deactivate = await this.update( {'ESTADO': 'I'}, photo.ID, u_id );
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
        
        if(result && result.changedRows){
            const newVal = await this.getVal(currentPhoto.ID);
            const resultLog = await logModel.logChange(u_id, this.tableName, currentPhoto.ID, prevVal, newVal, 'Editar');
        }

        return result;
    }

    delete = async (id, u_id) => {
        let currentPhoto = await this.findOne( {'ID': id} );
        const { ID, ...prevVal} = currentPhoto;
        const sql = `DELETE FROM ${this.tableName}
        WHERE ID = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;
        if(affectedRows){
            const resultLog = await logModel.logChange(u_id, this.tableName, currentPhoto.ID, prevVal, null, 'Eliminar');
        }

        return affectedRows;
    }

    deleteFull = async (id, u_id, full) => {
        let photoList = await this.findMany( {'ID_INDIVIDUO': id} );
        const sql = `DELETE FROM ${this.tableName}
        WHERE ID_INDIVIDUO = ?`;
        let result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;
        if(affectedRows){
            for(let i = 0; i < photoList.length; i++){
                const currentPhoto = photoList[i];
                const { ID, ...prevVal} = currentPhoto;
                const resultLog = await logModel.logChange(u_id, this.tableName, currentPhoto.ID, prevVal, null, 'Eliminar');
                result.affectedRows = resultLog ? result.affectedRows + resultLog : 0;
            }
        }

        if(!full)
            return affectedRows;
        else
            return result;
    }
}

module.exports = new PhotoModel;