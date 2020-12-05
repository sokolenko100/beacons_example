import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import StyleSheet from 'react-native-extended-stylesheet';
import { Card } from '@ant-design/react-native';
import format from 'date-fns/format';
import Icon from 'react-native-vector-icons/Ionicons';
import Touch from '../../components/Touch/normalTouch';
class ActivitySingleCheckCard extends Component {

    static getDerivedStateFromProps(np, ps) {

        const { ActivityModel } = np;
        return {
            ActivityModel,
        };

    }
    static defaultProps = {
        onClickEdit: () => {},
    };
    constructor(props) {

        super(props);
        this.state = {
            ActivityModel: null,
        };
        this.deviceIconSet = {
            phone: 'ios-phone-portrait',
        };

    }
    render() {

        const { ActivityModel } = this.state;
        const { onClickEdit } = this.props;
        const checkTimeText = format(ActivityModel.get('checkTime'), 'hh:mma');
        const username = ActivityModel.get('user.fullName');
        const checkType = ActivityModel.get('type');
        const deviceType = ActivityModel.get('deviceType');
        const jobName = ActivityModel.get('job.name');
        const jobAddress = ActivityModel.get('job.address');
        const deviceIcon = this.deviceIconSet[deviceType];
        const workTimeStr = ActivityModel.get('workTimeStr');

        return (
            <View style={styles.container}>
                <Card style={styles.card}>
                    <Card.Body>
                        <View style={styles.cardTitle}>
                            <Text style={styles.cardTitleUsername}>
                                {username}
                            </Text>

                            <Text
                                style={{
                                    width: 80,
                                    textAlign: 'right',
                                    paddingRight: skin.$normalPadding,
                                    // alignSelf: 'flex-end',
                                }}
                            >
                                {workTimeStr}
                            </Text>
                            <Touch onPress={onClickEdit}>
                                <Icon
                                    name="md-create"
                                    size={15}
                                    color={skin.$blue}
                                />
                            </Touch>
                        </View>
                        <View style={styles.cardTitleCheckTime}>
                            <Text style={styles.cardCheckTimeText}>
                                {checkTimeText}
                            </Text>
                            <View style={{ marginRight: skin.$normalMargin }}>
                                <Icon
                                    name={
                                        checkType === 'in'
                                            ? skin.$checkIn
                                            : skin.$checkOut
                                    }
                                    size={20}
                                    color={skin.$green}
                                />
                            </View>

                            <Icon
                                name={deviceIcon}
                                size={20}
                                color={skin.$black}
                            />
                        </View>
                        {jobName ? (
                            <View style={styles.address}>
                                <Text>{jobName}</Text>
                                <Text>{jobAddress}</Text>
                            </View>
                        ) : null}
                    </Card.Body>
                </Card>
            </View>
        );

    }

}
ActivitySingleCheckCard.propTypes = {
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
    cardTitle: {
        paddingHorizontal: '$normalPadding',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 30,
    },
    cardTitleUsername: {
        color: '$deepBlue',
        fontSize: 15,
        width: 100,
    },
    cardTitleCheckTime: {
        // justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        // width: 100,
        marginLeft: '$normalMargin',
    },
    cardCheckTimeText: {
        fontSize: 14,
        marginRight: '$normalMargin',
    },
    address: {
        paddingHorizontal: '$normalPadding',
        marginTop: '$doubleNormalMargin',
    },
});
export default ActivitySingleCheckCard;
