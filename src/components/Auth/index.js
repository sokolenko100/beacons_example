const roleType = [
    { label: 'admin', value: 0 },
    { label: 'executive', value: 1 },
    { label: 'hr', value: 2 },
    { label: 'supervisor', value: 3 },
    { label: 'staff', value: 4 },
];
const roleListChecker = {
    supervisor: isSupervisor,
    staff: isStaff,
};
const roleConstantList = {
    supervisor: 'supervisor',
    staff: 'staff',
};

/**
 * check is supervisor or not
 * @return {boolean} - result
 * @param value
 * @param arr
 */
function getRole(value, arr) {

    if (!value || Number.isNaN(value)) {

        return false;

    }
    const roles = arr.filter(role => role.value == value);
    return roles.length > 0 ? roles[0].label : '';

}

/**
 * check is supervisor or not
 * @param roleArr {Array<string>} - roles array
 * @return {boolean} - result
 */
function isSupervisor(roleArr) {

    return (
        Array.isArray(roleArr) && roleArr.includes(roleConstantList.supervisor)
    );

}

/**
 * check is staff or not
 * @param roleArr {Array<string>} - roles array
 * @return {boolean} - result
 */
function isStaff(roleArr) {

    return (
        Array.isArray(roleArr) &&
        roleArr.length === 1 &&
        roleArr[0] === roleConstantList.staff
    );

}

/**
 * call different handler by role
 * @param rolesObject {Object} - roles with handler or value
 * @return {*}
 */
function Select(rolesObject, defaultValue = '') {

    if (!loginUser) {

        if (typeof defaultValue === 'function') {

            return defaultValue();

        }
        return defaultValue;

    }
    const roles = loginUser.get('roles');
    if (Number(roles) < 4) {
        return 'MainForManager';
    } else if (Number(roles) === 4) {
        return 'MainForStaff';
    }
    // return rolesObject[roles] ? rolesObject[roles] : false;
    // for (const [key, value] of Object.entries(rolesObject)) {
    //
    //     const roleStr = roleConstantList[key];
    //     const checker = roleListChecker[roleStr];
    //     if (checker(roles)) {
    //
    //         if (typeof value === 'function') {
    //
    //             value();
    //             return;
    //
    //         }
    //         return value;
    //
    //     }
    //
    // }

}

export { Select };
