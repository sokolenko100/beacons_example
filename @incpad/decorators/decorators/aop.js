/**
 * do AOP for class method
 * @param {Object} options - options
 * @return {Function} - decorator function
 * @example
 * @AOP({
 *  beforeFunc:()=>{},
 *  afterFunc:()=>{}
 * })
 * classMethodA=()=>{}
 */
function AOP(options) {
    const { beforeFunc, afterFunc } = Object.assign(
        {
            beforeFunc: () => {},
            afterFunc: () => {},
        },
        options
    );
    return function(target, key, descriptor) {
        const oldTarget = descriptor.value;
        descriptor.value = function(...args) {
            beforeFunc.apply(this, args);
            const value = oldTarget.apply(this, args);
            afterFunc.apply(this, args);
            return value;
        };
        return descriptor;
    };
}
module.exports = AOP;
