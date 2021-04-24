exports.getNormalizedColumns = (columnsList) => {
    // conerts body keys into table colum names and leaves the ones that don't match as is
    normalizedColumns =[];
    columnsList.forEach(
        element => {
            switch (element) {
                case "id":
                    normalizedColumns.push("ID");
                    break;
                case "user_id":
                    normalizedColumns.push("ID_UTILIZADOR");
                    break;
                case "name":
                    normalizedColumns.push("NOME");
                    break;
                case "nickname":
                    normalizedColumns.push("ALCUNHA");
                    break;
                case "father":
                    normalizedColumns.push("PAI");
                    break;
                case "mother":
                    normalizedColumns.push("MAE");
                    break;
                case "nationality":
                    normalizedColumns.push("NACIONALIDADE");
                    break;
                case "birthplace":
                    normalizedColumns.push("LOCAL_NASCIMENTO");
                    break;
                case "birthdate":
                    normalizedColumns.push("DATA_NASCIMENTO");
                    break;
                case "apparent_age":
                    normalizedColumns.push("IDADE_APARENTE");
                    break;
                case "marital_status":
                    normalizedColumns.push("ESTADO_CIVIL");
                    break;
                case "profession":
                    normalizedColumns.push("PROFISSAO");
                    break;
                case "residence_id":
                    normalizedColumns.push("ID_RESIDENCIA");
                    break;
                case "workplace":
                    normalizedColumns.push("LOCAL_TRABALHO");
                    break;
                case "doc_num":
                    normalizedColumns.push("NUM_DOC");
                    break;
                case "doc_issuance_date":
                    normalizedColumns.push("DATA_EMISSAO_DOC");
                    break;
                case "doc_issuance_place":
                    normalizedColumns.push("LOCAL_EMISSAO_DOC");
                    break;
                case "height":
                    normalizedColumns.push("ALTURA");
                    break;
                case "hair":
                    normalizedColumns.push("CABELO");
                    break;
                case "beard":
                    normalizedColumns.push("BARBA");
                    break;
                case "nose":
                    normalizedColumns.push("NARIZ");
                    break;
                case "mouth":
                    normalizedColumns.push("BOCA");
                    break;
                case "face":
                    normalizedColumns.push("ROSTO");
                    break;
                case "colour":
                    normalizedColumns.push("COR");
                    break;
                case "tattoos":
                    normalizedColumns.push("TATUAGENS");
                    break;
                case "police_classification":
                    normalizedColumns.push("CLASSIFICACAO_POLICIAL");
                    break;
                case "state":
                    normalizedColumns.push("ESTADO");
                    break;
                case "created_at":
                    normalizedColumns.push("DATA_REGISTO");
                    break;
                default:
                    normalizedColumns.push(element);
            }
        }
    );
    return normalizedColumns;
}

