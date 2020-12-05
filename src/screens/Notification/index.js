/* eslint-disable id-length */
import React, { Component, PureComponent } from 'react';
import { View, TouchableOpacity } from 'react-native';
import HeaderD from '../../decorators/header.decorator';
import StyleSheet from 'react-native-extended-stylesheet';
import { Button, Card, IconButton, Modal, Portal, Searchbar, Snackbar, Text } from 'react-native-paper';
import { inject, observer } from 'mobx-react';
import { HVCenterView, IncFlatList, NoData, AsIcon } from '../../components/index';
import { withNamespaces } from 'react-i18next';
import format from 'date-fns/format';
import Icon from 'react-native-vector-icons/Ionicons';
import GetLocation from '../../utils/GetLocation';
import DeviceInfo from 'react-native-device-info';
import NotifService from '../../utils/NotifService';
import SplashScreen from 'react-native-splash-screen';

const NoticeType = ['Swipe Notification', 'Job/Task Updates', 'Crew Changes', 'Time Stamp Edited'];

@HeaderD({
    left: 'Time',
    title: 'null',
    right: 'UserInfo',
})
@inject('activityIndexStore', 'commonStore', 'beaconIndexStore')
@observer
class Notification extends Component {

    constructor(props) {

        super(props);
        this.state = {
            errorMsg: '',
            type: 0,
            job: {},
            data: null,
            visible: false,
        };
        this._flastList = null;
        SplashScreen.hide();
        //  this.props.navigation.setParams({ queryList: this.queryList });
    }

    async componentDidMount(): void {
        //  console.log(global.loginUser);
        // if (global.loginUser.roles !== '4') {
        this.notif = new NotifService(this._onRegister, this._onNotification.bind(this));
        await this.props.beaconIndexStore.checkPermission();
        this.props.beaconIndexStore.addListener('beaconsDidRangeactivity', info => {
            info.beacons.map(item => {
                this.props.beaconIndexStore.FetchDoCheck(item, (SerialNumber) => this.deviceCheck(SerialNumber));
            });
        });
        setTimeout(() => {
            this.props.beaconIndexStore.start();
        }, 1000);
        //this.deviceBind('4829');
        // }
    }

    // deviceBind = (SerialNumber) => {
    //     console.log(SerialNumber,'==============')
    //     global.ASY('users.bindDevice',
    //         null,
    //         '',
    //         { user_id: loginUser.getID(), serial_number: SerialNumber })
    //         .then(res => {
    //             console.log(res)
    //             if (res.code === 200) {
    //                 this.setState({
    //                     errorMsg: `Bind Success\n Serial Number:${SerialNumber}\n`,
    //                 });
    //             } else {
    //                 this.setState({
    //                     errorMsg: `${res.message}\n Serial Number:${SerialNumber}\n`,
    //                 });
    //             }
    //         });
    // };

    componentDidUpdate(prevProps, prevState): void {
        if (!this.props.commonStore.isLogin) {
            this.props.navigation.navigate('Auth');
        }
    }

    _onRegister = async (device_token) => {
        const token = await this.props.commonStore.getLoginTokenFromStorage();
        API.get('users.currentUser', { token, data: { device_token } })
            .then(data => {
            })
            .catch(error => {
                tap(error);
            });
    };

    _onNotification = (notification) => {
        const { foreground, data: { sourceType } } = notification;
        if (!foreground) {
            if (sourceType === '0' || sourceType === '3') {
                if (global.loginUser.roles === '4') {
                    this.props.navigation.navigate('Message');
                } else {
                    this.props.navigation.navigate('Home');
                }
                this.handleRefresh();
            } else if (sourceType === '1') {
                this.props.navigation.navigate('Jobs');
            } else if (sourceType === '2') {
                this.props.navigation.navigate('Crew');
            }
        } else {
            this.handleRefresh();
            if (global.loginUser.roles !== '4' && sourceType === '2') {
                this.props.commonStore.fetchJobList();
            }
            if (sourceType === '0' || sourceType === '3') {
                if (global.loginUser.roles !== '4') {
                    this.props.activityIndexStore.fetchLatest(
                        1,
                        null,
                        true,
                        null,
                        null,
                    );
                } else {
                    this.props.activityIndexStore.fetchMyLatest(
                        1,
                        null,
                        true,
                        null,
                        null,
                    );
                }

            }
        }
    };

