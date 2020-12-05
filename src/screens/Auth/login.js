/* eslint-disable id-length */
import React, { Component } from 'react';
import { BackHandler, Text, View, Keyboard } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { observer, inject } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
import { Button, Snackbar } from 'react-native-paper';
import HeaderD from '../../decorators/header.decorator';
import Storage from '../../utils/Storage/index';
import { Select } from '../../components/Auth/index';
import NormalFloatInput from '../../components/Input/NormalFloatInput';
import SplashScreen from 'react-native-splash-screen';
// svg file
import LogoSvg from '../../assets/svg/logoSvg.svg';
import FigLogo from '../../assets/svg/FigLogo.svg';
import { convertUserFormat } from '../../utils/convertDataFormat';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const mainWith = skin.$screenWidth - skin.$doubleNormalPadding * 4;

@HeaderD()
@inject('commonStore', 'beaconIndexStore')
@observer
class Login extends Component {

    username = '';
    password = '';
    passwordInput = null;

    constructor(props) {

        super(props);
        SplashScreen.hide();
        this.keyboardDidShowListener = null;
        this.keyboardDidHideListener = null;
        this.state = {
            scrollEnabled: false,
            errorMsg: '',
        };
        props.beaconIndexStore.setBeaconType('login');
    }

    async componentDidMount() {
        await this.props.beaconIndexStore.checkPermission();
        this.props.beaconIndexStore.addListener('beaconsDidRangelogin', info => {
            // if (info.beacons.length) {
                // const beacon = info.beacons[0];
                // this.props.beaconIndexStore.FetchDoCheck(beacon, (SerialNumber) => this.midLogin(SerialNumber));
            // }
        });
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);
        setTimeout(() => {
            this.props.beaconIndexStore.start();
        }, 1000);
        const res = await GetLocation();
        console.log(res);
    }

    _keyboardWillShow = () => {
        this.setState({ scrollEnabled: true });
    };

    _keyboardWillHide = () => {
        this.setState({ scrollEnabled: false });
    };

    componentWillUnmount() {
        this.props.beaconIndexStore.setBeaconType('activity');
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
        if (this.keyboardDidShowListener && this.keyboardDidHideListener) {
            this.keyboardDidShowListener.remove();
            this.keyboardDidHideListener.remove();
        }
    }

    onBackPress = () => {
    };

    doLogin = () => {

        this.props.commonStore
            .login({
                username: this.username,
                password: this.password,
            })
            .then(result => {
                if (result.result) {

                    const { data } = result;
                    const userModel = modelStore.generateModel(
                        'loginUser',
                        Object.assign({}, convertUserFormat(data.user), {
                            roles: data.user.roleType,
                            token: data.token,
                        }),
                    );
                    global.loginUser = userModel;
                    Storage.loginInfo.save(global.loginUser);
                    const rolePath = Select({
                        staff: 'MainForStaff',
                        supervisor: 'MainForManager',
                    });
                    if (rolePath) {

                        this.props.navigation.navigate(rolePath);

                    } else {

                        this.setState({
                            errorMsg: `You don't have permission to login`,
                        });

                    }

                } else {

                    this.setState({
                        errorMsg: result.data,
                    });

                }

            });

    };

    midLogin = (SerialNumber) => {
        // this.props.commonStore
        //     .midLogin({
        //         serial_number: SerialNumber,
        //     })
        //     .then(result => {
        //         if (result.result) {
        //
        //             const { data } = result;
        //             const userModel = modelStore.generateModel(
        //                 'loginUser',
        //                 Object.assign({}, convertUserFormat(data.user), {
        //                     roles: data.user.roleType,
        //                     token: data.token,
        //                 }),
        //             );
        //             global.loginUser = userModel;
        //             Storage.loginInfo.save(global.loginUser);
        //             const rolePath = Select({
        //                 staff: 'MainForStaff',
        //                 supervisor: 'MainForManager',
        //             });
        //             if (rolePath) {
        //
        //                 this.props.navigation.navigate(rolePath);
        //
        //             } else {
        //
        //                 this.setState({
        //                     errorMsg: `You don't have permission to login`,
        //                 });
        //
        //             }
        //
        //         } else {
        //
        //             this.setState({
        //                 errorMsg: result.data,
        //             });
        //
        //         }
        //
        //     })
        //     .catch(error => {
        //
        //         tap(error);
        //
        //     });
    };

    render() {

        const { username, password } = this;
        const {
            t,
            commonStore: { isLoadingLogin },
        } = this.props;
        const { errorMsg, scrollEnabled } = this.state;
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView scrollEnabled={scrollEnabled} showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <LogoSvg
                            width={220}
                            height={57}
                            style={{ marginTop: 80 }}
                        />
                        {/*                 <Text style={styles.tipText}>SWIPE</Text>
                        <FigLogo
                            width={180}
                            height={90}
                            style={{
                                marginTop:
                                    (skin.$doubleNormalMargin / 732) *
                                    skin.$screenHeight,
                            }}
                        />
                        <Text style={styles.tipText}>OR LOGIN</Text>*/}

                        <View style={styles.borderLayer}>
                            <NormalFloatInput
                                label={'USERNAME'}
                                value={username}
                                style={{
                                    backgroundColor: 'transparent',
                                }}
                                color={skin.$white}
                                onChangeText={username => {
                                    this.username = username;
                                }}
                                onSubmitEditing={() => {
                                    if (this.passwordInput) {
                                        this.passwordInput.focus();
                                    }
                                }}
                                containerStyle={{
                                    width: mainWith,
                                    marginTop:
                                        (skin.$doubleNormalMargin / 732) *
                                        skin.$screenHeight,
                                }}
                            />
                            <NormalFloatInput
                                label={'PASSWORD'}
                                value={password}
                                _ref={(e) => this.passwordInput = e}
                                style={{
                                    backgroundColor: 'transparent',
                                    // backgroundColor: 'yellow',
                                }}
                                color={skin.$white}
                                secureTextEntry={true}
                                onChangeText={password => {

                                    tap(password);
                                    this.password = password;

                                }}
                                containerStyle={{
                                    width: mainWith,
                                    marginTop:
                                        (skin.$doubleNormalMargin / 732) *
                                        skin.$screenHeight,
                                }}
                                onSubmitEditing={() => this.doLogin()}
                            />

                            <Button
                                mode="contained"
                                color={skin.$deepGreen}
                                style={styles.button}
                                loading={isLoadingLogin}
                                onPress={this.doLogin}
                            >
                                <Text style={styles.buttonText}>
                                    {t('loginButtonLabel')}
                                </Text>
                            </Button>
                        </View>
                        <Snackbar
                            visible={!!errorMsg}
                            onDismiss={() => this.setState({ errorMsg: '' })
                            }
                            theme={{
                                colors: {
                                    background: '#ffffff',
                                    text: 'black',
                                },
                            }}
                        >
                            {errorMsg}
                        </Snackbar>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );

    }

}

