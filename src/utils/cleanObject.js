export default function cleanObject(obj) {
    for (const o in obj) {
        if ((!obj[o] && obj[o] !== 0) || (Array.isArray(obj[o]) && obj[o].length <= 0)) {
            delete obj[o];
        }
    }
}
