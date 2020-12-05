import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import StyleSheet from 'react-native-extended-stylesheet';
import { Card } from 'react-native-paper';
import format from 'date-fns/format';
import Icon from 'react-native-vector-icons/Ionicons';
import Touch from '../../components/Touch/normalTouch';

class ActivityCard extends Component {

    static getDerivedStateFromProps(np, ps) {

        const { username, checkInTime, checkOutTime } = np;
        return {
            username,
            checkInTime,
            checkOutTime,
        };

    }
    static defaultProps = {
        onClickEdit: () => {},
    };
    constructor(props) {

        super(props);
        this.state = {
            username: '',
            checkInTime: null,
            checkOutTime: null,
        };

    }
    render() {

        const { username, checkInTime, checkOutTime } = this.state;
        const { onClickEdit } = this.props;
        const checkInTimeText = format(checkInTime, 'hh:mma');
        const working_time = '1h 12m';
        return (
            <View style={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.cardTitle}>
                            <Text style={styles.cardTitleUsername}>
                                {username}
                            </Text>
                            <View style={styles.cardTitleCheckTime}>
                                <Text style={styles.cardCheckTimeText}>
                                    {checkInTimeText}
                                </Text>
                                <Icon
                                    name="ios-log-in"
                                    size={15}
                                    color={skin.$green}
                                />
                            </View>
                            <View style={styles.cardTitleCheckTime}>
                                <Text style={styles.cardCheckTimeText}>
                                    {checkInTimeText}
                                </Text>
                                <Icon
                                    name="ios-log-out"
                                    size={15}
                                    color={skin.$lightRed}
                                />
                            </View>
                            <Text>{working_time}</Text>
                            <Touch onPress={onClickEdit}>
                                <Icon
                                    name="md-create"
                                    size={15}
                                    color={skin.$blue}
                                />
                            </Touch>
                        </View>
                        <View style={styles.address}>
                            <Text>08563 - Acme Headquarters - Painting</Text>
                            <Text>123 Main Street, Kitguab, MD</Text>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        );

    }

}
ActivityCard.propTypes = {
    onClickEdit: PropTypes.func,
    navigation: PropTypes.object,
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
    },
    cardTitleUsername: {
        color: '$deepBlue',
        fontSize: 15,
    },
    cardTitleCheckTime: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        width: 68,
    },
    cardCheckTimeText: {
        fontSize: 12,
    },
    address: {
        paddingHorizontal: '$normalPadding',
        marginTop: '$doubleNormalMargin',
    },
});
export default ActivityCard;
