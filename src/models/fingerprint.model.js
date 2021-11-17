const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
const logModel = require('./log.model');
// new
const fs = require('fs');
const path = require('path');
class FingerprintModel {
    tableName = 'digitais';

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

        // return back the first row (fingerprint)
        return result[0];
    }

    findFingerprint = async (fingerprint) => {
        const sql = `SELECT * FROM ${this.tableName}
        WHERE POLEGAR_DIREITO = ? OR INDICADOR_DIREITO = ? OR MEDIO_DIREITO = ? OR ANELAR_DIREITO = ? OR MINDINHO_DIREITO = ? OR 
        POLEGAR_ESQUERDO = ? OR INDICADOR_ESQUERDO = ? OR MEDIO_ESQUERDO = ? OR ANELAR_ESQUERDO = ? OR MINDINHO_ESQUERDO = ?`;

        const result = await query(sql, [fingerprint, fingerprint, fingerprint, fingerprint, fingerprint, 
                                         fingerprint, fingerprint, fingerprint, fingerprint, fingerprint]);
        // return back the first row (fingerprint)
        return result[0];
    }

    getVal = async (id) => {
        let nv = await this.findOne({'ID': id});
        const { ID, ...newVal } = nv;
        return newVal;
    }

    create = async ({ individual_id, r_thumb = null, r_index = null, r_middle = null, r_ring = null, r_little = null, 
                      l_thumb = null, l_index = null, l_middle = null, l_ring = null, l_little = null }, files, u_id, full) => {
        if(files){
            let fingerprints =["r_thumbFile", "r_indexFile", "r_middleFile", "r_ringFile", "r_littleFile", 
                                "l_thumbFile", "l_indexFile", "l_middleFile", "l_ringFile", "l_littleFile"];
            var filesList = [];
            var fileKeys = Object.keys(files);
            fileKeys.forEach(key => {
                filesList.push(key);
            });
            filesList.forEach( file => {
                let uploadPath = `./uploads/individuals/${individual_id}`;
                if(fingerprints.includes(files[file][0].fieldname)) {
                    uploadPath += `/fingerprints`;
                    fs.mkdirSync( uploadPath, { recursive: true } );
                    // fs.mkdir( uploadPath, { recursive: true }, (err) => {
                    //     if (err) throw err;
                    // });
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
        (ID_INDIVIDUO, POLEGAR_DIREITO, INDICADOR_DIREITO, MEDIO_DIREITO, ANELAR_DIREITO, MINDINHO_DIREITO, 
         POLEGAR_ESQUERDO, INDICADOR_ESQUERDO, MEDIO_ESQUERDO, ANELAR_ESQUERDO, MINDINHO_ESQUERDO) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
        let result = await query(sql, [individual_id, r_thumb, r_index, r_middle, r_ring, r_little, l_thumb, l_index, l_middle, l_ring, l_little]);
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

    update = async (params, files, individual_id, u_id) => {
        let currentFingerprint = await this.findOne( {'ID_INDIVIDUO': individual_id} );
        const { ID, ...prevVal} = currentFingerprint;
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE ID_INDIVIDUO = ?`;

        const result = await query(sql, [...values, individual_id]);
        
        if(result && result.changedRows){
            const newVal = await this.getVal(currentFingerprint.ID);
            const resultLog = await logModel.logChange(u_id, this.tableName, currentFingerprint.ID, prevVal, newVal, 'Editar');
			var fingerprintConversion = {
				"POLEGAR_DIREITO": "r_thumbFile",
				"INDICADOR_DIREITO": "r_indexFile",
				"MEDIO_DIREITO": "r_middleFile",
				"ANELAR_DIREITO": "r_ringFile",
				"MINDINHO_DIREITO": "r_littleFile",
				"POLEGAR_ESQUERDO": "r_thumbFile",
				"INDICADOR_ESQUERDO": "r_indexFile",
				"MEDIO_ESQUERDO": "r_middleFile",
				"ANELAR_ESQUERDO": "r_ringFile",
				"MINDINHO_ESQUERDO": "r_littleFile",
			};
			var fingerprintFilesList = [];
			var fingerprintFileKeys = Object.keys(params);
			fingerprintFileKeys.forEach(key => {
				fingerprintFilesList.push(key);
			});
			fingerprintFilesList.forEach( file => {
				let uploadPath = `./uploads/individuals/${individual_id}/fingerprints`;
                if(!fs.existsSync(uploadPath)){
                    fs.mkdirSync( uploadPath, { recursive: true } );
                }
				let fileName = params[file];
				uploadPath += '/' + fileName;
				let writer = fs.createWriteStream(uploadPath);
				// write data
				writer.write(files[fingerprintConversion[file]][0].buffer);
				writer.end();
			});
			if(currentFingerprint){
				// get the keys of the previous prints values
				var prevPrintList = Object.keys(currentFingerprint);
				prevPrintList.forEach( prevPrint => {
					// check if the key is a print and if it is not null (meaning we had a previous print stored)
					if( Object.keys(fingerprintConversion).includes(prevPrint) && currentFingerprint[prevPrint]){
						// get the path of the previous stored print
						let uploadPath = `./uploads/individuals/${individual_id}/fingerprints/${currentFingerprint[prevPrint]}`;
						// if we still have that print
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

    delete = async (individual_id, u_id, full) => {
        
        let currentFingerprint = await this.findOne( {'ID_INDIVIDUO': individual_id} );
        const sql = `DELETE FROM ${this.tableName}
        WHERE ID_INDIVIDUO = ?`;
        let result = await query(sql, [individual_id]);
        const affectedRows = result ? result.affectedRows : 0;
        if(affectedRows){
            const { ID, ...prevVal} = currentFingerprint;
            const resultLog = await logModel.logChange(u_id, this.tableName, currentFingerprint.ID, prevVal, null, 'Eliminar');
            result.affectedRows = resultLog ? result.affectedRows + resultLog : 0;
        }

        if(!full)
            return affectedRows;
        else
            return result;
    }
}

module.exports = new FingerprintModel;