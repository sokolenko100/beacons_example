import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { observer, inject } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
import BottomRight from '../../components/Float/BottomRight';
import NoData from '../../components/NoData/NoData';
import ActivitySingleCheckCard from '../../components/Card/ActivityListItem';
import ErrorBoundaryWithoutDisplay from '../../components/ErrorBoundaries/ErrorBoundaryWithoutDisplay';
import HeaderD from '../../decorators/header.decorator';
import SelectJob from '../../components/SelectJob/SelectJob';
import HVCenterView from '../../components/SpecView/HVCenterView';
import Circle from '../../components/Circle/Circle';
import CheckIcon from '../../assets/svg/checkIcon.svg';
import Touch from '../../components/Touch/normalTouch';
import IncFlatList from '../../components/FlatList/IncFlatList';
import { Button, Card, IconButton, Modal, Portal, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import format from 'date-fns/format';
import GetLocation from '../../utils/GetLocation';
import DeviceInfo from 'react-native-device-info';

@HeaderD({
    left: 'Time',
    title: 'null',
    right: 'UserInfo',
})
@inject('activityIndexStore', 'commonStore', 'beaconIndexStore')
@observer
class Index extends Component {
    constructor(props) {
        super();
        //SplashScreen.hide();
        this.state = {
            jobID: null,
            data: {},
            job: {},
            errorMsg: '',
            visible: false,
        };
        this._flastList = null;
        props.navigation.setParams({
            queryList: this.handleRefresh,
        });
    }

    async componentDidMount() {
        this.handleRefresh();
    }

    jumpToCheck = () => {
        this.props.navigation.navigate('CheckInOutIndex', {
            jobID: this.state.jobID,
            callback: this.handleRefresh,
        });
    };

    editTimeStamp = () => {
        this._hideModal();
        this.props.navigation.navigate('EditActivity', { record_id: this.state.data.id, callback: this.handleRefresh });
    };

    handleRefresh = (jobID = null) => {
        this.props.commonStore.fetchJobList();
        if (jobID) {
            this.setState(
                {
                    jobID,
                },
                () => {
                    if (this._flastList) {
                        this._flastList.refresh();
                    }
                },
            );
        } else if (this._flastList) {
            this._flastList.refresh();
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
        API.get('users.deviceCheck', {
            data: {
                serial_number: SerialNumber,
                ...others,
            },
        })
            .then(data => {
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
                this._showModal();
            })
            .catch(error => {
                console.log(error);
            });

    };

    queryList = (page, postRefresh, endFetch, isRefresh = true) => {
        const { jobID } = this.state;
        this.props.activityIndexStore.fetchLatest(
            page,
            jobID === SelectJob.ALL_JOB_ID ? null : jobID,
            isRefresh,
            endFetch,
            postRefresh,
        );
    };

    render() {
        const { ActivityList } = this.props.activityIndexStore;
        const { jobList } = this.props.commonStore;
        const {
            data,
            job,
            visible,
            errorMsg,
        } = this.state;
        return (
            <View style={styles.container}>
                {jobList.length === 0 ? null : (
                    <SelectJob onChange={this.handleRefresh}/>
                )}
                <IncFlatList
                    onFetch={this.queryList}
                    data={ActivityList}
                    ref={ref => (this._flastList = ref)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                    ListEmptyComponent={this.renderListEmptyComponent}
                    contentContainerStyle={styles.flatList}
                />
                <BottomRight
                    distance={{
                        right: 20,
                        bottom: 40,
                    }}
                >
                    <Touch onPress={this.jumpToCheck}>
                        <View>
                            <Circle
                                radius={25}
                                backgroundColor={skin.$deepGreen}
                            >
                                <CheckIcon width={25} height={25}/>
                            </Circle>
                        </View>
                    </Touch>
                </BottomRight>
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
                <Snackbar
                    visible={!!errorMsg}
                    onDismiss={() => this.setState({ errorMsg: '' })}
                    theme={{
                        colors: { background: '#ffffff', text: 'black' },
                    }}
                >
                    {errorMsg}
                </Snackbar>
            </View>
        );
    }

    renderItem = (item, index, separators) => {
        if (item) {
            return (
                <ErrorBoundaryWithoutDisplay>
                    <ActivitySingleCheckCard
                        ActivityModel={item}
                        onClickEdit={() => {
                            this.props.navigation.navigate('EditActivity', { record_id: item.ID, callback: this.handleRefresh });
                        }}
                    />
                </ErrorBoundaryWithoutDisplay>
            );
        }

        return null;
    };

    renderListEmptyComponent = () => {
        const label = this.props.t('noActivity');
        return (
            <HVCenterView style={{ flex: 1 }}>
                <NoData label={label}/>
            </HVCenterView>
        );
    };

    renderJobInfo = (job, data) => {
        if (data.record) {

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

    setModal = (visible) => this.setState({ visible: !!visible });

    _showModal = () => this.setState({ visible: true });

    _hideModal = () => {

        this.setState({ visible: false });

    };
}

Index.propTypes = {
    navigation: PropTypes.object,
    activityIndexStore: PropTypes.object,
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '$grey',
        paddingBottom: 0,
    },
    flatList: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '$grey',
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

export default withNamespaces(['NoData', 'ActivityIndex', 'common'], {
    wait: true,
})(Index);
