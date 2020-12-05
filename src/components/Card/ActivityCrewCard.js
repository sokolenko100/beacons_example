import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Proptypes from 'prop-types';
import StyleSheet from 'react-native-extended-stylesheet';
import { Button, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Touch from '../../components/Touch/normalTouch';
import { Week } from '../../utils/date';
import NoData from '../../components/NoData/NoData';

export default class ActivityCrewCard extends Component {

    // static getDerivedStateFromProps(np, ps) {

    //     const { ActivityModel } = np;
    //     return {
    //         ActivityModel,
    //     };

    // }

    static defaultProps = {
        style: {},
        item: {
            address: '',
            name: '',
            created_at: '',
            ended_date: '',
        },
    };

    constructor(props) {

        super(props);
        this.state = {
            ActivityModel: null,
        };

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

    render() {

        // const { ActivityModel } = this.state;
        // TODO: emmmm

        const { item, jumpToAddCrew, refreshList } = this.props;
        const crews = item.crews ? item.crews : [];
        const jobName = item.job_code ? (`${item.job_code} - ${item.name}`) : item.name;
        return (
            <View style={[styles.container, this.props.style]}>
                {item ? (
                    <Card style={styles.card}>
                        <Card.Content>
                            <View style={styles.infoGroup}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.litterFont,
                                            styles.greyColor,
                                        ]}
                                    >
                                        {`${this.formatTime(
                                            item.startedDate,
                                        )} - ${this.formatTime(item.endDate)}`}
                                    </Text>
                                    {/* <Touch
                                        onPress={() => jumpToAddCrew({
                                            job: item,
                                            callback: refreshList,
                                        })
                                        }
                                    >
                                        <Icon
                                            name="md-add"
                                            size={20}
                                            color={skin.$darkGrey}
                                        />
                                    </Touch>*/}
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => jumpToAddCrew({
                                            job: item,
                                            callback: refreshList,
                                        })}
                                        style={styles.button}
                                    >
                                            <Text style={styles.buttonText}>
                                                ADD CREW
                                            </Text>
                                    </TouchableOpacity>
                                </View>

                                <Text
                                    style={[styles.bigFont, styles.blackColor]}
                                >
                                    {jobName}
                                </Text>
                                <Text
                                    style={[styles.bigFont, styles.greenColor, styles.marginTop]}
                                >
                                    {item.address}
                                </Text>
                                {this.renderContactView(item.contact)}
                            </View>
                            <View style={styles.lineView}/>
                            <FlatList
                                data={crews}
                                renderItem={this.renderCrew}
                                style={styles.flatList}
                                keyExtractor={(item, index) => index.toString()}
                                ListHeaderComponent={() => this.renderHeaderView()
                                }
                                ListEmptyComponent={
                                    this.renderListEmptyComponent
                                }
                            />
                        </Card.Content>
                    </Card>
                ) : null}
            </View>
        );

    }

    renderContactView = contact => {

        if (contact && (contact.first_name || contact.last_name)) {

            return (
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <Text style={[styles.bigFont, styles.greyColor]}>
                        {contact.first_name + contact.last_name}
                    </Text>
                    {contact.phone ? (
                        <Text style={[styles.bigFont, styles.greenColor]}>
                            {`  ${contact.phone}`}
                        </Text>
                    ) : null}
                </View>
            );

        }
        return null;

    };

    renderHeaderView() {

        return (
            <View style={styles.headerView}>
                <View style={styles.listLeftContainer}>
                    <Text
                        style={[
                            styles.litterFont,
                            styles.blackColor,
                            styles.listItem,
                        ]}
                    >
                        Crew
                    </Text>
                    <Text
                        style={[
                            styles.litterFont,
                            styles.blackColor,
                            styles.listItem,
                        ]}
                    >
                        Task
                    </Text>
                </View>
                <View/>
            </View>
        );

    }

    renderCrew({ item }) {

        return (
            <View style={styles.crewItem}>
                <View style={styles.listLeftContainer}>
                    <Text
                        style={[
                            styles.litterFont,
                            styles.greenColor,
                            styles.listItem,
                        ]}
                        numberOfLines={1}
                    >
                        {item && item.user
                            ? `${item.user.first_name} ${item.user.last_name}`
                            : ''}
                    </Text>
                    <Text
                        style={[
                            styles.litterFont,
                            styles.greenColor,
                            styles.listItem,
                        ]}
                        numberOfLines={1}
                    >
                        {item && item.task ? item.task.title : ''}
                    </Text>
                </View>
                <Icon
                    name={
                        item.CheckType === 'in' ? skin.$checkIn : skin.$checkOut
                    }
                    size={20}
                    color={skin.$green}
                />
            </View>
        );

    }

    renderListEmptyComponent = () => (
        <View style={[styles.crewItem, { paddingBottom: 3 }]}>
            <NoData label={'No crew is assigned to the job'}/>
        </View>
    );

}
ActivityCrewCard.propTypes = {
    style: Proptypes.object,
    item: Proptypes.object,
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        // paddingLeft: '$doubleNormalPadding/2',
    },
    card: {
        width: '$screenWidth - $doubleNormalPadding',
        paddingTop: '$normalMargin',
    },
    buttonText: {
        color: 'white',
        fontSize: 8,
        textAlign: 'center',
        // backgroundColor: 'red',
        // width: 50,
    },
    button: {
        width: 55,
        height: 24,
        borderRadius: 4,
        backgroundColor: skin.$deepGreen,
        justifyContent: 'center',
        position: 'absolute',
        right: -8,
        top: -3,
    },
    infoGroup: {
        // paddingHorizontal: '$normalPadding',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },

    marginTop: {
        marginTop: 5,
    },

    litterFont: {
        fontSize: 14,
    },

    bigFont: {
        fontSize: 16,
    },

    blackColor: {
        color: '$black',
    },

    greyColor: {
        color: '$darkGrey',
    },

    greenColor: {
        color: '$deepGreen',
    },

    lineView: {
        height: 1,
        backgroundColor: '$greyLine',
        marginTop: '$normalMargin',
    },

    crewItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listLeftContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: ((skin.$screenWidth - skin.$doubleNormalPadding) * 2) / 3,
    },
    listItem: {
        // width: ('$screenWidth - $doubleNormalPadding '),
        /** screen width - outer padding - inside padding - icon width */
        width:
            (skin.$screenWidth -
                skin.$doubleNormalPadding * 3 -
                skin.$normalMargin) /
            3,
    },

    headerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    flatList: {
        marginTop: '$normalMargin',
    },
});
