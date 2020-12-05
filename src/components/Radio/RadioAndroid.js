/* eslint-disable id-length */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
import { RadioButton } from 'react-native-paper';
import Touch from '../Touch/normalTouch';
class RadioAndroid extends Component {

    static getDerivedStateFromProps(np, ps) {

        const { selected } = np;
        return {
            selected,
        };

    }
    static defaultProps = {
        selected: false,
    };
    constructor() {

        super();
        this.state = {
            selected: false,
        };

    }
    render() {

        return (
            <Touch onPress={this.props.onPress}>
                <View style={styles.container}>
                    <Text numberOfLines={1} style={styles.text}>
                        {this.props.text}
                    </Text>
                    <RadioButton.Android
                        value={this.props.value}
                        status={this.state.selected ? 'checked' : 'unchecked'}
                        onPress={this.props.onPress}
                    />
                </View>
            </Touch>
        );

    }

}
RadioAndroid.propTypes = {
    text: PropTypes.string,
    value: PropTypes.string,
    selected: PropTypes.bool,
    onPress: PropTypes.func,
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    text: {
        width: '80%',
    },
});
export default withNamespaces(['components', 'common'], { wait: true })(
    RadioAndroid,
);
