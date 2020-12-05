import BaseModel from './baseModel';

class Activity extends BaseModel {
    ID = null;
    userID = null;
    checkTime = null;
    workTime = 0;
    deviceType = '';
    type = '';
    version = '';
    jobID = null;
    address = '';
    ip = '';
    location = {};
    status = '';
    pending_status: '';
    created_at=null;
    validPropList = [
        'ID',
        'userID',
        'checkTime',
        'deviceType',
        'type',
        'version',
        'jobID',
        'workTime',
        'workTimeStr',
        'ip',
        'address',
        'location',
        'status',
        'pending_status',
        'created_at',
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

    get workTimeStr() {
        const workTime = new Date(parseInt(this.workTime, 10));
        const working_time_hour = workTime.getUTCHours();
        const working_time_minute = workTime.getMinutes();
        const workTimeStr =
            this.type === 'out'
                ? [
                    working_time_hour ? `${working_time_hour}h` : '0h',
                    working_time_minute ? `${working_time_minute}m` : '0m',
                ].join(' ')
                : '';
        return workTimeStr;
    }

    getID() {
        return this.ID;
    }
}

export default Activity;
