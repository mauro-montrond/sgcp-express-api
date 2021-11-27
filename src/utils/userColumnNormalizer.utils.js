exports.getNormalizedColumns = (columnsList) => {
    // conerts body keys into profile table colum names and leaves the ones that don't match as is
    normalizedColumns =[];
    columnsList.forEach(
        element => {
            switch (element) {
                case "u_id":
                    normalizedColumns.push("ID");
                    break;
                case "username":
                    normalizedColumns.push("UTILIZADOR");
                    break;
                case "name":
                    normalizedColumns.push("NOME");
                    break;
                case "email":
                    normalizedColumns.push("EMAIL");
                    break;
                case "profilePhotoFile":
                    normalizedColumns.push("AVATAR");
                    break;
                case "profile_id":
                    normalizedColumns.push("ID_PERFIL");
                    break;
                case "password":
                    normalizedColumns.push("SENHA");
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
    if( Object.keys(columnsValuesList).includes('u_id') )
        normalizedColumnsValues["ID"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("u_id")];
    if( Object.keys(columnsValuesList).includes('username') )
        normalizedColumnsValues["UTILIZADOR"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("username")];
    if( Object.keys(columnsValuesList).includes('name') )
        normalizedColumnsValues["NOME"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("name")];
    if( Object.keys(columnsValuesList).includes('email') )
        normalizedColumnsValues["EMAIL"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("email")];
    if( Object.keys(columnsValuesList).includes('profilePhotoFile') )
        normalizedColumnsValues["AVATAR"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("profilePhotoFile")];
    if( Object.keys(columnsValuesList).includes('profile_id') )
        normalizedColumnsValues["ID_PERFIL"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("profile_id")];
    if( Object.keys(columnsValuesList).includes('password') )
        normalizedColumnsValues["SENHA"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("password")];
    if( Object.keys(columnsValuesList).includes('confirm_password') )
        normalizedColumnsValues["confirm_password"] = Object.values(columnsValuesList)[Object.keys(columnsValuesList).indexOf("confirm_password")];
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
