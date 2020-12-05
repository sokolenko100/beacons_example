// const validator = require('fastest-validator');
let v = null,
    schemaListG = {};
const compiledCheckerCache = {};
//-----------------------------------------
// do init
function initValidatorWithFile(schemaPath) {
    return true
}

function initValidatorWithObject(schemaObject) {
    return true
}

function initCheckerSchema(checkerName) {
    return true
}

//-----------------------------------------
//get checker
function getChecker(checkerName) {
    // initCheckerSchema(checkerName);
    // return compiledCheckerCache[checkerName];
    return true
}

//-----------------------------------------
//exported checker
/**
 * check the validation of the desc.json
 * @param {String} checkerName - checkerName
 * @param {*} target - desc object
 * @returns {*} - the result
 */
function Validator(checkerName, target) {
    // return getChecker(checkerName)(target);
    return true
}

function checkFuncParam(schemaName, paramObject) {
    const result = Validator(schemaName, paramObject);
    if (result !== true) {
        throw new Error('function params type not valid');
    }
}

module.exports = {
    Validator,
    initValidatorWithFile,
    initValidatorWithObject,
    checkFuncParam,
};
