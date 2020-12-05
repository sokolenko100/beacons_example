// cSpell:ignore isstring
const needUtil = require('../../need/index').need;
const isString = needUtil('lodash.isstring');
const set = needUtil('lodash.set');
/**
 * decorators for inject dependence
 * @param {Array<String>} deps - dependence
 * @return {Function} - decorator function
 * @description
 * @need(["lodash","axios"])
 * class test{}
 */
function need(deps) {
    if (Array.isArray(deps)) {
        deps = deps.map(dep => loadDep(dep));
    } else {
        deps = [];
    }
    return function(target) {
        if (!target.prototype.dep) {
            target.prototype.dep = {};
        }
        deps.map(dep => {
            set(target.prototype.dep, dep.key, dep.lib);
            // target.prototype[dep.key] = dep.lib
            return dep;
        });
        return target;
    };
}
function loadDep(dep) {
    if (isString(dep)) {
        return {
            key: dep,
            lib: needUtil(dep),
        };
    }
    return null;
}
module.exports = need;
