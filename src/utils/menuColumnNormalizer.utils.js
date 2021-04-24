exports.getNormalizedColumns = (columnsList) => {
    // conerts body keys into table colum names and leaves the ones that don't match as is
    normalizedColumns =[];
    columnsList.forEach(
        element => {
            switch (element) {
                case "id":
                    normalizedColumns.push("ID");
                    break;
                case "code":
                    normalizedColumns.push("CODIGO");
                    break;
                case "description":
                    normalizedColumns.push("DESCRICAO");
                    break;
                case "parent_menu":
                    normalizedColumns.push("ID_MENU_PAI");
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
    if( Object.keys(columnsValuesList).includes('code') )
        normalizedColumnsValues["CODIGO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("code")];
    if( Object.keys(columnsValuesList).includes('description') )
        normalizedColumnsValues["DESCRICAO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("description")];
    if( Object.keys(columnsValuesList).includes('parent_menu') )
        normalizedColumnsValues["ID_MENU_PAI"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("parent_menu")];
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
