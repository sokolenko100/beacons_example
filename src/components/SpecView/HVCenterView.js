/* eslint-disable id-length */
import React, { Component } from 'react';
import { View } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';
class HVCenterView extends Component {

    static defaultProps = {
        styles: null,
    };
    render() {

        return (
            <View style={[styles.container, this.props.style]}>
                {this.props.children}
            </View>
        );

    }

}
HVCenterView.propTypes = {
    style: PropTypes.any,
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default HVCenterView;
