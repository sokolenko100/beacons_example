import axios from 'axios';
import config from '../config/index';

const { serverConfig } = config;
const getProp = require('lodash.get');

function get(apiName, extra = { subPath: '', data: null, params: null }) {
    const info = getProp(serverConfig.route, apiName);
    const options = {
        url: `${serverConfig.server}${info.path}${extra.subPath || ''}`,
        method: info.method,
        headers: {
            token: global.loginUser ? global.loginUser.get('token') : null,
        },
        validateStatus: function (status) {
            console.log('status: ', status);
            // debugger
            return status >= 200 && status < 600;
        },
    };
    if (extra.data) {
        options.data = extra.data;

    }
    if (extra.params) {
        options.params = extra.params;

    }
    if (extra.token) {

        options.headers.token = extra.token;

    }
    return axios(options);

}

export default { get };
