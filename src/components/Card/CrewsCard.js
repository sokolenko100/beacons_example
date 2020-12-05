import React, { Component } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import Proptypes from 'prop-types';
import StyleSheet from 'react-native-extended-stylesheet';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

export default class CrewsCard extends Component {

    static defaultProps = {
        style: {},
        item: {
            children: [],
            first_name: '',
            last_name: '',
        },
    };

    constructor(props) {

        super(props);
        this.state = {
            ActivityModel: null,
        };

    }

    render() {

        const { item } = this.props;
        return (
            <View style={[styles.container, this.props.style]}>
                {item ? (
                    <View style={styles.crewItem}>
                        <Text
                            style={[
                                styles.litterFont,
                                styles.greyColor,
                                styles.listItem,
                            ]}
                            numberOfLines={1}
                        >
                            {item && item.first_name && item.last_name
                                ? `${item.first_name} ${item.last_name}`
                                : ''}
                        </Text>
                        <Icon
                            name={
                                item.CheckType === 'in'
                                    ? skin.$checkIn
                                    : skin.$checkOut
                            }
                            size={20}
                            color={skin.$green}
                        />
                    </View>
                ) : null}
            </View>
        );

    }

    renderHeaderView() {

        return (
            <View style={styles.headerView}>
                <Text
                    style={[
                        styles.litterFont,
                        styles.blackColor,
                        styles.listItem,
                    ]}
                >
                    Crew
                </Text>
                <Text style={styles.listItem} />
            </View>
        );

    }

    renderCrew({ item, index }) {

        return (
            <View style={styles.crewItem}>
                <Text
                    style={[
                        styles.litterFont,
                        styles.greyColor,
                        styles.listItem,
                    ]}
                    numberOfLines={1}
                >
                    {item && item.first_name && item.last_name
                        ? `${item.first_name} ${item.last_name}`
                        : ''}
                </Text>
                <Icon
                    name={
                        item.CheckType === 'in' ? skin.$checkIn : skin.$checkIn
                    }
                    size={20}
                    color={skin.$green}
                />
            </View>
        );

    }

}
CrewsCard.propTypes = {
    style: Proptypes.object,
    item: Proptypes.object,
};
const styles = StyleSheet.create({
    container: {
        //  backgroundColor: 'white',
        paddingLeft: '$doubleNormalPadding/4',
    },

    card: {
        width: '$screenWidth - $doubleNormalPadding',
        // paddingTop: '$normalMargin',
        padding: 8,
    },

    infoGroup: {
        // paddingHorizontal: '$normalPadding',
        flexDirection: 'column',
        justifyContent: 'space-between',
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

    listItem: {
        // width: ('$screenWidth - $doubleNormalPadding '),
        /** screen width - outer padding - inside padding - icon width */
        width:
            (skin.$screenWidth -
                skin.$doubleNormalPadding -
                skin.$doubleNormalPadding -
                skin.$doubleNormalPadding -
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
