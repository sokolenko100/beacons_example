import ActivityModel from './Activity.model';
import UserModel from './User.model';
import JobModel from './Job.model';
import LoginUserModel from './LoginUser.model';
const classList = {
    ACTIVITY: ActivityModel,
    USER: UserModel,
    JOB: JobModel,
    LOGINUSER: LoginUserModel,
};
const modelList = {
    ACTIVITY: {},
    USER: {},
    JOB: {},
};
function putModel(modelName, modelObj) {
    modelName = modelName.toUpperCase();
    const modelClass = new classList[modelName](modelObj);
    modelList[modelName][modelObj.ID] = modelClass;
    return modelClass;
}
function generateModel(modelName, modelObj) {
    modelName = modelName.toUpperCase();
    return new classList[modelName](modelObj);
}
function getModel(modelName, modelID) {
    modelName = modelName.toUpperCase();
    return modelList[modelName][modelID];
}
export default {
    putModel,
    generateModel,
    getModel,
};
