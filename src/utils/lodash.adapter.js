const mods = {
    'lodash.get': require('lodash.get'),
};
function getLodashMod(moduleName) {

    return mods[moduleName];

}
export default {
    tester: moduleName => {

        if (moduleName.startsWith('lodash.')) {

            return true;

        }
        return false;

    },
    getMod: moduleName => getLodashMod(moduleName),
};