    handleRefresh = () => {
        if (this._flastList) {
            this._flastList.handleRefresh();
        }
    };

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
        deviceLog.log('NETWORK', 'Parameters of the device request check-in http API: ', {
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
                deviceLog.log('NETWORK', 'http API return data:', data);
                if (data?.data?.code !== 200) {
                    this.setState({
                        errorMsg: data?.data?.message,
                    });
                    return;
                }
                this.handleRefresh();
                this.setState({
                    data: data?.data,
                    job: data?.data.job,
                });
                if (loginUser.roles === '4') {
                    this.props.commonStore.updateCheckInfo();
                }
                this._showModal();
            })
            .catch(error => {
                deviceLog.info('NETWORK', 'The check-in http API an error', error);
            });

    };

    _showModal = () => this.setState({ visible: true });

    _hideModal = () => this.setState({ visible: false });

    editTimeStamp = () => {
        this._hideModal();
        this.props.navigation.navigate('EditActivity', { record_id: this.state.data.record?.id, callback: this.handleRefresh });
    };

    render() {
        const { t, navigation, commonStore } = this.props;
        const { type, data, errorMsg, job, visible } = this.state;
        const fullName = data && data.user ? global.getFullName(data.user) : '';
        return (
            <View style={styles.container}>
                <TabView
                    type={type}
                    ref={(e) => this._flastList = e}
                    t={t}
                    navigation={navigation}
                />
                <Portal>
                    <Modal
                        visible={visible}
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
                                            : skin.$lightGreen}
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
                                    {this.renderJobInfo(job, data)}
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
                {commonStore.isLogin ? null : <View/>}
            </View>
        );

    }

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
}

class TabView extends Component {

    constructor(props) {

        super(props);
        this.state = {
            list: [],
            keyword: '',
        };
        props.navigation.setParams({ queryList: this.handleRefresh });
    }

    componentDidMount() {
    }

    renderItem = (item, index, separators) => <Item navigation={this.props.navigation} index={index} item={item} key={index.toString()}/>;

    renderListEmptyComponent = () => {
        const label = this.props.t('noMessage');
        return (
            <HVCenterView style={{ flex: 1 }}>
                <NoData label={label}/>
            </HVCenterView>
        );
    };

    render() {

        const { keyword, list } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <Searchbar
                    placeholder="Search"
                    onChangeText={keyword => {
                        this.setState({ keyword });
                    }}
                    style={styles.search}
                    value={keyword}
                    onSubmitEditing={() => this.handleRefresh()}
                    theme={{ colors: { primary: skin.$deepGreen } }}
                />
                <IncFlatList
                    onFetch={this.getList}
                    data={list}
                    ref={ref => (this._flastList = ref)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                    ListEmptyComponent={this.renderListEmptyComponent}
                    contentContainerStyle={styles.containerStyle}
                />
            </View>
        )
            ;

    }

    handleRefresh = () => {
        if (this._flastList) {
            this._flastList.refresh();
        }
    };

    getList = async (page, postRefresh, endFetch, isRefresh = true) => {
        const { list, keyword } = this.state;
        const type = '0,1,2,3,4';
        const params = {
            type,
            page,
            keyword,
        };
        const res = await global.ASY('notifications.list', params);
        if (res) {
            if (res.code === 200) {
                const newList = isRefresh ? res.list : global.cleanData([...list, ...res.list]);
                this.setState({ list: newList });
                if (postRefresh && res.meta) {
                    postRefresh(newList, res.meta.total);
                }
            }
        }
        if (endFetch) {

            endFetch();

        }
    };

}

