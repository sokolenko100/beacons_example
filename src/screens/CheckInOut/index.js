/* eslint-disable id-length */
import React, { Component } from 'react';
import { BackHandler, Text, View, ScrollView } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { observer, inject } from 'mobx-react';
import HeaderD from '../../decorators/header.decorator';
import { withNamespaces } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import format from 'date-fns/format';
import Touch from '../../components/Touch/normalTouch';
import {
    TextInput,
    Button,
    Modal,
    Portal,
    Card,
    Dialog,
    Snackbar,
    IconButton,
} from 'react-native-paper';
import Loading from '../../components/Loading/MdNormalLoading';
import RadioAndroid from '../../components/Radio/RadioAndroid';
import GetLocation from '../../utils/GetLocation';
import DeviceInfo from 'react-native-device-info';

@HeaderD({
    left: 'Back',
    title: 'null',
    right: 'Time',
    pageName: 'CheckInOutIndex',
})
@inject('activityIndexStore', 'commonStore')
@observer
class CheckInOutIndex extends Component {

    constructor(props) {

        super(props);
        this.state = {
            query: '',
            userModel: global.loginUser,
            password: '',
            errorMsg: '',
            visible: false,
            data: {},
            job: {},
            selectorVisible: false,
            checkLoading: false,
            crewsLoading: false,
            myCrews: [],
        };
        this.callback = this.props.navigation.state.params?.callback || null;
    }

    componentDidMount() {

        this.getMyCrews();

    }

    getMyCrews = () => {

        this.setState({ crewsLoading: true });
        global
            .ASY('users.myCrews')
            .then(data => {

                this.setState({ crewsLoading: false });
                if (data.code === 200) {

                    this.setState({ myCrews: data.model });

                }

            })
            .catch(error => {

                this.setState({ crewsLoading: false });

            });

    };

