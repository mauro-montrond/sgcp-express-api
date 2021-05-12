const query = require('../db/db-connection');
const { multipleColumnSet, multipleColumnGets } = require('../utils/common.utils');
class IndividualModel {
    tableName = 'individuo_antecedentes_utilizador';

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

        // return back the first row (individual)
        return result[0];
    }

    createFull = async ({ name, nickname, father, mother, nationality, birthplace, birthdate, apparent_age, marital_status, profession, 
                      residence_id, workplace, doc_num, doc_issuance_date, doc_issuance_place, height, hair, beard, nose, mouth, face, colour, tattoos, 
                      police_classification, individualState = 'A',
                      r_thumb, r_index, r_middle, r_ring, r_little, l_thumb, l_index, l_middle, l_ring, l_little,
                      l_photo, f_photo, r_photo, photoState = 'A'}, user_id) => {
        let affectedRows = 0;
        const sql1 = `INSERT INTO individuo
        (ID_UTILIZADOR, NOME, ALCUNHA, PAI, MAE, NACIONALIDADE, LOCAL_NASCIMENTO, DATA_NASCIMENTO, IDADE_APARENTE, ESTADO_CIVIL, PROFISSAO, ID_RESIDENCIA, 
         LOCAL_TRABALHO, NUM_DOC, DATA_EMISSAO_DOC, LOCAL_EMISSAO_DOC, ALTURA, CABELO, BARBA, NARIZ, BOCA, ROSTO, COR, TATUAGENS, 
         CLASSIFICACAO_POLICIAL, ESTADO) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const result1 = await query(sql1, [user_id, name, nickname, father, mother, nationality, birthplace, birthdate, apparent_age, marital_status, 
                                         profession, residence_id, workplace, doc_num, doc_issuance_date, doc_issuance_place, height, hair, beard, nose, 
                                         mouth, face, colour, tattoos, police_classification, individualState]);
        const affectedRows1 = result1 ? result1.affectedRows : 0;

        if(affectedRows1 != 0){
            console.log("affectedRows1: " + affectedRows1);
            affectedRows += affectedRows1;
            let individual_id = result1.insertId;
            const sql2 = `INSERT INTO digitais
            (ID_INDIVIDUO, POLEGAR_DIREITO, INDICADOR_DIREITO, MEDIO_DIREITO, ANELAR_DIREITO, MINDINHO_DIREITO, 
            POLEGAR_ESQUERDO, INDICADOR_ESQUERDO, MEDIO_ESQUERDO, ANELAR_ESQUERDO, MINDINHO_ESQUERDO) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;

            const result2 = await query(sql2, [individual_id, r_thumb, r_index, r_middle, r_ring, r_little, l_thumb, l_index, l_middle, l_ring, l_little]);
            const affectedRows2 = result2 ? result2.affectedRows : 0;

            if(affectedRows2 != 0){
                console.log("affectedRows2: " + affectedRows2);
                affectedRows += affectedRows2;
                const sql3 = `INSERT INTO fotos
                (ID_INDIVIDUO, FOTO_ESQUERDA, FOTO_FRONTAL, FOTO_DIREITA, ESTADO) VALUES (?,?,?,?,?)`;
    
                const result3 = await query(sql3, [individual_id, l_photo, f_photo, r_photo, photoState]);
                const affectedRows3 = result3 ? result3.affectedRows : 0;

                if(affectedRows3 != 0){
                    console.log("affectedRows3: " + affectedRows3);
                    affectedRows += affectedRows3;
                }
            }
        }


        return affectedRows;
    }

    updateFull = async (individualUpdates, fingerprintUpdates, photoUpdates, individual_id) => {

        let result = {
            fieldCount : 0,
            affectedRows: 0,
            insertId: 0,
            info: "",
            serverStatus: 2,
            warningStatus: 0,
            changedRows: 0
        };

        if(Object.keys(individualUpdates).length){
            let iu = multipleColumnSet(individualUpdates)
            //console.log("individual columnSet: " + iu.columnSet);
            //console.log("individual values: " + [...iu.values]);

            const sql1 = `UPDATE individuo SET ${iu.columnSet} WHERE ID = ?`;

            const result1 = await query(sql1, [...iu.values, individual_id]);
            result.affectedRows += result1.affectedRows;
            result.changedRows += result1.changedRows;
            result.warningStatus += result1.warningStatus;
        }

        if(Object.keys(fingerprintUpdates).length){
            let fu = multipleColumnSet(fingerprintUpdates)
            //console.log("fingerprint columnSet: " + fu.columnSet);
            //console.log("fingerprint values: " + [...fu.values]);

            const sql2 = `UPDATE digitais SET ${fu.columnSet} WHERE ID_INDIVIDUO = ?`;

            const result2 = await query(sql2, [...fu.values, individual_id]);
            result.affectedRows += result2.affectedRows;
            result.changedRows += result2.changedRows;
            result.warningStatus += result2.warningStatus;
        }

        if(Object.keys(photoUpdates).length){
            let pu = multipleColumnSet(photoUpdates)
            //console.log("photo columnSet: " + pu.columnSet);
            //console.log("photo values: " + [...pu.values]);

            const sql3 = `UPDATE fotos SET ${pu.columnSet} WHERE ID= ?`;

            const result3 = await query(sql3, [...pu.values, Object.values(photoUpdates)[Object.keys(photoUpdates).indexOf("ID")] ]);
            result.affectedRows += result3.affectedRows;
            result.changedRows += result3.changedRows;
            result.warningStatus += result3.warningStatus;                                                  
        }

        //console.log("result sql: " + `${sql1}; ${sql2}; ${sql3}`);
        /*
        const finalQuery = `${sql1}; ${sql2}; ${sql3}`;

        const result = await query( finalQuery, [...iu.values, individual_id, 
                                                         ...fu.values, individual_id, 
                                                         ...pu.values, Object.values(photoUpdates)[Object.keys(photoUpdates).indexOf("ID")] ] );
        */
        result.info = `Rows matched: ${result.affectedRows}  Changed: ${result.changedRows}  Warnings: ${result.warningStatus}`;
        /*
        console.log("+++++++++++++++++++++++++");
        console.log("result");
        console.log("+++++++++++++++++++++++++");
        console.log("fieldCount: " + result.fieldCount);
        console.log("affectedRows: " + result.affectedRows);
        console.log("insertId: " + result.insertId);
        console.log("info: " + result.info);
        console.log("serverStatus: " + result.serverStatus);
        console.log("warningStatus: " + result.warningStatus);
        console.log("changedRows: " + result.changedRows);
        console.log("**************************");
        */

        return result;
    }

    deleteFull = async (id) => {
        let affectedRows = 0;

        const sql1 = `DELETE FROM digitais
        WHERE ID_INDIVIDUO = ?`;
        const result1 = await query(sql1, [id]);
        const affectedRows1 = result1 ? result1.affectedRows : 0;
        affectedRows += affectedRows1;
        const sql2 = `DELETE FROM fotos
        WHERE ID_INDIVIDUO = ?`;
        const result2 = await query(sql2, [id]);
        const affectedRows2 = result2 ? result2.affectedRows : 0;
        affectedRows += affectedRows2;
        const sql3 = `DELETE FROM individuo
        WHERE ID = ?`;
        const result3 = await query(sql3, [id]);
        const affectedRows3 = result3 ? result3.affectedRows : 0;
        affectedRows += affectedRows3;

        return affectedRows;
    }
}

module.exports = new IndividualModel;