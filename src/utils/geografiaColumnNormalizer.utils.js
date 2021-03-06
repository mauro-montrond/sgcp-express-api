exports.getNormalizedColumns = (columnsList) => {
    // conerts body keys into table colum names and leaves the ones that don't match as is
    normalizedColumns =[];
    columnsList.forEach(
        element => {
            switch (element) {
                case "id":
                    normalizedColumns.push("ID");
                    break;
                case "name":
                    normalizedColumns.push("NOME");
                    break;
                case "name_norm":
                    normalizedColumns.push("NOME_NORM");
                    break;
                case "country":
                    normalizedColumns.push("PAIS");
                    break;
                case "island":
                    normalizedColumns.push("ILHA");
                    break;
                case "county":
                    normalizedColumns.push("CONCELHO");
                    break;
                case "parish":
                    normalizedColumns.push("FREGUESIA");
                    break;
                case "district":
                    normalizedColumns.push("ZONA");
                    break;
                case "detail_level":
                    normalizedColumns.push("NIVEL_DETALHE");
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
    if( Object.keys(columnsValuesList).includes('name') )
        normalizedColumnsValues["NOME"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("name")];
    if( Object.keys(columnsValuesList).includes('name_norm') )
        normalizedColumnsValues["NOME_NORM"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("name_norm")];
    if( Object.keys(columnsValuesList).includes('country') )
        normalizedColumnsValues["PAIS"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("country")];
    if( Object.keys(columnsValuesList).includes('island') )
        normalizedColumnsValues["ILHA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("island")];
    if( Object.keys(columnsValuesList).includes('county') )
        normalizedColumnsValues["CONCELHO"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("county")];
    if( Object.keys(columnsValuesList).includes('parish') )
        normalizedColumnsValues["FREGUESIA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("parish")];
    if( Object.keys(columnsValuesList).includes('district') )
        normalizedColumnsValues["ZONA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("district")];
    if( Object.keys(columnsValuesList).includes('detail_level') )
        normalizedColumnsValues["NIVEL_DETALHE"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("detail_level")];
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
