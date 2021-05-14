exports.getNormalizedColumns = (columnsList) => {
    // conerts body keys into table colum names and leaves the ones that don't match as is
    normalizedColumns =[];
    columnsList.forEach(
        element => {
            switch (element) {
                case "individual_id":
                    normalizedColumns.push("ID_INDIVIDUO");
                    break;
                case "individual_name":
                    normalizedColumns.push("NOME_INDIVIDUO");
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
                case "doc_num":
                    normalizedColumns.push("NUM_DOC");
                    break;
                case "doc_issuance_date":
                    normalizedColumns.push("DATA_EMISSAO_DOC");
                    break;
                case "doc_issuance_place":
                    normalizedColumns.push("LOCAL_EMISSAO_DOC");
                    break;
                case "marital_status":
                    normalizedColumns.push("ESTADO_CIVIL");
                    break;
                case "profession":
                    normalizedColumns.push("PROFISSAO");
                    break;
                case "workplace":
                    normalizedColumns.push("LOCAL_TRABALHO");
                    break;
                // location
                case "residence_id":
                    normalizedColumns.push("ID_RESIDENCIA");
                    break;
                case "district_id":
                    normalizedColumns.push("ID_ZONA");
                    break;
                case "parish_id":
                    normalizedColumns.push("ID_FREGUESIA");
                    break;
                case "county_id":
                    normalizedColumns.push("ID_CONCELHO");
                    break;
                case "island":
                    normalizedColumns.push("ILHA");
                    break;
                case "country":
                    normalizedColumns.push("PAIS");
                    break;
                // phisical description
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
                case "individualState":
                    normalizedColumns.push("ESTADO_INDIVIDUO");
                    break;
                case "individual_created_at":
                    normalizedColumns.push("DATA_REGISTO_INDIVIDUO");
                    break;
                // individual register
                case "individual_register_id":
                    normalizedColumns.push("ID_CADASTRANTE_INDIVIDUO");
                    break;
                case "individual_register_name":
                    normalizedColumns.push("NOME_CADASTRANTE_INDIVIDUO");
                    break;
                case "individual_register_email":
                    normalizedColumns.push("EMAIL_CADASTRANTE_INDIVIDUO");
                    break;
                case "individual_register_profile":
                    normalizedColumns.push("PERFIL_CADASTRANTE_INDIVIDUO");
                    break;
                case "individual_register_created_at":
                    normalizedColumns.push("DATA_REGISTO_CADASTRANTE_INDIVIDUO");
                    break;
                case "individual_register_state":
                    normalizedColumns.push("ESTADO_CADASTRANTE_INDIVIDUO");
                    break;
                // fingerprint
                case "fingerprint_id":
                    normalizedColumns.push("ID_DIGITAIS");
                    break;
                case "r_thumb":
                    normalizedColumns.push("POLEGAR_DIREITO");
                    break;
                case "r_index":
                    normalizedColumns.push("INDICADOR_DIREITO");
                    break;
                case "r_middle":
                    normalizedColumns.push("MEDIO_DIREITO");
                    break;
                case "r_ring":
                    normalizedColumns.push("ANELAR_DIREITO");
                    break;
                case "r_little":
                    normalizedColumns.push("MINDINHO_DIREITO");
                    break;
                case "l_thumb":
                    normalizedColumns.push("POLEGAR_ESQUERDO");
                    break;
                case "l_index":
                    normalizedColumns.push("INDICADOR_ESQUERDO");
                    break;
                case "l_middle":
                    normalizedColumns.push("MEDIO_ESQUERDO");
                    break;
                case "l_ring":
                    normalizedColumns.push("ANELAR_ESQUERDO");
                    break;
                case "l_little":
                    normalizedColumns.push("MINDINHO_ESQUERDO");
                    break;
                case "fingerprint_created_at":
                    normalizedColumns.push("DATA_REGISTO_DIGITAIS");
                    break;
                // photo
                case "photo_id":
                    normalizedColumns.push("ID_FOTOS");
                    break;
                case "l_photo":
                    normalizedColumns.push("FOTO_ESQUERDA");
                    break;
                case "f_photo":
                    normalizedColumns.push("FOTO_FRONTAL");
                    break;
                case "r_photo":
                    normalizedColumns.push("FOTO_DIREITA");
                    break;
                case "photoState":
                    normalizedColumns.push("ESTADO_FOTOS");
                    break;
                case "photo_created_at":
                    normalizedColumns.push("DATA_REGISTO_FOTOS");
                    break;
                // precedent
                case "precedent_id":
                    normalizedColumns.push("ID_ANTECEDENTE");
                    break;
                case "reference_num":
                    normalizedColumns.push("NO_REFERENCIA");
                    break;
                case "detention_reason":
                    normalizedColumns.push("MOTIVO_DETENCAO");
                    break;
                case "destination":
                    normalizedColumns.push("DESTINO");
                    break;
                case "date":
                    normalizedColumns.push("DATA");
                    break;
                case "precedentState":
                    normalizedColumns.push("ESTADO_ANTECEDENTE");
                    break;
                case "precedent_created_at":
                    normalizedColumns.push("DATA_REGISTO_ANTECEDENTE");
                    break;
                // precedent register
                case "precedent_register_id":
                    normalizedColumns.push("ID_CADASTRANTE_ANTECEDENTE");
                    break;
                case "precedent_register_name":
                    normalizedColumns.push("NOME_CADASTRANTE_ANTECEDENTE");
                    break;
                case "precedent_register_email":
                    normalizedColumns.push("EMAIL_CADASTRANTE_ANTECEDENTE");
                    break;
                case "precedent_register_profile":
                    normalizedColumns.push("PERFIL_CADASTRANTE_INDIVIDUO");
                    break;
                case "precedent_register_created_at":
                    normalizedColumns.push("DATA_REGISTO_CADASTRANTE_ANTECEDENTE");
                    break;
                case "precedent_register_state":
                    normalizedColumns.push("ESTADO_CADASTRANTE_ANTECEDENTE");
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
    if( Object.keys(columnsValuesList).includes('individual_id') )
        normalizedColumnsValues["ID_INDIVIDUO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_id")];
    if( Object.keys(columnsValuesList).includes('individual_name') )
        normalizedColumnsValues["NOME_INDIVIDUO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_name")];
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
    if( Object.keys(columnsValuesList).includes('marital_status') )
        normalizedColumnsValues["ESTADO_CIVIL"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("marital_status")];
    if( Object.keys(columnsValuesList).includes('profession') )
        normalizedColumnsValues["PROFISSAO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("profession")];
    if( Object.keys(columnsValuesList).includes('workplace') )
        normalizedColumnsValues["LOCAL_TRABALHO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("workplace")];
    // location
    if( Object.keys(columnsValuesList).includes('residence_id') )
        normalizedColumnsValues["ID_RESIDENCIA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("residence_id")];
    if( Object.keys(columnsValuesList).includes('district_id') )
        normalizedColumnsValues["ID_ZONA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("district_id")];
    if( Object.keys(columnsValuesList).includes('parish_id') )
        normalizedColumnsValues["ID_FREGUESIA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("parish_id")];
    if( Object.keys(columnsValuesList).includes('county_id') )
        normalizedColumnsValues["ID_CONCELHO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("county_id")];
    if( Object.keys(columnsValuesList).includes('island') )
        normalizedColumnsValues["ILHA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("island")];
    if( Object.keys(columnsValuesList).includes('country') )
        normalizedColumnsValues["PAIS"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("country")];
    // phisical description    
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
    if( Object.keys(columnsValuesList).includes('individualState') )
        normalizedColumnsValues["ESTADO_INDIVIDUO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individualState")];
    if( Object.keys(columnsValuesList).includes('individual_created_at_range') && 
        Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_created_at_range")] === 'yes' ){
            if( !Object.keys(columnsValuesList).includes('individual_created_at_limit') ){
                let limit_date = new Date();
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["individual_created_at_limit"] = limit_date;
            }
            else
                normalizedColumnsValues["individual_created_at_limit"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_created_at_limit")];
            if( !Object.keys(columnsValuesList).includes('individual_created_at') ){
                let limit_date = new Date('1900-01-01');
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["DATA_REGISTO_INDIVIDUO"] = limit_date;
            }
            else
                normalizedColumnsValues["DATA_REGISTO_INDIVIDUO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_created_at")];

    }
    else if( Object.keys(columnsValuesList).includes('individual_created_at') ){
        normalizedColumnsValues["DATA_REGISTO_INDIVIDUO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_created_at")];
        let limit_date = new Date( Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_created_at")] );
        limit_date.setDate( limit_date.getDate() + 1 );
        normalizedColumnsValues["individual_created_at_limit"] = limit_date;
    }
    // individual register
    if( Object.keys(columnsValuesList).includes('individual_register_id') )
        normalizedColumnsValues["ID_CADASTRANTE_INDIVIDUO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_register_id")];
    if( Object.keys(columnsValuesList).includes('individual_register_name') )
        normalizedColumnsValues["NOME_CADASTRANTE_INDIVIDUO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_register_name")];
    if( Object.keys(columnsValuesList).includes('individual_register_email') )
        normalizedColumnsValues["EMAIL_CADASTRANTE_INDIVIDUO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_register_email")];
    if( Object.keys(columnsValuesList).includes('individual_register_profile') )
        normalizedColumnsValues["PERFIL_CADASTRANTE_INDIVIDUO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_register_profile")];
    if( Object.keys(columnsValuesList).includes('individual_register_state') )
        normalizedColumnsValues["ESTADO_CADASTRANTE_INDIVIDUO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_register_state")];
    if( Object.keys(columnsValuesList).includes('individual_register_created_at_range') && 
        Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_register_created_at_range")] === 'yes' ){
            if( !Object.keys(columnsValuesList).includes('individual_register_created_at_limit') ){
                let limit_date = new Date();
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["individual_register_created_at_limit"] = limit_date;
            }
            else
                normalizedColumnsValues["individual_register_created_at_limit"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_register_created_at_limit")];
            if( !Object.keys(columnsValuesList).includes('individual_register_created_at') ){
                let limit_date = new Date('1900-01-01');
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["ESTADO_CADASTRANTE_INDIVIDUO"] = limit_date;
            }
            else
                normalizedColumnsValues["ESTADO_CADASTRANTE_INDIVIDUO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_register_created_at")];

    }
    else if( Object.keys(columnsValuesList).includes('individual_register_created_at') ){
        normalizedColumnsValues["ESTADO_CADASTRANTE_INDIVIDUO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_register_created_at")];
        let limit_date = new Date( Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_register_created_at")] );
        limit_date.setDate( limit_date.getDate() + 1 );
        normalizedColumnsValues["individual_register_created_at_limit"] = limit_date;
    }
    // fingerprint
    if( Object.keys(columnsValuesList).includes('fingerprint_id') )
        normalizedColumnsValues["ID_DIGITAIS"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("fingerprint_id")];
    if( Object.keys(columnsValuesList).includes('r_thumb') )
        normalizedColumnsValues["POLEGAR_DIREITO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("r_thumb")];
    if( Object.keys(columnsValuesList).includes('r_index') )
        normalizedColumnsValues["INDICADOR_DIREITO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("r_index")];
    if( Object.keys(columnsValuesList).includes('r_middle') )
        normalizedColumnsValues["MEDIO_DIREITO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("r_middle")];
    if( Object.keys(columnsValuesList).includes('r_ring') )
        normalizedColumnsValues["ANELAR_DIREITO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("r_ring")];
    if( Object.keys(columnsValuesList).includes('r_little') )
        normalizedColumnsValues["MINDINHO_DIREITO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("r_little")];
    if( Object.keys(columnsValuesList).includes('l_thumb') )
        normalizedColumnsValues["POLEGAR_ESQUERDO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("l_thumb")];
    if( Object.keys(columnsValuesList).includes('l_index') )
        normalizedColumnsValues["INDICADOR_ESQUERDO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("l_index")];
    if( Object.keys(columnsValuesList).includes('l_middle') )
        normalizedColumnsValues["MEDIO_ESQUERDO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("l_middle")];
    if( Object.keys(columnsValuesList).includes('l_ring') )
        normalizedColumnsValues["ANELAR_ESQUERDO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("l_ring")];
    if( Object.keys(columnsValuesList).includes('l_little') )
        normalizedColumnsValues["MINDINHO_ESQUERDO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("l_little")];
    if( Object.keys(columnsValuesList).includes('fingerprint_created_at_range') && 
        Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("fingerprint_created_at_range")] === 'yes' ){
            if( !Object.keys(columnsValuesList).includes('fingerprint_created_at_limit') ){
                let limit_date = new Date();
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["fingerprint_created_at_limit"] = limit_date;
            }
            else
                normalizedColumnsValues["fingerprint_created_at_limit"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("fingerprint_created_at_limit")];
            if( !Object.keys(columnsValuesList).includes('created_at') ){
                let limit_date = new Date('1900-01-01');
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["DATA_REGISTO_DIGITAIS"] = limit_date;
            }
            else
                normalizedColumnsValues["DATA_REGISTO_DIGITAIS"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("created_at")];

    }
    else if( Object.keys(columnsValuesList).includes('fingerprint_created_at') ){
        normalizedColumnsValues["DATA_REGISTO_DIGITAIS"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("fingerprint_created_at")];
        let limit_date = new Date( Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("fingerprint_created_at")] );
        limit_date.setDate( limit_date.getDate() + 1 );
        normalizedColumnsValues["fingerprint_created_at_limit"] = limit_date;
    }
    // photos
    if( Object.keys(columnsValuesList).includes('photo_id') )
        normalizedColumnsValues["ID_FOTOS"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("photo_id")];
    if( Object.keys(columnsValuesList).includes('l_photo') )
        normalizedColumnsValues["FOTO_ESQUERDA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("l_photo")];
    if( Object.keys(columnsValuesList).includes('f_photo') )
        normalizedColumnsValues["FOTO_FRONTAL"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("f_photo")];
    if( Object.keys(columnsValuesList).includes('r_photo') )
        normalizedColumnsValues["FOTO_DIREITA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("r_photo")];
    if( Object.keys(columnsValuesList).includes('photoState') )
        normalizedColumnsValues["ESTADO_FOTOS"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("photoState")]; 
    if( Object.keys(columnsValuesList).includes('photo_created_at_range') && 
        Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("photo_created_at_range")] === 'yes' ){
            if( !Object.keys(columnsValuesList).includes('photo_created_at_limit') ){
                let limit_date = new Date();
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["photo_created_at_limit"] = limit_date;
            }
            else
                normalizedColumnsValues["photo_created_at_limit"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("photo_created_at_limit")];
            if( !Object.keys(columnsValuesList).includes('photo_created_at') ){
                let limit_date = new Date('1900-01-01');
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["DATA_REGISTO_FOTOS"] = limit_date;
            }
            else
                normalizedColumnsValues["DATA_REGISTO_FOTOS"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("photo_created_at")];

    }
    else if( Object.keys(columnsValuesList).includes('photo_created_at') ){
        normalizedColumnsValues["DATA_REGISTO_FOTOS"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("photo_created_at")];
        let limit_date = new Date( Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("photo_created_at")] );
        limit_date.setDate( limit_date.getDate() + 1 );
        normalizedColumnsValues["photo_created_at_limit"] = limit_date;
    }
    // precedent
    if( Object.keys(columnsValuesList).includes('precedent_id') )
        normalizedColumnsValues["ID"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("precedent_id")];
    if( Object.keys(columnsValuesList).includes('reference_num') )
        normalizedColumnsValues["NO_REFERENCIA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("reference_num")];
    if( Object.keys(columnsValuesList).includes('detention_reason') )
        normalizedColumnsValues["MOTIVO_DETENCAO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("detention_reason")];
    if( Object.keys(columnsValuesList).includes('destination') )
        normalizedColumnsValues["DESTINO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("destination")];
    if( Object.keys(columnsValuesList).includes('precedentState') )
        normalizedColumnsValues["ESTADO_ANTECEDENTE"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("precedentState")]; 
    if( Object.keys(columnsValuesList).includes('date_range') && 
        Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("date_range")] === 'yes' ){
            if( !Object.keys(columnsValuesList).includes('date_limit') ){
                let limit_date = new Date();
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["date_limit"] = limit_date;
            }
            else
                normalizedColumnsValues["date_limit"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("date_limit")];
            if( !Object.keys(columnsValuesList).includes('date') ){
                let limit_date = new Date('1900-01-01');
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["DATA"] = limit_date;
            }
            else
                normalizedColumnsValues["DATA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("date")];

    }
    else if( Object.keys(columnsValuesList).includes('date') ){
        normalizedColumnsValues["DATA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("date")];
        let limit_date = new Date( Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("date")] );
        limit_date.setDate( limit_date.getDate() + 1 );
        normalizedColumnsValues["date_limit"] = limit_date;
    } 
    if( Object.keys(columnsValuesList).includes('precedent_created_at_range') && 
        Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("precedent_created_at_range")] === 'yes' ){
            if( !Object.keys(columnsValuesList).includes('precedent_created_at_limit') ){
                let limit_date = new Date();
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["precedent_created_at_limit"] = limit_date;
            }
            else
                normalizedColumnsValues["precedent_created_at_limit"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("precedent_created_at_limit")];
            if( !Object.keys(columnsValuesList).includes('precedent_created_at') ){
                let limit_date = new Date('1900-01-01');
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["DATA_REGISTO_ANTECEDENTE"] = limit_date;
            }
            else
                normalizedColumnsValues["DATA_REGISTO_ANTECEDENTE"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("precedent_created_at")];

    }
    else if( Object.keys(columnsValuesList).includes('precedent_created_at') ){
        normalizedColumnsValues["DATA_REGISTO_ANTECEDENTE"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("precedent_created_at")];
        let limit_date = new Date( Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("created_at")] );
        limit_date.setDate( limit_date.getDate() + 1 );
        normalizedColumnsValues["precedent_created_at_limit"] = limit_date;
    }
    // precedent register
    if( Object.keys(columnsValuesList).includes('precedent_register_id') )
        normalizedColumnsValues["ID_CADASTRANTE_ANTECEDENTE"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("precedent_register_id")];
    if( Object.keys(columnsValuesList).includes('precedent_register_name') )
        normalizedColumnsValues["NOME_CADASTRANTE_ANTECEDENTE"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("precedent_register_name")];
    if( Object.keys(columnsValuesList).includes('precedent_register_email') )
        normalizedColumnsValues["EMAIL_CADASTRANTE_ANTECEDENTE"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("precedent_register_email")];
    if( Object.keys(columnsValuesList).includes('precedent_register_profile') )
        normalizedColumnsValues["PERFIL_CADASTRANTE_ANTECEDENTE"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("precedent_register_profile")];
    if( Object.keys(columnsValuesList).includes('precedent_register_state') )
        normalizedColumnsValues["ESTADO_CADASTRANTE_ANTECEDENTE"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("precedent_register_state")];
    if( Object.keys(columnsValuesList).includes('precedent_register_created_at_range') && 
        Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("precedent_register_created_at_range")] === 'yes' ){
            if( !Object.keys(columnsValuesList).includes('precedent_register_created_at_limit') ){
                let limit_date = new Date();
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["precedent_register_created_at_limit"] = limit_date;
            }
            else
                normalizedColumnsValues["precedent_register_created_at_limit"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("precedent_register_created_at_limit")];
            if( !Object.keys(columnsValuesList).includes('precedent_register_created_at') ){
                let limit_date = new Date('1900-01-01');
                limit_date.setDate( limit_date.getDate() + 1 );
                normalizedColumnsValues["ESTADO_CADASTRANTE_ANTECEDENTE"] = limit_date;
            }
            else
                normalizedColumnsValues["ESTADO_CADASTRANTE_ANTECEDENTE"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("precedent_register_created_at")];

    }
    else if( Object.keys(columnsValuesList).includes('precedent_register_created_at') ){
        normalizedColumnsValues["ESTADO_CADASTRANTE_ANTECEDENTE"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("precedent_register_created_at")];
        let limit_date = new Date( Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("precedent_register_created_at")] );
        limit_date.setDate( limit_date.getDate() + 1 );
        normalizedColumnsValues["precedent_register_created_at_limit"] = limit_date;
    }

    return normalizedColumnsValues;
}
