const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
const logModel = require('./log.model');
const fs = require('fs');
const path = require('path');
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

    create = async ({ individual_id, l_photo = null, f_photo = null, r_photo = null, state='A'}, files, u_id, full) => {
        let deactivation = 'OK';
        // console.log(individual_id);
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
        if(files){
            let photos =["l_photoFile", "f_photoFile", "r_photoFile"];
            var filesList = [];
            var fileKeys = Object.keys(files);
            fileKeys.forEach(key => {
                filesList.push(key);
            });
            filesList.forEach( file => {
                let uploadPath = `./uploads/individuals/${individual_id}`;
                if(photos.includes(files[file][0].fieldname)) {
                    uploadPath += `/photos/`;
                    fs.mkdirSync( uploadPath, { recursive: true } );
                    let fileName = files[file][0].fieldname + '_' + Date.now() + path.extname(files[file][0].originalname);
                    let fieldname = files[file][0].fieldname.substring(0, files[file][0].fieldname.indexOf("File"));
                    // dynamically add each fileName to body
                    eval(fieldname + " = '" + fileName +"';");
                    uploadPath += '/' + fileName;
                    let writer = fs.createWriteStream(uploadPath);
                    // write data
                    writer.write(files[file][0].buffer);
                    // the finish event is emitted when all data has been flushed from the stream
                    writer.on('finish', () => {
                        // console.log('wrote all data to file');
                    });
                    // close the stream
                    writer.end();
                }
            });
        }
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

    update = async (params, files, id, u_id) => {
        let currentPhoto= await this.findOne( {'ID': id} );
        let individual_id = currentPhoto.ID_INDIVIDUO;
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
			var photoConversion = {
				"FOTO_ESQUERDA": "l_photoFile",
				"FOTO_FRONTAL": "f_photoFile",
				"FOTO_DIREITA": "r_photoFile",
			}; 
			var photoFilesList = [];
			var photoFileKeys = Object.keys(params);
			photoFileKeys.forEach(key => {
				if( Object.keys(photoConversion).includes(key))
					photoFilesList.push(key);
			});
			photoFilesList.forEach( file => {
				let uploadPath = `./uploads/individuals/${individual_id}/photos`;
                if(!fs.existsSync(uploadPath)){
                    fs.mkdirSync( uploadPath, { recursive: true } );
                }
				let fileName = params[file];
				uploadPath += '/' + fileName;
				let writer = fs.createWriteStream(uploadPath);
				// write data
				writer.write(files[photoConversion[file]][0].buffer);
				writer.end();
			});
			if(currentPhoto){
				// get the keys of the previous photos values
				var prevPhotosList = Object.keys(currentPhoto);
				prevPhotosList.forEach( prevPhoto => {
					// check if the key is a photo and if it is not null (meaning we had a previous photo stored)
					if( Object.keys(photoConversion).includes(prevPhoto) && currentPhoto[prevPhoto]){
						// get the path of the previous stored photo
						let uploadPath = `./uploads/individuals/${individual_id}/photos/${currentPhoto[prevPhoto]}`;
						// if we still have that photo
						if(fs.existsSync(uploadPath)){
							// remove it
							fs.unlink(uploadPath, (err) => {
								if(err) throw err;
							});
						}
					}
				});
			}
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
            // check if we had any photos and add their path to an array
            let photosList = [];
            if(currentPhoto.FOTO_ESQUERDA)
                photosList.push(`./uploads/individuals/${currentPhoto.ID_INDIVIDUO}/photos/${currentPhoto.FOTO_ESQUERDA}`);
            if(currentPhoto.FOTO_FRONTAL)
                photosList.push(`./uploads/individuals/${currentPhoto.ID_INDIVIDUO}/photos/${currentPhoto.FOTO_FRONTAL}`);
            if(currentPhoto.FOTO_DIREITA)
                photosList.push(`./uploads/individuals/${currentPhoto.ID_INDIVIDUO}/photos/${currentPhoto.FOTO_DIREITA}`);
            // after the photos has been deleted from database, delete respective images from directory using the paths in the array
            photosList.forEach(photo => {
                // if we still have that photo
                if(fs.existsSync(photo)){
                    // remove it
                    fs.unlink(photo, (err) => {
                        if(err) throw err;
                    });
                }
            });
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
            // after the photos has been deleted from database, delete respective images directory
            let photosFolder = `uploads/individuals/${id}/photos`;
            fs.rm(
                photosFolder,
                {recursive: true},
                (err) => {
                    return;
                }
            );
        }

        if(!full)
            return affectedRows;
        else
            return result;
    }
}

module.exports = new PhotoModel;