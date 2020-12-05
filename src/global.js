import { tap } from '@incpad/base-tool/tools/debug';
import { need, addAdapter } from '@incpad/need';
import lodashAdapter from './utils/lodash.adapter';
import API from './utils/API';
import modelStore from './model/index';
import ASY from './utils/Async';
import deviceLog from './utils/Log'
import cleanData from './utils/cleanData';
import cleanObject from './utils/cleanObject';
import { Platform, Dimensions } from 'react-native';

addAdapter(lodashAdapter);
global.tap = tap;
global.need = need;
global.config = require('./config').default;
global.skin = require('./theme/default').default;
global.API = API;
global.ASY = ASY;
global.deviceLog = deviceLog.Log;
global.LOG_PATH = deviceLog.LOG_PATH;
global.cleanData = cleanData;
global.cleanObject = cleanObject;
global.isIos = Platform.OS === 'ios';
global.modelStore = modelStore;
global.loginUser = null;
global.deviceToken = null;
global.Symbol = require('core-js/es6/symbol');
global.getFullName = function (user) {
    if (!user) {
        return '';
    }
    if (user.firstName) {

        return `${user.firstName} ${user.lastName}`;

    }
    return `${user.first_name} ${user.last_name}`;

};
global.uuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
global.getStatusIcon = function (status) {
    if (status !== 'success') {
        return 'md-warning';
    }
    return 'md-checkmark';
};
global.adapt = (Dimensions.get('window').width) / 375;
require('core-js/fn/symbol/iterator');
require('core-js/fn/map');
require('core-js/fn/set');
require('core-js/fn/array/find');
export default global;
