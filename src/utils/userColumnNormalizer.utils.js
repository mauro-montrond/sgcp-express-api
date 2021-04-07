exports.getNormalizedColumns = (columnsList) => {
    // conerts body keys into profile table colum names and leaves the ones that don't match as is
    normalizedColumns =[];
    columnsList.forEach(
        element => {
            if( element === "id")
                normalizedColumns.push("ID");
            else{ 
                if( element === "username" )
                    normalizedColumns.push("UTILIZADOR");
                else{
                    if( element === "name" )
                        normalizedColumns.push("NOME");
                    else{
                        if( element === "email" )
                            normalizedColumns.push("EMAIL");
                        else{
                            if( element === "profile_id" )
                                normalizedColumns.push("ID_PERFIL");
                            else{
                                if( element === "password" )
                                    normalizedColumns.push("SENHA");
                                else{
                                    if( element === "state" )
                                        normalizedColumns.push("ESTADO");
                                    else
                                        normalizedColumns.push(element);
                                }
                            }
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
    console.log("columnsValuesList: " + columnsValuesList);
    normalizedColumnsValues ={};
    if( Object.keys(columnsValuesList).includes('id') )
        normalizedColumnsValues["ID"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("id")];
    if( Object.keys(columnsValuesList).includes('username') )
        normalizedColumnsValues["UTILIZADOR"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("username")];
    if( Object.keys(columnsValuesList).includes('name') )
        normalizedColumnsValues["NOME"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("name")];
    if( Object.keys(columnsValuesList).includes('email') )
        normalizedColumnsValues["EMAIL"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("email")];
    if( Object.keys(columnsValuesList).includes('profile_id') )
        normalizedColumnsValues["ID_PERFIL"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("profile_id")];
    if( Object.keys(columnsValuesList).includes('password') )
        normalizedColumnsValues["SENHA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("password")];
    if( Object.keys(columnsValuesList).includes('confirm_password') )
        normalizedColumnsValues["confirm_password"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("confirm_password")];
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
