import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { Card } from 'react-native-paper';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import { Week } from '../../utils/date';

export default class JobItem extends Component {

    static getDerivedStateFromProps(np, ps) {

        const { JobModel } = np;
        return {
            JobModel,
        };

    }

    static defaultProps = {
        onClickEdit: () => {
        },
    };

    constructor(props) {

        super(props);
        this.state = {
            JobModel: null,
        };
        this.deviceIconSet = {
            phone: 'ios-phone-portrait',
        };

    }

    render() {

        const { JobModel } = this.state;
        const { onClickEdit } = this.props;
        if (!JobModel) {
            return null;
        }
        const startTime = `${this.formatTime(JobModel.get('startedDate'))}`;
        const endDate = `${this.formatTime(JobModel.get('endDate'))}`;
        const name = JobModel.getFullName();
        const contact = JobModel.get('contact');
        return (
            <View style={styles.container}>
                <Card style={styles.card}>
                    <TouchableOpacity
                        activeOpacity={global.loginUser.roles !== '3' ? 1 : 0.7}
                        onPress={onClickEdit}
                    >
                        <Card.Content>
                            <Text style={styles.nameStyle}>{name}</Text>
                            <View style={styles.dateView}>
                                {/* <Text style={styles.dateText}>
                                    Start: {startTime}
                                </Text>
                                <Text style={styles.dateText}>
                                    End: {endDate}
                                </Text> */}
                                <Text style={styles.dateText}>
                                    {startTime} - {endDate}
                                </Text>
                            </View>
                            {this.renderContact(contact)}
                        </Card.Content>
                    </TouchableOpacity>
                </Card>
            </View>
        );

    }

    renderContact(contact) {

        if (contact !== null) {

            return (
                <View style={styles.contactView}>
                    <Text style={styles.detailText}>
                        Primary Contact:{' '}
                        {contact.first_name +' '+ contact.last_name}
                    </Text>
                    <Text style={styles.detailText}>
                        Phone: {contact.phone}
                    </Text>
                    <Text style={styles.detailText}>
                        Email: {contact.email}
                    </Text>
                </View>
            );

        }

    }

    formatTime = date => {

        if (date) {

            const strArr = String(new Date(date))
                .split(' ');
            const week = Week.find(str => str.includes(strArr[0]),
            )
                .toUpperCase();
            const str = `${week} ${strArr[1].toLocaleUpperCase()} ${strArr[2]}`;
            return str;

        }
        return '';

    };

}

JobItem.propTypes = {
    onClickEdit: PropTypes.func,
    JobModel: PropTypes.object,
};

const styles = StyleSheet.create({
    container: {},

    card: {
        width: '$screenWidth - $doubleNormalPadding',
        marginTop: '$normalMargin',
        // paddingLeft: '$normalMargin',
        // paddingRight: '$normalMargin',
        paddingBottom: '$normalMargin',
    },
    dateView: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    contactView: {
        marginTop: 8,
    },

    nameStyle: {
        fontSize: 16,
        marginTop: '$normalMargin',
    },

    dateText: {
        fontSize: 14,
        color: '$lightGray',
    },
    detailText: {
        color: '$lightGray',
        fontSize: 14,
        marginBottom: 4,
    },
});