    doCheck = async () => {
        this.setState({
            errorMsg: '',
        });
        const { password, userModel } = this.state;
        const isSelf =
            loginUser.getID() ===
            (userModel.id ? userModel.id : userModel.getID());
        if (!isSelf && (password.length === 0 || password.length > 60)) {

            this.setState({
                errorMsg: 'input value not valid',
            });

            return;

        }

        const jobID = this.props.navigation.getParam('jobID');
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
        if (isSelf) {

            API.get('users.myCheckIn', {
                data: {
                    job_id: jobID,
                    device_type: 'phone',
                    ...others,
                },
            })
                .then(data => {
                    this.setState({ checkLoading: false });
                    // tap(data);
                    if (data?.data?.code !== 200) {

                        this.setState({
                            errorMsg: data?.data?.message,
                        });
                        return;

                    }
                    // re-fetch record list
                    // if (loginUser.roles === '3') {
                    //
                    //     this.props.activityIndexStore.fetchLatest(jobID);
                    //
                    // } else if (loginUser.roles === '4') {
                    //
                    //     this.props.activityIndexStore.fetchMyLatest();
                    //
                    // }
                    if (this.callback) {
                        try {
                            this.callback(jobID);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    this.props.commonStore.updateCheckInfo();
                    // clear input
                    this.setState({
                        query: '',
                        password: '',
                        data: data?.data,
                        job: data?.data?.job,
                    });
                    // show success modal
                    this._showModal();

                })
                .catch(error => {

                    this.setState({ checkLoading: false });
                    this.setState({
                        errorMsg: 'user not found',
                    });

                });

        } else {
            API.get('users.CheckIn', {

                data: {
                    user_name: userModel.user_name,
                    password,
                    job_id: jobID,
                    device_type: 'phone',
                    ...others,
                },
            })
                .then(data => {
                    console.log("CheckInOutIndex -> doCheck -> data", data)

                    this.setState({ checkLoading: false });

                    // tap(data);
                    if (data?.data?.code !== 200) {

                        this.setState({
                            errorMsg: data?.data?.message,
                        });
                        return;

                    }
                    // re-fetch record list
                    if (this.callback) {
                        try {
                            this.callback(jobID);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    // if (loginUser.roles === '3') {
                    //     this.props.activityIndexStore.fetchLatest(jobID);
                    //
                    // } else if (loginUser.roles === '4') {
                    //
                    //     this.props.activityIndexStore.fetchMyLatest();
                    //
                    // }
                    if (this.callback) {
                        try {
                            this.callback();
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    // clear input
                    this.setState({
                        query: '',
                        password: '',
                        data: data?.data,
                        job: data?.data.job,
                    });
                    // show success modal
                    this._showModal();

                })
                .catch(error => {
                    console.log("CheckInOutIndex -> doCheck -> error", error)

                    this.setState({ checkLoading: false });
                    this.setState({
                        errorMsg: 'user not found',
                    });

                });

        }

    };

    _showModal = () => this.setState({ visible: true });

    _hideModal = () => {

        this.setState({ visible: false });

    };

    editTimeStamp = () => {
        this.setState({ visible: false });
        this.props.navigation.navigate('EditActivity', { record_id: this.state.data.record?.id, callback: this.callback });
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
        return;

    };

    render() {

        const { t } = this.props;
        const {
            data,
            userModel,
            job,
            checkLoading,
            crewsLoading,
            myCrews,
            errorMsg,
            selectorVisible,
        } = this.state;
        const username = global.getFullName(userModel);
        const isSelf =
            loginUser.getID() ===
            (userModel.id ? userModel.id : userModel.getID());
        return (
            <View style={styles.container}>
                <Touch
                    onPress={() => this.setState({
                        selectorVisible: true,
                    })
                    }
                >
                    <View style={[SelectorStyles.container]}>
                        <View>
                            <Text style={SelectorStyles.title}>USER</Text>
                            <Text style={SelectorStyles.content}>
                                {username}
                            </Text>
                        </View>
                        <View>
                            <Icon
                                name="md-arrow-dropdown"
                                size={20}
                                color={skin.$black}
                            />
                        </View>
                    </View>
                </Touch>
                {isSelf ? null : (
                    <TextInput
                        label={t('PasswordInputLabel')}
                        underlineColor="transparent"
                        value={this.state.password}
                        onChangeText={password => this.setState({ password })}
                        style={styles.input}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        onSubmitEditing={() => this.doCheck()}
                        secureTextEntry={true}
                        theme={{
                            colors: {
                                primary: skin.$deepGreen,
                            },
                        }}
                    />
                )}
                <Snackbar
                    visible={!!errorMsg}
                    onDismiss={() => this.setState({ errorMsg: '' })}
                    theme={{
                        colors: { background: '#ffffff', text: 'black' },
                    }}
                >
                    {errorMsg}
                </Snackbar>
                <Button
                    mode="contained"
                    color={skin.$deepGreen}
                    style={styles.button}
                    loading={checkLoading}
                    onPress={this.doCheck}
                >
                    <Text style={styles.buttonText}>
                        {t('CheckInOutButtonText')}
                    </Text>
                </Button>
                <Portal>
                    <Dialog
                        visible={selectorVisible}
                        onDismiss={() => {
                            this.setState({
                                selectorVisible: false,
                            });
                        }}
                    >
                        <Dialog.Title>{t('Select User')}</Dialog.Title>
                        <Dialog.Content>
                            {crewsLoading ? (
                                <Loading />
                            ) : (
                                    <ScrollView
                                        showsVerticalScrollIndicator={false}
                                        style={{ maxHeight: 450 }}>
                                        {
                                            myCrews.map(user => (
                                                <RadioAndroid
                                                    key={user.id.toString()}
                                                    value={user.id.toString()}
                                                    text={global.getFullName(user)}
                                                    selected={
                                                        (userModel.id
                                                            ? userModel.id
                                                            : userModel.getID()) === user.id
                                                    }
                                                    onPress={() => {

                                                        this.setState(
                                                            {
                                                                userModel: user,
                                                            },
                                                            () => {

                                                                this.setState({
                                                                    selectorVisible: false,
                                                                });
                                                                // this.props.onChange(job.getID());

                                                            },
                                                        );

                                                    }}
                                                />
                                            ))
                                        }
                                    </ScrollView>
                                )}
                        </Dialog.Content>
                    </Dialog>
                </Portal>
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
                                    // alignItems: 'center',
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
                                        name={
                                            data?.record?.status === 'error'
                                                ? 'md-warning'
                                                : 'md-checkmark'
                                        }
                                        size={60}
                                        color={
                                            data?.record?.status === 'error'
                                                ? skin.$yellow
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
                                        {`${data?.user?.first_name} ${
                                            data?.user?.last_name
                                            } checked ${
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
                                                styles.button,
                                                {
                                                    width: 130,
                                                    height: 40,
                                                },
                                            ]}
                                            onPress={this.editTimeStamp}
                                        >
                                            <Text
                                                style={[
                                                    styles.buttonText,
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

const SelectorStyles = StyleSheet.create({
    container: {
        backgroundColor: skin.$grayLineColor,
        width: '100%',
        height: 50,
        padding: skin.$normalPadding,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: { fontSize: 11, color: skin.$darkGrey },
    content: { fontSize: 16, color: skin.$black },
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '$grey',
        padding: '$doubleNormalPadding',
    },
    input: {
        width: '100%',
        marginTop: '$normalMargin * 3',
        height: 60,
        borderWidth: 0,
    },
    button: {
        width: '100%',
        marginTop: '$normalMargin * 2',
        height: 60,
        color: '$white',
        justifyContent: 'center',
    },
    buttonText: {
        lineHeight: 40,
        marginVertical: 0,
    },
    successIcon: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successText: {
        justifyContent: 'center',
    },
});
export default withNamespaces(['CheckInOutIndex', 'common'], { wait: true })(
    CheckInOutIndex,
);
