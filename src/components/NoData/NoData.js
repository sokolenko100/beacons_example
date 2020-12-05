/* eslint-disable id-length */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { withNamespaces } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';

class NoData extends Component {

    render() {

        const { label } = this.props;
        return (
            <View style={styles.container}>
                {/* <Icon name="md-sad" size={60} color={skin.$darkGrey} />*/}
                <Text style={styles.normalText}>{label}</Text>
            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '$normalPadding',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    normalText: {
        color: '$darkGrey',
    },
});
export default withNamespaces(['components', 'common'], { wait: true })(NoData);
