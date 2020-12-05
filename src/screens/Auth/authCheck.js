import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import AsyncStorage from '@react-native-community/async-storage';
import deviceLog from 'react-native-device-log';
import StyleSheet from 'react-native-extended-stylesheet';
import SplashScreen from 'react-native-splash-screen';
import { Select } from '../../components/Auth/index';
import { convertUserFormat } from '../../utils/convertDataFormat';

@inject(['commonStore'])
@observer
class AuthCheck extends Component {

    constructor(props) {

        super(props);
        this._bootstrapAsync();
        //SplashScreen.hide();
        deviceLog.init(AsyncStorage, {
            logToConsole: true,
            logRNErrors: false,
            maxNumberToRender: 500,
            maxNumberToPersist: 500,
        })
    }

    _bootstrapAsync = async () => {
        const token = await this.props.commonStore.getLoginTokenFromStorage();
        API.get('users.currentUser', { token })
            .then(data => {
                if (data ?.status !== 200 || data ?.data ?.code !== 200) {
                    console.log('data ?.status !== 200 || data ?.data ?.code !== 200)---->>>');

                    this.props.navigation.navigate('Auth');

                } else {

                    const result = data.data;
                    const userModel = modelStore.generateModel(
                        'loginUser',
                        Object.assign({}, convertUserFormat(result.user), {
                            activityID: result.lastRecord.id,
                            roles: result.user.roleType,
                            token,
                        }),
                    );
                    global.loginUser = userModel;
                    this.props.commonStore.updateLoginState(true);
                    // this.props.navigation.navigate(
                    //     Select({
                    //         staff: 'MainForStaff',
                    //         supervisor: 'MainForManager',
                    //     }),
                    // );
                    const rolePath = Select({
                        staff: 'MainForStaff',
                        supervisor: 'MainForManager',
                    });
                    console.log('rolePath---->>>',rolePath);

                    if (rolePath) {
                        this.props.navigation.navigate(rolePath);
                    } else {

                        this.props.navigation.navigate('Auth');
                    }
                }
            })
            .catch(error => {
                tap(error);
                this.props.navigation.navigate('Auth');
            });
        // this.props.navigation.navigate(isLogin ? 'Main' : 'Auth');
    };

    render() {
        return null;
    }

}

AuthCheck.propTypes = {
    navigation: PropTypes.object,
    commonStore: PropTypes.object,
};

export default withNamespaces(['common'], { wait: true })(AuthCheck);
