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
                case "table":
                    normalizedColumns.push("TABELA");
                    break;
                case "object_id":
                    normalizedColumns.push("ID_OBJECTO");
                    break;
                case "previous_value":
                    normalizedColumns.push("VALOR_ANTIGO");
                    break
                case "new_value":
                    normalizedColumns.push("VALOR_NOVO");
                    break;
                case "action":
                    normalizedColumns.push("ACAO");
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
    if( Object.keys(columnsValuesList).includes('table') )
        normalizedColumnsValues["TABELA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("table")];
    if( Object.keys(columnsValuesList).includes('object_id') )
        normalizedColumnsValues["ID_OBJECTO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("object_id")];
    if( Object.keys(columnsValuesList).includes('previous_value') )
        normalizedColumnsValues["VALOR_ANTIGO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("previous_value")];
    if( Object.keys(columnsValuesList).includes('new_value') )
        normalizedColumnsValues["VALOR_NOVO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("new_value")];
    if( Object.keys(columnsValuesList).includes('action') )
        normalizedColumnsValues["ACAO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("action")]; 
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