exports.getNormalizedColumnsValues = (columnsValuesList) => {
    // converts body {key: value} pairs into {table column: value}
    normalizedColumnsValues ={};
    if( Object.keys(columnsValuesList).includes('id') )
        normalizedColumnsValues["ID"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("id")];
    if( Object.keys(columnsValuesList).includes('user_id') )
        normalizedColumnsValues["ID_UTILIZADOR"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("user_id")];
    if( Object.keys(columnsValuesList).includes('name') )
        normalizedColumnsValues["NOME"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("name")];
    if( Object.keys(columnsValuesList).includes('nickname') )
        normalizedColumnsValues["ALCUNHA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("nickname")];
    if( Object.keys(columnsValuesList).includes('father') )
        normalizedColumnsValues["PAI"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("father")];
    if( Object.keys(columnsValuesList).includes('mother') )
        normalizedColumnsValues["MAE"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("mother")];
    if( Object.keys(columnsValuesList).includes('nationality') )
        normalizedColumnsValues["NACIONALIDADE"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("nationality")];
    if( Object.keys(columnsValuesList).includes('birthplace') )
        normalizedColumnsValues["LOCAL_NASCIMENTO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("birthplace")];    
    if( Object.keys(columnsValuesList).includes('birthdate_range') && 
        Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("birthdate_range")] === 'yes' ){
            if( !Object.keys(columnsValuesList).includes('birthdate_limit') ){
                let limit_date = new Date();
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["birthdate_limit"] = limit_date;
            }
            else
                normalizedColumnsValues["birthdate_limit"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("birthdate_limit")];
            if( !Object.keys(columnsValuesList).includes('birthdate') ){
                let limit_date = new Date('1900-01-01');
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["DATA_NASCIMENTO"] = limit_date;
            }
            else
                normalizedColumnsValues["DATA_NASCIMENTO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("birthdate")];

    }
    else if( Object.keys(columnsValuesList).includes('birthdate') ){
        normalizedColumnsValues["DATA_NASCIMENTO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("birthdate")];
        let limit_date = new Date( Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("birthdate")] );
        limit_date.setDate( limit_date.getDate() + 1 );
        normalizedColumnsValues["birthdate_limit"] = limit_date;
    }
    if( Object.keys(columnsValuesList).includes('apparent_age_range') && 
        Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("apparent_age_range")] === 'yes' ){
            if( !Object.keys(columnsValuesList).includes('apparent_age_limit') ){
                let limit_age = 1000;
                normalizedColumnsValues["apparent_age_limit"] = limit_age;
            }
            else
                normalizedColumnsValues["apparent_age_limit"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("apparent_age_limit")];
            if( !Object.keys(columnsValuesList).includes('apparent_age') ){
                let limit_age = 0;
                normalizedColumnsValues["IDADE_APARENTE"] = limit_age;
            }
            else
                normalizedColumnsValues["IDADE_APARENTE"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("apparent_age")];

    }
    else if( Object.keys(columnsValuesList).includes('apparent_age') ){
        normalizedColumnsValues["IDADE_APARENTE"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("apparent_age")];
        let limit_age = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("apparent_age")];
        limit_age = limit_age + 1 ;
        normalizedColumnsValues["apparent_age_limit"] = limit_age;
    }
    if( Object.keys(columnsValuesList).includes('marital_status') )
        normalizedColumnsValues["ESTADO_CIVIL"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("marital_status")];
    if( Object.keys(columnsValuesList).includes('profession') )
        normalizedColumnsValues["PROFISSAO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("profession")];
    if( Object.keys(columnsValuesList).includes('residence_id') )
        normalizedColumnsValues["ID_RESIDENCIA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("residence_id")];
    if( Object.keys(columnsValuesList).includes('workplace') )
        normalizedColumnsValues["LOCAL_TRABALHO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("workplace")];
    if( Object.keys(columnsValuesList).includes('doc_num') )
        normalizedColumnsValues["NUM_DOC"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("doc_num")];
    if( Object.keys(columnsValuesList).includes('doc_issuance_date_range') && 
        Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("doc_issuance_date_range")] === 'yes' ){
            if( !Object.keys(columnsValuesList).includes('doc_issuance_date_limit') ){
                let limit_date = new Date();
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["doc_issuance_date_limit"] = limit_date;
            }
            else
                normalizedColumnsValues["doc_issuance_date_limit"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("doc_issuance_date_limit")];
            if( !Object.keys(columnsValuesList).includes('doc_issuance_date') ){
                let limit_date = new Date('1900-01-01');
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["DATA_EMISSAO_DOC"] = limit_date;
            }
            else
                normalizedColumnsValues["DATA_EMISSAO_DOC"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("doc_issuance_date")];

    }
    else if( Object.keys(columnsValuesList).includes('doc_issuance_date') ){
        normalizedColumnsValues["DATA_EMISSAO_DOC"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("doc_issuance_date")];
        let limit_date = new Date( Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("doc_issuance_date")] );
        limit_date.setDate( limit_date.getDate() + 1 );
        normalizedColumnsValues["doc_issuance_date_limit"] = limit_date;
    }
    if( Object.keys(columnsValuesList).includes('doc_issuance_place') )
        normalizedColumnsValues["LOCAL_EMISSAO_DOC"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("doc_issuance_place")];
    
    if( Object.keys(columnsValuesList).includes('height_range') && 
        Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("height_range")] === 'yes' ){
            if( !Object.keys(columnsValuesList).includes('height_limit') ){
                let limit_date = 10000;
                normalizedColumnsValues["height_limit"] = limit_date;
            }
            else
                normalizedColumnsValues["height_limit"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("height_limit")];
            if( !Object.keys(columnsValuesList).includes('height') ){
                let limit_date = 0;
                normalizedColumnsValues["ALTURA"] = limit_date;
            }
            else
                normalizedColumnsValues["ALTURA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("height")];

    }
    else if( Object.keys(columnsValuesList).includes('height') ){
        normalizedColumnsValues["ALTURA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("height")];
        let limit_date = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("height")];
        limit_date = limit_date + 1 ;
        normalizedColumnsValues["height_limit"] = limit_date;
    }
    if( Object.keys(columnsValuesList).includes('hair') )
        normalizedColumnsValues["CABELO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("hair")];
    if( Object.keys(columnsValuesList).includes('beard') )
        normalizedColumnsValues["BARBA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("beard")];
    if( Object.keys(columnsValuesList).includes('nose') )
        normalizedColumnsValues["NARIZ"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("nose")];
    if( Object.keys(columnsValuesList).includes('mouth') )
        normalizedColumnsValues["BOCA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("mouth")];
    if( Object.keys(columnsValuesList).includes('face') )
        normalizedColumnsValues["ROSTO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("face")];
    if( Object.keys(columnsValuesList).includes('colour') )
        normalizedColumnsValues["COR"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("colour")];
    if( Object.keys(columnsValuesList).includes('tattoos') )
        normalizedColumnsValues["TATUAGENS"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("tattoos")];
    if( Object.keys(columnsValuesList).includes('police_classification') )
        normalizedColumnsValues["CLASSIFICACAO_POLICIAL"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("police_classification")];
    if( Object.keys(columnsValuesList).includes('state') )
        normalizedColumnsValues["ESTADO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("state")];
    if( Object.keys(columnsValuesList).includes('created_at_range') && 
        Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("created_at_range")] === 'yes' ){
            if( !Object.keys(columnsValuesList).includes('created_at_limit') ){
                let limit_date = new Date();
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["created_at_limit"] = limit_date;
            }
            else
                normalizedColumnsValues["created_at_limit"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("created_at_limit")];
            if( !Object.keys(columnsValuesList).includes('created_at') ){
                let limit_date = new Date('1900-01-01');
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["DATA_REGISTO"] = limit_date;
            }
            else
                normalizedColumnsValues["DATA_REGISTO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("created_at")];

    }
    else if( Object.keys(columnsValuesList).includes('created_at') ){
        normalizedColumnsValues["DATA_REGISTO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("created_at")];
        let limit_date = new Date( Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("created_at")] );
        limit_date.setDate( limit_date.getDate() + 1 );
        normalizedColumnsValues["created_at_limit"] = limit_date;
    }

    return normalizedColumnsValues;
}
