import React, { Component } from 'react';
import { View, Text as RNText } from 'react-native';
import PropTypes from 'prop-types';
import StyleSheet from 'react-native-extended-stylesheet';
import { Card, Text } from 'react-native-paper';
import format from 'date-fns/format';
import Icon from 'react-native-vector-icons/Ionicons';
import Touch from '../../components/Touch/normalTouch';
import Status from '../../screens/Activity/components/RecordStatus';
import { AsIcon } from '../../components/index';

class ActivityListItem extends Component {

    static getDerivedStateFromProps(np, ps) {

        const { ActivityModel } = np;
        return {
            ActivityModel,
        };

    }

    static defaultProps = {
        onClickEdit: () => {
        },
    };

    constructor(props) {

        super(props);
        this.state = {
            ActivityModel: null,
        };
        this.deviceIconSet = {
            phone: 'ios-phone-portrait',
            device: 'ios-finger-print',
            pc: 'as-computer',
        };
    }

    render() {

        const { ActivityModel } = this.state;
        const { onClickEdit } = this.props;
        const checkTimeText = format(ActivityModel.get('checkTime'), 'DD/MM hh:mma');
        const username = ActivityModel.get('user.fullName');
        const checkType = ActivityModel.get('type');
        const deviceType = ActivityModel.get('deviceType');
        const jobName = ActivityModel.get('job.name');
        const jobAddress = ActivityModel.get('job.address');
        const deviceIcon = this.renderDeviceIcon(deviceType);
        const working_time = ActivityModel.get('workTimeStr');
        const jobCode = ActivityModel.get('job.job_code');
        const { address } = ActivityModel;
        const status = ActivityModel.get('status');
        const pending_status = ActivityModel.get('pending_status');
        return (
            <View style={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.address}>
                            {this.renderUserName(username, status, pending_status)}
                            {this.renderJobName(jobName, jobCode)}
                            {this.renderJobAddress(jobAddress, address)}
                        </View>
                        <View style={styles.lineStyle}/>
                        <View style={styles.cardTitle}>
                            <View style={styles.cardTitleCheckTime}>
                                <Text style={styles.cardCheckTimeText}>
                                    {checkTimeText}
                                </Text>
                                <AsIcon
                                    name={`as-check-${checkType}`}
                                    size={20}
                                    color={
                                        checkType === 'in'
                                            ? skin.$mainGreen
                                            : skin.$red
                                    }
                                />
                            </View>
                            <View style={styles.cardTitleCheckTime}>
                                {deviceIcon}
                                <Text style={styles.workedTime}>
                                    {working_time}
                                </Text>
                            </View>

                            <Touch onPress={onClickEdit}>
                                <Icon
                                    name="md-create"
                                    size={20}
                                    color={skin.$grayIcon}
                                />
                            </Touch>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        );

    }

    renderDeviceIcon = (deviceType) => {

        const deviceIcon = this.deviceIconSet[deviceType];
        if (deviceType === 'pc') {
            return (<AsIcon
                name={deviceIcon}
                size={18}
                color={skin.$grayIcon}
            />);
        }

        return (<Icon
            name={deviceIcon}
            size={20}
            color={skin.$grayIcon}
        />);
    };

    renderUserName = (userName, status, pending_status) => <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.cardTitleUsername}>{userName || ''}</Text>
        <Status pending_status={pending_status} status={status}/>
    </View>;

    renderJobName = (jobName, jobCode) => {

        if (jobName) {

            return <Text style={styles.cardJobName}>{jobCode ? `${jobCode} - ${jobName}` : `${jobName}`}</Text>;

        }
        return;

    };

    renderJobAddress = (jobAddress, address) => {
        if (jobAddress || address) {

            return (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 4,
                    }}
                >
                    <Icon
                        name="ios-pin"
                        color="#2E7F0E"
                        size={25}
                        style={{ marginRight: skin.$normalPadding }}
                    />
                    <Text style={styles.cardJobAddress}>{address || jobAddress}</Text>
                </View>
            );

        }
        return;

    };

}

ActivityListItem.propTypes = {
    onClickEdit: PropTypes.func,
    navigation: PropTypes.object,
    ActivityModel: PropTypes.object,
};
const styles = StyleSheet.create({
    container: {},
    card: {
        width: '$screenWidth - $doubleNormalPadding',
        marginTop: '$normalMargin',
    },
    address: {
        paddingHorizontal: '$normalPadding',
        marginTop: '$normalPadding',
    },
    lineStyle: {
        backgroundColor: '$grayLineColor',
        height: 1,
        marginTop: '$normalMargin',
    },
    cardTitle: {
        marginTop: '$doubleNormalMargin',
        paddingHorizontal: '$normalPadding',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitleUsername: {
        color: '$lightGray',
        fontSize: 18,
    },
    cardJobName: {
        marginTop: 4,
        color: '#267B05',
        fontSize: 15,
    },
    cardJobAddress: {
        color: '#2E7F0E',
        fontSize: 15,
    },
    cardTitleCheckTime: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        // width: 108,
    },
    cardCheckTimeText: {
        color: '$lightGray',
        fontSize: 15,
        marginRight: '$normalPadding',
    },
    workedTime: {
        color: '$lightGray',
        fontSize: 15,
        marginLeft: '$normalPadding',
        width: 65,
    },
});

export default ActivityListItem;
