/* eslint-disable id-length */
import React, { Component } from 'react';
import { View, Text, BackHandler } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { observer, inject } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
import HeaderD from '../../decorators/header.decorator';
import SplashScreen from 'react-native-splash-screen';
import {
    Button,
    Card,
    Modal,
    Portal,
    Snackbar,
    IconButton,
} from 'react-native-paper';
import NormalTimer from '../../components/Timer/NormalTimer';
import Icon from 'react-native-vector-icons/Ionicons';
import format from 'date-fns/format';
import getHours from 'date-fns/get_hours';
import getMinute from 'date-fns/get_minutes';
import { getSeconds } from 'date-fns';
import GetLocation from '../../utils/GetLocation';
import DeviceInfo from 'react-native-device-info';
import NotifService from '../../utils/NotifService';

@HeaderD({
    left: 'Time Clock',
    title: 'null',
    right: 'Time',
})
@inject('activityIndexStore', 'commonStore', 'beaconIndexStore')
@observer
class Index extends Component {

    constructor(props) {

        super(props);
        SplashScreen.hide();
        this.state = {
            loading: false,
            errorMsg: '',
            visible: false,
            data: null,
            checkLoading: false,
            job: {},
        };
        this.props.commonStore.updateCheckInfo();

    }

    async componentDidMount() {
        // if (global.loginUser.roles === '4') {
        //     this.notif = new NotifService(this._onRegister, this._onNotification.bind(this));
        //     await this.props.beaconIndexStore.checkPermission();
        //     this.props.beaconIndexStore.addListener('beaconsDidRangeactivity', info => {
        //         info.beacons.map(item => {
        //             this.props.beaconIndexStore.FetchDoCheck(item, (SerialNumber) => this.deviceCheck(SerialNumber));
        //         });
        //     });
        //     setTimeout(() => {
        //         this.props.beaconIndexStore.start();
        //     }, 1000);
        // }
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    componentWillUnmount() {

        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);

    }

    deviceCheck = async (SerialNumber) => {
        const others = {
            device_type: 'device',
        };
        const _geo = await GetLocation();
        const ip = await DeviceInfo.getIpAddress();
        if (!_geo || _geo.errorMsg) {
            if (_geo.errorMsg) {
                this.setState({ errorMsg: _geo.errorMsg });
            }
        } else {
            try {
                others.address = _geo[0].formattedAddress;
                others.location = _geo[0];
            } catch (e) {
                console.log(e);
            }
        }
        if (ip) {
            others.ip = ip;
        }
        deviceLog.log('Parameters of the device request check-in http API: ', {
            data: {
                serial_number: SerialNumber,
                ...others,
            },
        });
        API.get('users.deviceCheck', {
            data: {
                serial_number: SerialNumber,
                ...others,
            },
        })
            .then(data => {
                deviceLog.log('http API return data:', data);
                this.setState({ checkLoading: false });
                if (data?.data?.code !== 200) {

                    tap(data?.data);
                    this.setState({
                        errorMsg: data?.data?.message,
                    });
                    return;

                }
                this.setState(
                    {
                        data: data?.data,
                        job: data?.data.job,
                    },
                    () => {

                        this._showModal();

                    },
                );
                this.props.commonStore.updateCheckInfo();
            })
            .catch(error => {
                deviceLog.info('The check-in http API an error', error);
            });

    };


    onBackPress = () => {
    };

    doCheck = async () => {

        this.setState({ checkLoading: true });
        const others = {};
        const _geo = await GetLocation();
        const ip = await DeviceInfo.getIpAddress();
        if (!_geo || _geo.errorMsg) {
            if (_geo.errorMsg) {
                this.setState({ errorMsg: _geo.errorMsg });
            }
        } else {
            try {
                others.address = _geo[0].formattedAddress;
                others.location = _geo[0];
            } catch (e) {
                console.log(e);
            }
        }
        if (ip) {
            others.ip = ip;
        }
        // const jobID = this.props.navigation.getParam('jobID');
        API.get('users.myCheckIn', {
            data: {
                device_type: 'phone',
                ...others,
            },
        })
            .then(data => {
                this.setState({ checkLoading: false });
                if (data?.data?.code !== 200) {

                    tap(data?.data);
                    this.setState({
                        errorMsg: data?.data?.message,
                    });
                    return;

                }
                this.setState(
                    {
                        data: data?.data,
                        job: data?.data.job,
                    },
                    () => {

                        this._showModal();

                    },
                );
                this.props.commonStore.updateCheckInfo();

            })
            .catch(error => {

                this.setState({
                    errorMsg: 'user not found',
                    checkLoading: false,
                });

            });

    };

    jumpToCheck = () => {

        this.props.navigation.navigate('CheckInOutIndex');

    };

    _showModal = () => this.setState({ visible: true });

    _hideModal = () => this.setState({ visible: false });

    editTimeStamp = () => {
        this._hideModal();
        this.props.navigation.navigate('EditActivity', { record_id: this.state.data.record?.id });
    };

