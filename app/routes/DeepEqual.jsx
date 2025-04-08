export const DeepEqual = (obj1, obj2) => {
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return obj1 === obj2;
    }
    if (obj1 === null || obj2 === null) {
        return obj1 === obj2;
    }
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        if (obj1.length !== obj2.length) {
            return false;
        }
        for (let i = 0; i < obj1.length; i++) {
            if (!DeepEqual(obj1[i], obj2[i])) {
                return false;
            }
        }
        return true;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        if (!keys2.includes(key) || !DeepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }
    return true;
}