Login.propTypes = {
    navigation: PropTypes.object,
    commonStore: PropTypes.object,
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '$screenHeight',
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '$darkerBlue',
    },
    errMsg: {
        marginTop: '$normalMargin',
        color: 'red',
    },
    button: {
        width: mainWith,
        marginTop: ((skin.$normalMargin * 3) / 732) * skin.$screenHeight,
        height: (48 / 732) * skin.$screenHeight,
        color: '$white',
        justifyContent: 'center',
    },
    OrSwipeLogin: {
        width: mainWith,
        marginTop: '$doubleNormalMargin',
    },
    OrSwipeLoginText: {
        color: '$white',
    },
    OrSwipeLoginSvg: {
        width: mainWith,
    },
    tipText: {
        color: 'white',
        fontSize: 22,
        marginTop: ((skin.$doubleNormalPadding * 1) / 732) * skin.$screenHeight,
    },
    borderLayer: {
        borderWidth: 1,
        borderColor: '#979797',
        borderRadius: 4,
        marginTop: (skin.$doubleNormalPadding / 732) * skin.$screenHeight + 134,
        // margin: skin.$doubleNormalPadding / 732 * skin.$screenHeight,
        height: (280 / 732) * skin.$screenHeight,
        padding: (skin.$doubleNormalPadding, skin.$normalPadding),
        display: 'flex',
        alignItems: 'center',
    },
});
export default withNamespaces(['AuthLogin', 'common'], { wait: true })(Login);