    renderJobInfo = (job, data) => {

        if (data && data.record) {

            return (
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginTop: skin.$normalPadding,
                    }}
                >
                    {job ? <Text
                        numberOfLines={1}
                        style={{
                            fontSize: 14,
                            color: skin.$deepGray,
                            textAlign: 'center',
                        }}
                    >
                        {job.name}
                    </Text> : null}
                    {job ? <Text
                        numberOfLines={3}
                        style={{
                            fontSize: 14,
                            color: skin.$deepGreen,
                            textAlign: 'center',
                        }}
                    >
                        {job.address || (data.record.address ? data.record.address : '')}
                    </Text> : null}
                </View>
            );

        }
        return null;

    };

    render() {

        const {
            workTime,
            lastCheckTime,
            type,
        } = this.props.commonStore.checkInfo;
        const { data, checkLoading, errorMsg, job } = this.state;
        const fullName = data && data.user ? global.getFullName(data.user) : '';
        return (
            <View style={styles.container}>
                <NormalTimer startTime={lastCheckTime.toString()}>
                    <Info
                        workTime={workTime}
                        lastCheckTime={lastCheckTime}
                        type={type}
                    />
                </NormalTimer>
                <Button
                    mode="contained"
                    color={type === 'in' ? skin.$red : skin.$deepGreen}
                    style={styles.button}
                    loading={checkLoading}
                    onPress={this.doCheck}
                >
                    <Text style={styles.buttonText}>
                        {type === 'in' ? 'CHECK OUT' : 'CHECK IN'}
                    </Text>
                </Button>
                <View style={styles.orView}>
                    <View style={styles.line}/>
                    <Text style={styles.or}>OR</Text>
                    <View style={styles.line}/>
                </View>
                <Button
                    mode="outlined"
                    color={'#12378a'}
                    style={[
                        styles.button,
                        {
                            borderColor: '#12378a',
                            borderWidth: 1,
                            marginTop: 50,
                        },
                    ]}
                    onPress={this.jumpToCheck}
                >
                    <Text style={[styles.buttonText, { color: '#12378a' }]}>
                        Guest Check In/Out
                    </Text>
                </Button>
                <Snackbar
                    visible={!!errorMsg}
                    onDismiss={() => this.setState({ errorMsg: '' })}
                    theme={{
                        colors: {
                            background: '#ffffff',
                            text: 'black',
                        },
                    }}
                >
                    {errorMsg}
                </Snackbar>
                <Portal>
                    <Modal
                        visible={this.state.visible}
                        onDismiss={this._hideModal}
                    >
                        <Card style={{ width: 300, alignSelf: 'center' }}>
                            <Card.Content
                                style={{
                                    backgroundColor: skin.white,
                                    height: 350,
                                    padding: skin.$doubleNormalPadding,
                                    justifyContent: 'center',
                                }}
                            >
                                <IconButton
                                    icon="close"
                                    size={30}
                                    color={skin.$darkGrey}
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: 0,
                                    }}
                                    onPress={this._hideModal}
                                />
                                <View style={styles.successIcon}>
                                    <Icon
                                        name={global.getStatusIcon(data?.record?.status)}
                                        size={60}
                                        color={global.getStatusIcon(data?.record?.status) !== 'md-checkmark' ? skin.$yellow
                                            : skin.$lightGreen
                                        }
                                    />
                                </View>
                                <View style={styles.successText}>
                                    <Text
                                        style={{
                                            color: skin.$grayIcon,
                                            fontSize: 22,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {`${fullName}
                                         checked ${
                                            data?.record?.type
                                            } at ${format(
                                            data?.record?.check_at,
                                            'hh:mm a',
                                        )}.`}
                                    </Text>
                                    {this.renderJobInfo(job,data)}
                                    <View
                                        style={{
                                            width: '100%',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Button
                                            mode="contained"
                                            color={skin.$deepGreen}
                                            style={[
                                                styles.buttonEdit,
                                                {
                                                    width: 130,
                                                    height: 40,
                                                },
                                            ]}
                                            onPress={this.editTimeStamp}
                                        >
                                            <Text
                                                style={[
                                                    styles.buttonTextEdit,
                                                    {
                                                        lineHeight: 20,
                                                    },
                                                ]}
                                            >
                                                EDIT STAMP
                                            </Text>
                                        </Button>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    </Modal>
                </Portal>
            </View>
        );

    }

}

Index.propTypes = {
    navigation: PropTypes.object,
    activityIndexStore: PropTypes.object,
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '$white',
        paddingBottom: 0,
    },
    flatList: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '$grey',
    },
    button: {
        width: skin.$screenWidth - skin.$doubleNormalMargin * 2,
        marginTop: 100,
        height: 60,
        color: '$white',
        justifyContent: 'center',
    },
    buttonEdit: {
        width: '100%',
        marginTop: '$normalMargin * 2',
        height: 60,
        color: '$white',
        justifyContent: 'center',
    },
    buttonTextEdit: {
        lineHeight: 40,
        marginVertical: 0,
    },
    buttonText: {
        lineHeight: 40,
        marginVertical: 0,
        fontSize: 20,
        color: '$white',
    },
    successIcon: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successText: {
        justifyContent: 'center',
    },
    orView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 50,
        width: skin.$screenWidth - skin.$doubleNormalMargin * 2,
    },
    line: {
        width: (skin.$screenWidth - skin.$doubleNormalMargin * 2) / 3,
        height: 1,
        backgroundColor: '#c4c4c4',
        marginTop: 10,
    },
    or: {
        textAlign: 'center',
        fontSize: 16,
        color: '#c4c4c4',
    },
});

