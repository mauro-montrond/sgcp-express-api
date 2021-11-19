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
                case "l_photo":
                    normalizedColumns.push("FOTO_ESQUERDA");
                    break;
                case "l_photoFile":
                    normalizedColumns.push("FOTO_ESQUERDA");
                    break;
                case "f_photo":
                    normalizedColumns.push("FOTO_FRONTAL");
                    break;
                case "f_photoFile":
                    normalizedColumns.push("FOTO_FRONTAL");
                    break;
                case "r_photo":
                    normalizedColumns.push("FOTO_DIREITA");
                    break;
                case "r_photoFile":
                    normalizedColumns.push("FOTO_DIREITA");
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
    // converts body {key: value} pairs into {profile table column: value}
    normalizedColumnsValues ={};
    if( Object.keys(columnsValuesList).includes('id') )
        normalizedColumnsValues["ID"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("id")];
    if( Object.keys(columnsValuesList).includes('individual_id') )
        normalizedColumnsValues["ID_INDIVIDUO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_id")];
    if( Object.keys(columnsValuesList).includes('l_photo') )
        normalizedColumnsValues["FOTO_ESQUERDA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("l_photo")];
    if( Object.keys(columnsValuesList).includes('f_photo') )
        normalizedColumnsValues["FOTO_FRONTAL"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("f_photo")];
    if( Object.keys(columnsValuesList).includes('r_photo') )
        normalizedColumnsValues["FOTO_DIREITA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("r_photo")];
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
