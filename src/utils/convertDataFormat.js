const userFormat = {
    ID: 'id',
    username: 'user_name',
    email: 'email',
    firstName: 'first_name',
    lastName: 'last_name',
    type: 'type',
    ex: 'ex',
    position: 'position',
    taskID: 'task_id',
};
const ActivityFormat = {
    ID: 'id',
    checkTime: 'check_at',
    status: 'status',
    ex: 'ex',
    userID: 'user_id',
    taskID: 'task_id',
    jobID: 'job_id',
    deviceID: 'device_id',
    deviceType: 'device_type',
    type: 'type',
    version: 'version',
    workTime: 'work_time',
    ip: 'ip',
    address: 'address',
    location: 'location',
    pending_status: 'pending_status',
    created_at: 'created_at',
};
const JobFormat = {
    address: 'address',
    contact_id: 'contact_id',
    created_at: 'created_at',
    endDate: 'ended_date',
    ex: 'ex',
    ID: 'id',
    location: 'location',
    name: 'name',
    notes: 'notes',
    ruleID: 'rule_id',
    startedDate: 'started_date',
    type: 'type',
    updated_at: 'updated_at',
    contact: 'contact',
    tasks: 'tasks',
    crews: 'crews',
    job_code: 'job_code',
};

const TaskFormat = {
    id: 'id',
    title: 'title',
    ex: 'ex',
    created_at: 'created_at',
    updated_at: 'updated_at',
    job_id: 'job_id',
};

function convertUserFormat(serverUserObj) {

    if (serverUserObj === null) {

        return {};

    }
    const temp = {};
    for (const [localKey, serverKey] of Object.entries(userFormat)) {

        temp[localKey] = serverUserObj[serverKey];

    }
    return temp;

}

function convertActivityFormat(serverActivityObj) {

    if (serverActivityObj === null) {

        return {};

    }
    const temp = {};
    for (const [localKey, serverKey] of Object.entries(ActivityFormat)) {

        temp[localKey] = serverActivityObj[serverKey];

    }
    return temp;

}

function convertJobFormat(serverJobObj) {

    if (serverJobObj === null) {

        return {};

    }
    const temp = {};
    for (const [localKey, serverKey] of Object.entries(JobFormat)) {
        temp[localKey] = serverJobObj[serverKey];
    }
    return temp;

}

function convertTaskFormat(taskObj) {

    if (taskObj === null) {

        return {};

    }
    const temp = {};
    for (const [localKey, serverKey] of Object.entries(TaskFormat)) {

        temp[localKey] = taskObj[serverKey];

    }
    return temp;

}

export {
    convertUserFormat,
    convertActivityFormat,
    convertJobFormat,
    convertTaskFormat,
};
