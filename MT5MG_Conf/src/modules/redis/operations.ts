import client from './index';

 export var DataObject = {
    symbols: [],
    groups: [],
}

export const getSymbols = async (): Promise<any> => {
    const value = await client.hGet('CONF:SYMBOLS', 'ALL');
    if (value) {
        DataObject.symbols = JSON.parse(value);
        return DataObject.symbols;
    } else {
        throw new Error('CONF:SYMBOL_NAMES key not found');
    }
};

export const getGroups = async (): Promise<any> => {
    const value = await client.hGet('CONF:GROUPS', 'ALL');
    if (value) {
        DataObject.groups = JSON.parse(value);
        return DataObject.groups;
    } else {
        throw new Error('CONF:GROUPS key or ALL field not found');
    }
};

// export const getAllData = async (): Promise<any> => {
//     const symbols = await getSymbols();
//     const groups = await getGroups();
//     DataObject.symbols = symbols;
//     DataObject.groups = groups;
//     return {
//         DataObject,
//     };
// };