class Item extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {};
    }
    
    render() {

        const { item, navigation } = this.props;
        const { iconName, color, isWarning } = this.getIconAndColor(item);
        const time = format(item.created_at, 'hh:mma');
        const title = this.getTitle(item);
        const content = this.getContent(item);
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => {
                if ((item.type === '0' || item.type === '3' || item.type === '4') && item.content && item.content.id) {
                    navigation.navigate('EditActivity', { record_id: item.content.id, callback: null });
                }
            }} style={styles.cardContainer}>
                <View style={styles.card}>
                    <AsIcon
                        name={iconName}
                        size={28}
                        style={[styles.icon]}
                        color={color}
                    />
                    <View style={[styles.center, item.job_name ? {} : { justifyContent: 'center' }]}>
                        <Text numberOfLines={1} style={styles.username}>{title}</Text>
                        {content}
                    </View>
                    <Text style={styles.time}>{time}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    getIconAndColor = (item) => {
        let iconName = item.content.type === 'in' ? 'as-check-in' : 'as-check-out';
        let color = skin.$deepGreen;
        let isWarning = false;
        if (item.type === '0' && item.content && (item.content.status !== 'success')) {
            iconName = 'as-warning';
            color = '#c6bda7';
            isWarning = true;
        }
        if (item.type === '1') {
            iconName = 'as-job';
        }
        if (item.type === '2') {
            iconName = 'as-crew';
        }
        if (item.type === '3') {
            iconName = 'as-stamp-edit';
        }
        if (item.type === '4') {
            iconName = 'as-stamp-edit';
            if (item.record && item.record.pending_status) {
                color = '#ffb620';
            }
        }
        return { iconName, color, isWarning };
    };

    getTitle = (item) => {
        const { user_name, type, content } = item;
        if (type === '0' || type === '3' || type === '4') {
            const name = (user_name || '');
            const position = content.position ? ` , ${content.position}` : ``;
            return (name + position);
        }
        return NoticeType[Number(type)];
    };

    getContent = (item) => {
        if (item.type === '3' || item.type === '4') {
            return <Text style={styles.reason}>{item.desc}</Text>;
        }
        if (item.job_name || item.content.errMsg) {
            return <Text style={styles.reason}>{item.content.errMsg || item.job_name}</Text>;
        }
        return null;
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f2f5f7',
    },
    containerStyle: {
        flexGrow: 1,
        paddingTop: 19,
    },
    search: {
        width: 354 * global.adapt,
        marginTop: 25,
        marginBottom: 1,
        marginLeft: (skin.$screenWidth - 354 * global.adapt) / 2,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabStyle: {
        flex: 1,
        backgroundColor: skin.$deepGreen,
    },
    scrollableTabView: {
        flex: 1,
        width: skin.$screenWidth,
        height: skin.$screenHeight,
    },
    cardContainer: {
        paddingHorizontal: skin.$normalPadding,
        backgroundColor: skin.$white,
        width: skin.$screenWidth - skin.$normalPadding * 2,
        marginLeft: skin.$normalPadding,
    },
    card: {
        backgroundColor: skin.$white,
        width: skin.$screenWidth - (skin.$normalPadding + 4) * 2,
        paddingVertical: skin.$normalPadding + 4,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#e1ecdd',
        paddingRight: skin.$normalPadding,
    },
    icon: {
        //  width: 26,
        textAlign: 'center',
        marginTop: 6,
    },
    center: {
        flex: 2,
        marginLeft: 10,
    },
    username: {
        color: skin.$deepGreen,
        fontSize: 18,
        width: 230 * global.adapt,
    },
    reason: {
        color: skin.$grayIcon,
        fontSize: 16,
        marginTop: 2,
    },
    time: {
        fontSize: 16,
        color: skin.$grayIcon,
        marginTop: 3,
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
        color: '$white',
    },
    successIcon: {
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successText: {
        justifyContent: 'center',
    },
});
export default withNamespaces(['Notification', 'common'], { wait: true })(
    Notification,
);
