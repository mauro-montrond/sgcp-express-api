exports.getNormalizedColumns = (columnsList) => {
    // conerts body keys into profile table colum names and leaves the ones that don't match as is
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
                case "individual_id":
                    normalizedColumns.push("ID_INDIVIDUO");
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
                case "state":
                    normalizedColumns.push("ESTADO");
                    break;
                case "date":
                    normalizedColumns.push("DATA");
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
    if( Object.keys(columnsValuesList).includes('user_id') )
        normalizedColumnsValues["ID_UTILIZADOR"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("user_id")];
    if( Object.keys(columnsValuesList).includes('individual_id') )
        normalizedColumnsValues["ID_INDIVIDUO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("individual_id")];
    if( Object.keys(columnsValuesList).includes('reference_num') )
        normalizedColumnsValues["NO_REFERENCIA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("reference_num")];
    if( Object.keys(columnsValuesList).includes('detention_reason') )
        normalizedColumnsValues["MOTIVO_DETENCAO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("detention_reason")];
    if( Object.keys(columnsValuesList).includes('destination') )
        normalizedColumnsValues["DESTINO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("destination")];
    if( Object.keys(columnsValuesList).includes('state') )
        normalizedColumnsValues["ESTADO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("state")]; 
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
