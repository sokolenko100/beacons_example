import BaseModel from './baseModel';
class LoginUser extends BaseModel {
    ID = null;
    username = '';
    email = '';
    firstName = '';
    lastName = '';
    type = '';
    ex = null;
    position = '';
    taskID = '';
    token = '';
    roles = [];
    validPropList = [
        'ID',
        'username',
        'email',
        'firstName',
        'lastName',
        'type',
        'ex',
        'position',
        'taskID',
        'fullName',
        'token',
        'roles',
        'isStaff',
    ];

    handleInitFunc = {};
    constructor(props) {
        super();
        // TODO: need do validate
        this.validPropList.map(validPropName => {
            const handleFunc = this.handleInitFunc[validPropName];
            if (handleFunc) {
                this[validPropName] = handleFunc(props[validPropName]);
            } else {
                this[validPropName] = props[validPropName];
            }
        });
    }
    getID() {
        return this.ID;
    }
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    get isStaff() {
        return this.roles.length === 1 && this.roles[0] === 'staff';
    }
}
export default LoginUser;
