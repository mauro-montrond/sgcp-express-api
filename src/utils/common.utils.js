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
        if (key === 'DATA_REGISTO') {
            return `${key} >= ?`
        }
        else if (key === 'created_at_limit') {
            return `DATA_REGISTO < ?`;
        }
        return `${key} = ?`;
    }).join(' AND ');

    return {
        columnGets,
        values
    }
}