import { observable, action } from 'mobx';
import {
    convertJobFormat,
    convertUserFormat,
} from '../utils/convertDataFormat';
import Storage from '../utils/Storage/index';

class CommonStore {

    // job store
    @observable jobList = [];
    @observable isLoadingJobList = false;

    @action.bound
    fetchJobList(page = 1, postRefresh, endFetch, isRefresh = true) {
        this.isLoadingJobList = true;
        API.get('jobs.list', {
            params: {
                page,
            },
        })
            .then(data => {
                this.isLoadingJobList = false;
                if (
                    data?.status === 200 &&
                    data?.data?.code === 200 &&
                    Array.isArray(data?.data?.list)
                ) {
                    const { list } = data.data;
                    const newList = list.map(job => modelStore.putModel('Job', convertJobFormat(job)));
                    this.jobList = isRefresh ? newList : global.cleanData([...this.jobList, ...newList]);
                } else {
                    this.jobList = [];
                }
                const { meta } = data.data;
                if (postRefresh) {

                    postRefresh(this.jobList, meta.total);

                }
                if (endFetch) {

                    endFetch();

                }

            })
            .catch(error => {

                this.jobList = [];
                tap(error);
                if (endFetch) {

                    endFetch();

                }
                this.isLoadingJobList = false;
            })
            .finally(() => {
                if (endFetch) {

                    endFetch();

                }
                this.isLoadingJobList = false;

            });

    }

    // auth store
    @observable isLogin = false;
    @observable isLoadingLogin = false;

    @action.bound
    login({ username, password }) {

        this.isLoadingLogin = true;
        // TODO: need validation
        return API.get('users.login', {
            // data: __DEV__
            //     ? {
            //         user_name: 'test2',
            //         password: 'password',
            //     }
            //     :

            data: {
                user_name: username,
                password,
                device_token: global.deviceToken,
            },
        })
            .then(data => {
                console.log(data)
                this.isLoadingLogin = false;
                //
                if (data?.data?.code === 200) {
                    this.isLogin = true;
                    return {
                        result: true,
                        data: data.data,
                    };

                }
                return {
                    result: false,
                    data: data?.data?.message || '',
                };

            })
            .catch(error => {
                console.log(error.Response)
                this.isLoadingLogin = false;
                return {
                    result: false,
                    data: error.toString(),
                };
            });

    }

    @action.bound
    midLogin({ serial_number }) {

        this.isLoadingLogin = true;
        // TODO: need validation
        return API.get('users.midLogin', {
            // data: __DEV__
            //     ? {
            //         user_name: 'test2',
            //         password: 'password',
            //     }
            //     :

            data: {
                serial_number,
                device_token: global.deviceToken,
            },
        })
            .then(data => {

                this.isLoadingLogin = false;
                //
                if (data?.data?.code === 200) {

                    this.isLogin = true;
                    return {
                        result: true,
                        data: data.data,
                    };

                }
                return {
                    result: false,
                    data: data?.data?.message || '',
                };

            })
            .catch(error => {
                this.isLoadingLogin = false;
                return {
                    result: false,
                    data: error.toString(),
                };
            });

    }

    @action.bound
    logout() {
        const token = global.loginUser ? global.loginUser.get('token') : null;
        if (token) {
            API.get('users.logout',{data:{device_token:global.deviceToken}});
        }
        this.isLogin = false;
        global.loginUser = null;
        console.log(123)
        return Storage.loginInfo.removeAll();

    }

    @action.bound
    getLoginTokenFromStorage() {

        return Storage.loginInfo.load()
            .then(data => {

                if (typeof data?.token !== 'string') {

                    return '';

                }
                return data.token;

            });

    }

    @action.bound
    updateLoginState(loginState) {

        this.isLogin = loginState;

    }

    // staff checkout info
    @observable checkInfo = {
        workTime: 0,
        lastCheckTime: 0,
        type: 'out', // default out
    };

    @action.bound
    updateCheckInfo() {
        API.get('users.currentUser')
            .then(data => {
                if (data?.status !== 200 || data?.data?.code !== 200) {

                    tap(data);

                } else {

                    const lastRecord = data?.data?.lastRecord;
                    this.checkInfo = {
                        workTime: data?.data?.todayWorkTime ?? 0,
                        lastCheckTime: lastRecord?.check_at ?? 0, // TODO: need validate here
                        type: lastRecord?.type ?? 'out',
                    };

                }

            })
            .catch(error => {

                tap(error);
                // this.props.navigation.navigate('Auth');

            });

    }

    // user info
    @observable userList = [];
    @observable isGettingUserList = false;

    @action.bound
    getUserList(options = {}) {

        this.isGettingUserList = true;
        API.get('users.list', {
            ...options,
        })
            .then(data => {

                if (data?.status !== 200 || data?.data?.code !== 200) {

                    tap(data);

                } else {

                    const list = data?.data?.list;
                    this.userList = Array.isArray(list)
                        ? list.map(item => modelStore.putModel(
                            'User',
                            convertUserFormat(item),
                            ),
                        )
                        : [];

                }

            })
            .catch(error => {

                tap(error);
                this.userList = [];

            })
            .finally(() => {

                this.isGettingUserList = false;

            });

    }

}

const commonStore = new CommonStore();

export { commonStore };
