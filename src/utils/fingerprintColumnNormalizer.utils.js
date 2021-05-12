exports.getNormalizedColumns = (columnsList) => {
    // conerts body keys into profile table colum names and leaves the ones that don't match as is
    normalizedColumns =[];
    columnsList.forEach(
        element => {
            switch (element) {
                case "id":
                    normalizedColumns.push("ID");
                    break;
                case "individual_id":
                    normalizedColumns.push("ID_INDIVIDUO");
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
    // converts body {key: value} pairs into {profile table column: value}
    normalizedColumnsValues ={};
    if( Object.keys(columnsValuesList).includes('id') )
        normalizedColumnsValues["ID"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("id")];
    if( Object.keys(columnsValuesList).includes('individual_id') )
        normalizedColumnsValues["ID_INDIVIDUO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_id")];
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
