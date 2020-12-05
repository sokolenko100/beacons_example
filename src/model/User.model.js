import BaseModel from './baseModel';
class User extends BaseModel {

    ID = null;
    username = '';
    email = '';
    firstName = '';
    lastName = '';
    type = '';
    ex = null;
    position = '';
    taskID = '';
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
    ];
    get fullName() {

        return `${this.firstName} ${this.lastName}`;

    }
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

}
export default User;
