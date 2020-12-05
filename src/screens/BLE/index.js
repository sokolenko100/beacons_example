/* eslint-disable id-length */
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import StyleSheet from 'react-native-extended-stylesheet';
import HeaderD from '../../decorators/header.decorator';
import {LogView} from 'react-native-device-log'
const mainWith = skin.$screenWidth - skin.$doubleNormalPadding * 4;




@HeaderD({
    left: 'Back',
    title: 'BLE Debug',
})
@inject(['beaconIndexStore'])
@observer
class BLEIndex extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.logStyle} >
                    <LogView inverted={false} multiExpanded={true} style={{ width: '100%' }} timeStampFormat='HH:mm:ss'></LogView>
                </View>
            </View>
        );

    }

}

BLEIndex.propTypes = {
    navigation: PropTypes.object,
    commonStore: PropTypes.object,
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '$grey',
        flexDirection: 'column'

    },
    logStyle: {
        flex: 1,
        backgroundColor: 'green',
        width: '$screenWidth'
    }
});
export default withNamespaces(['BLEIndex', 'common'], { wait: true })(
    BLEIndex,
);