class Info extends Component {

    formatTotalTime = nowTime => {

        const { workTime } = this.props;
        const nowNTime = new Date().getTime();
        const nowSeconds =
            (getHours(nowNTime) * 60 * 60 +
                getMinute(nowNTime) * 60 +
                getSeconds(nowNTime)) *
            1000;
        // workTime = parseInt(workTime, 10) + (1000 * 60 * 60 * 24).toString(); // for test
        const time = new Date(parseInt(workTime, 10) + nowTime);
        const totalSec = time >= nowSeconds ? nowSeconds : time;
        const hours = Math.floor(
            new Date(totalSec).getTime() / (60 * 60 * 1000),
        );
        const seconds = new Date(totalSec).getUTCSeconds();
        const minutes = new Date(totalSec).getUTCMinutes();
        return {
            minutes,
            seconds,
            hours,
        };

    };

    formatCheckerTime = () => {

        const { lastCheckTime, timerCount, type } = this.props;
        if (type === 'out') {

            return {
                total: this.formatTotalTime(0),
                now: {
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                },
            };

        }
        const startTime =
            new Date().getTime() -
            new Date(parseInt(lastCheckTime, 10)).getTime();
        const time = new Date(startTime);
        const hours = Math.floor(time.getTime() / (60 * 60 * 1000));
        const minutes = time.getUTCMinutes();
        // const minutes = Math.floor(time.getTime() / (60 * 1000));
        const seconds = time.getUTCSeconds();
        return {
            total: this.formatTotalTime(time.getTime()),
            now: {
                hours,
                minutes,
                seconds,
            },
        };

    };

    renderHour = hours => {

        if (hours === 0) {

            return;

        }
        return (
            <Text style={{ fontSize: 30 }}>
                {hours}
                <Text style={{ fontSize: 20 }}>h </Text>
            </Text>
        );

    };

    renderMinute = minute => {

        if (minute === 0) {

            return;

        }
        return (
            <Text style={{ fontSize: 30 }}>
                {minute}
                <Text style={{ fontSize: 20 }}>m</Text>
            </Text>
        );

    };

    render() {

        const { total, now } = this.formatCheckerTime();
        const { type } = this.props;
        const style =
            type === 'out'
                ? {
                    width: '100%',
                    // height: 60,
                    backgroundColor: skin.$grey,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }
                : {
                    width: '100%',
                    // height: 60,
                    backgroundColor: skin.$deepGreen,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                };
        const headerTextColor =
            type === 'out'
                ? {
                    color: skin.$lightGray,
                }
                : {
                    color: skin.$white,
                };
        const contentTextColor =
            type === 'out'
                ? {
                    color: skin.$deepGray,
                }
                : {
                    color: skin.$white,
                };
        return (
            <View style={style}>
                <View
                    style={{
                        // width: 130,
                        alignItems: 'flex-start',
                        padding: skin.$doubleNormalPadding,
                    }}
                >
                    <Text style={[{ fontSize: 14 }, headerTextColor]}>
                        DAY TOTAL
                    </Text>
                    <Text style={[{ fontSize: 16 }, contentTextColor]}>
                        {total.hours}h {total.minutes}m {total.seconds}s
                    </Text>
                </View>
                {type === 'in' ? (
                    <View
                        style={{
                            // width: 150,
                            alignItems: 'flex-end',
                            padding: skin.$doubleNormalPadding,
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: skin.$white,
                            }}
                        >
                            {this.renderHour(now.hours)}
                            {this.renderMinute(now.minutes)}
                            <Text
                                style={{
                                    fontSize: 20,
                                }}
                            >
                                {now.seconds}s
                            </Text>
                        </Text>
                    </View>
                ) : (
                    <View
                        style={{
                            alignItems: 'flex-end',
                            padding: skin.$doubleNormalPadding,
                        }}
                    >
                        <Text style={[{ fontSize: 14 }, headerTextColor]}>
                            STATUS
                        </Text>
                        <Text style={[{ fontSize: 16 }, contentTextColor]}>
                            Checked out
                        </Text>
                    </View>
                )}
            </View>
        );

    }

}

export default withNamespaces(['ActivityIndex', 'common'], { wait: true })(
    Index,
);
