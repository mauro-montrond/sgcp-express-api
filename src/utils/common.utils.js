exports.getPlaceholderStringForArray = (arr) => {
    if (!Array.isArray(arr)) {
        throw new Error('Invalid input');
    }

    // if is array, we'll clone the arr 
    // and fill the new array with placeholders
    const placeholders = [...arr];
    return placeholders.fill('?').join(', ').trim();
}


exports.multipleColumnSet = (object) => {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }

    const keys = Object.keys(object);
    const values = Object.values(object);

    columnSet = keys.map(key => `${key} = ?`).join(', ');

    return {
        columnSet,
        values
    }
}

exports.multipleColumnGets = (object) => {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }

    const keys = Object.keys(object);
    const values = Object.values(object);

    columnGets = keys.map(key => {
        if (key === 'DATA') {
            return `${key} >= ?`
        }
        else if (key === 'date_limit') {
            return `DATA < ?`;
        }
        else if (key === 'DATA_REGISTO') {
            return `${key} >= ?`
        }
        else if (key === 'created_at_limit') {
            return `DATA_REGISTO < ?`;
        }
        else if (key === 'DATA_REGISTO_INDIVIDUO') {
            return `${key} >= ?`
        }
        else if (key === 'individual_created_at_limit') {
            return `DATA_REGISTO_INDIVIDUO < ?`;
        }
        else if (key === 'DATA_REGISTO_DIGITAIS') {
            return `${key} >= ?`
        }
        else if (key === 'fingerprint_created_at_limit') {
            return `DATA_REGISTO_DIGITAIS < ?`;
        }
        else if (key === 'DATA_REGISTO_FOTOS') {
            return `${key} >= ?`
        }
        else if (key === 'photo_created_at_limit') {
            return `DATA_REGISTO_FOTOS < ?`;
        }
        else if (key === 'DATA_REGISTO_CADASTRANTE_INDIVIDUO') {
            return `${key} >= ?`
        }
        else if (key === 'individual_register_created_at_limit') {
            return `DATA_REGISTO_CADASTRANTE_INDIVIDUO < ?`;
        }
        else if (key === 'DATA_REGISTO_ANTECEDENTE') {
            return `${key} >= ?`
        }
        else if (key === 'precedent_created_at_limit') {
            return `DATA_REGISTO_ANTECEDENTE < ?`;
        }
        else if (key === 'DATA_REGISTO_CADASTRANTE_ANTECEDENTE') {
            return `${key} >= ?`
        }
        else if (key === 'precedent_register_created_at_limit') {
            return `DATA_REGISTO_CADASTRANTE_ANTECEDENTE < ?`;
        }
        else if (key === 'DATA_NASCIMENTO') {
            return `DATA_NASCIMENTO >= ?`;
        }
        else if (key === 'birthdate_limit') {
            return `DATA_NASCIMENTO < ?`;
        }
        else if (key === 'DATA_EMISSAO_DOC') {
            return `DATA_EMISSAO_DOC >= ?`;
        }
        else if (key === 'doc_issuance_date_limit') {
            return `DATA_EMISSAO_DOC < ?`;
        }
        else if (key === 'ALTURA') {
            return `ALTURA >= ?`;
        }
        else if (key === 'height_limit') {
            return `ALTURA < ?`;
        }
        else if (key === 'IDADE_APARENTE') {
            return `IDADE_APARENTE >= ?`;
        }
        else if (key === 'apparent_age_limit') {
            return `IDADE_APARENTE < ?`;
        }
        else
            return `${key} = ?`;
    }).join(' AND ');

    return {
        columnGets,
        values
    }
}

exports.multipleRowInsert = (object) => {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }
    let keys =[];
    let values =[];
    
    object.forEach(element => {
        for (const [key, value] of Object.entries(element)) {
            //console.log(`${key}: ${value}`);
            keys.push(key);
            values.push(value);
        }
    });

    columnGets = keys.map(key => {
        if (key === 'ID_PERFIL') {
            return `(?`
        }
        else if (key === 'ESTADO') {
            return `?)`;
        }
        return `?`;
    }).join(', ');

    return {
        columnGets,
        values
    }
}

exports.multipleRowOrSetter = (object) => {
    if (typeof object !== 'object') {
        throw new Error('Invalid input');
    }
    let keys =[];
    let valuesOr =[];
    
    object.forEach(element => {
        for (const [key, value] of Object.entries(element)) {
            keys.push(key);
            valuesOr.push(value);
        }
    });
    /*
    elite_columnGets = keys.map(key => {
        if (key === 'ID_PERFIL') {
            return `(${key} = ?`
        }
        else if (key === 'ID_MENU') {
            return ` ${key} = ?)`;
        }
        return `${key} = ?`;
    }).join(
        (key ==`${key} = ?)`) ? ' OR ': ' AND '
    );
    console.log("elite_columGets: " + elite_columnGets);
    */
    old_columnGets = keys.map(key => {
        if (key === 'ID_PERFIL') {
            return `(${key} = ?`
        }
        else if (key === 'ID_MENU') {
            return ` ${key} = ?)`;
        }
        return `${key} = ?`;
    }).join(' AND ');
    let re = /\) AND \(/gi;
    let rowsOr = old_columnGets.replace(re, ') OR (');

    return {
        rowsOr,
        valuesOr
    }
}