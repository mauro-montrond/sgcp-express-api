exports.getNormalizedColumns = (columnsList) => {
    // conerts body keys into profile table colum names and leaves the ones that don't match as is
    normalizedColumns =[];
    columnsList.forEach(
        element => {
            if( element === "id"  )
                normalizedColumns.push("ID");
            else{
                if( element === "code" )
                    normalizedColumns.push("CODIGO");
                else{
                    if( element === "description" )
                        normalizedColumns.push("DESCRICAO");
                    else{
                        if( element === "state" )
                            normalizedColumns.push("ESTADO");
                        else{
                            if( element === "created_at" )
                                normalizedColumns.push("DATA_REGISTO");
                            else
                                normalizedColumns.push(element);
                        }
                    }
                }
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
    if( Object.keys(columnsValuesList).includes('code') )
        normalizedColumnsValues["CODIGO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("code")];
    if( Object.keys(columnsValuesList).includes('description') )
        normalizedColumnsValues["DESCRICAO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("description")];
    if( Object.keys(columnsValuesList).includes('state') )
        normalizedColumnsValues["ESTADO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("state")];
    if( Object.keys(columnsValuesList).includes('created_at') ){
        normalizedColumnsValues["DATA_REGISTO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("created_at")];
        //check if a range for dates was added
        if( Object.keys(columnsValuesList).includes('created_at_limit') )
            normalizedColumnsValues["created_at_limit"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("created_at_limit")];
        else{
            let limit_date = new Date( Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("created_at")] );
            limit_date.setDate( limit_date.getDate() + 1 );
            normalizedColumnsValues["created_at_limit"] = limit_date;
        }
    }
    return normalizedColumnsValues;
}
