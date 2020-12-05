import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import PropTypes from 'prop-types';

class TextHeader extends Component {

    render() {

        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>{this.props.text}</Text>
            </View>
        );

    }

}
TextHeader.propTypes = {
    text: PropTypes.string,
};
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '$normalPadding',
    },
    headerText: {
        color: '$white',
        fontSize: 21,
    },
});
export default TextHeader;
