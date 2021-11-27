const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
const logModel = require('./log.model');
//const Role = require('../utils/userRoles.utils');
const fs = require('fs');
const path = require('path');
class UserModel {
    tableName = 'utilizador';

    find = async (params = {}) => {
        let sql = `SELECT * FROM ${this.tableName}`;

        if (!Object.keys(params).length) {
            return await query(sql);
        }

        const { columnSet, values } = multipleColumnSet(params)
        sql += ` WHERE ${columnSet}`;

        return await query(sql, [...values]);
    }

    findOne = async (params) => {
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `SELECT * FROM ${this.tableName}
        WHERE ${columnSet}`;

        const result = await query(sql, [...values]);

        // return back the first row (user)
        return result[0];
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
    
    getVal = async (id) => {
        let nv = await this.findOne({'ID': id});
        const { ID, ...newVal } = nv;
        return newVal;
    }

    create = async ({ username, profile_id, name, email, profilePhotoFile = null, password, state = 'A' }, files, u_id) => {
        let fileName;
        if(files["profilePhotoFile"]){
            fileName = files["profilePhotoFile"][0].fieldname + '_' + Date.now() + path.extname(files["profilePhotoFile"][0].originalname);
            profilePhotoFile = fileName;
        }
        const sql = `INSERT INTO ${this.tableName}
        (UTILIZADOR, ID_PERFIL, NOME, EMAIL, AVATAR, SENHA, ESTADO) VALUES (?,?,?,?,?,?,?)`;

        const result = await query(sql, [username, profile_id, name, email, profilePhotoFile, password, state]);
        let affectedRows = result ? result.affectedRows : 0;
        if(result){
            const newVal = await this.getVal(result.insertId);
            const resultLog = await logModel.logChange(u_id, this.tableName, result.insertId, null, newVal, 'Criar');
            affectedRows = resultLog ? affectedRows + resultLog : 0;
            if(files["profilePhotoFile"]){
                let uploadPath = `./uploads/users/${result.insertId}/avatar`;
                fs.mkdirSync( uploadPath, { recursive: true } );
                uploadPath += '/' + fileName;
                let writer = fs.createWriteStream(uploadPath);
                // write data
                writer.write(files["profilePhotoFile"][0].buffer);
                // close the stream
                writer.end();
            }
        }

        return affectedRows;
    }

    update = async (params, files, username, u_id) => {
        let currentUser= await this.findOne( {'UTILIZADOR': username} );
        const { ID, ...prevVal} = currentUser;
        const { columnSet, values } = multipleColumnSet(params)

        const sql = `UPDATE ${this.tableName} SET ${columnSet} WHERE UTILIZADOR = ?`;

        const result = await query(sql, [...values, username]);
        
        if(result && result.changedRows){
            const newVal = await this.getVal(currentUser.ID);
            const resultLog = await logModel.logChange(u_id, this.tableName, currentUser.ID, prevVal, newVal, 'Editar');
            if(files["profilePhotoFile"]){
                let uploadPath = `./uploads/users/${currentUser.ID}/avatar`;
                if(!fs.existsSync(uploadPath)){
                    fs.mkdirSync( uploadPath, { recursive: true } );
                }
				let fileName = params["AVATAR"];
				uploadPath += '/' + fileName;
				let writer = fs.createWriteStream(uploadPath);
				// write data
				writer.write(files["profilePhotoFile"][0].buffer);
				writer.end();
                // remove previous avatar
                if(currentUser && currentUser.AVATAR){
                    // get the path of the previous stored avatr
                    let uploadPath = `./uploads/users/${currentUser.ID}/avatar/${currentUser.AVATAR}`;
                    // if we still have that photo
                    if(fs.existsSync(uploadPath)){
                        // remove it
                        fs.unlink(uploadPath, (err) => {
                            if(err) throw err;
                        });
                    }
                }
            }
        }

        return result;
    }

    delete = async (id, u_id) => {
        let currentUser = await this.findOne( {'ID': id} );
        const { ID, ...prevVal} = currentUser;
        const sql = `DELETE FROM ${this.tableName}
        WHERE ID = ?`;
        const result = await query(sql, [id]);
        const affectedRows = result ? result.affectedRows : 0;
        if(affectedRows){
            const resultLog = await logModel.logChange(u_id, this.tableName, currentUser.ID, prevVal, null, 'Eliminar');
            // after the individual has been deleted from database, delete his images directory
            let indivFolder = `uploads/users/${id}`;
            fs.rm(
                indivFolder,
                {recursive: true},
                (err) => {
                    return;
                }
            );
        }

        return affectedRows;
    }
}

module.exports = new UserModel;