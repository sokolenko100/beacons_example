/* eslint-disable id-length */
import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';

// import { TextInput } from 'react-native-paper';
class NormalFloatInput extends Component {

    // static getDerivedStateFromProps(np, ps) {
    //     const { value } = np;
    //     return {
    //         value,
    //     };
    // }
    static defaultProps = {
        value: null,
        label: '',
        secureTextEntry: false,
        onChangeText: () => {
        },
        style: [],
        color: skin.$grey,
    };

    constructor(props) {

        super(props);
        this.state = {
            value: props.value,
        };

    }

    render() {

        const {
            label,
            onChangeText,
            secureTextEntry,
            style,
            color,
            containerStyle,
            _ref,
            onSubmitEditing,
        } = this.props;
        const { value } = this.state;
        return (
            <View style={[styles.container, containerStyle]}>
                <Text style={{ color, fontSize: 16 }}>{label}</Text>
                <TextInput
                    value={value}
                    onChangeText={value => {

                        this.setState(
                            {
                                value,
                            },
                            () => onChangeText(value),
                        );

                    }}
                    autoCapitalize="none"
                    ref={(e) => _ref && _ref(e)}
                    autoComplete="off"
                    autoCorrect={false}
                    secureTextEntry={secureTextEntry}
                    style={[
                        {
                            color,
                            // flex: 1,
                            borderBottomWidth: 1,
                            borderBottomColor: color,
                            // lineHeight: 40,
                            height: (50 / 732) * skin.$screenHeight,
                        },
                        style,
                    ]}
                    onSubmitEditing={onSubmitEditing}
                />
            </View>
        );

    }

}

NormalFloatInput.propTypes = {
    onChangeText: PropTypes.func,
    value: PropTypes.string,
    label: PropTypes.string,
    secureTextEntry: PropTypes.bool,
    color: PropTypes.string,
    containerStyle: PropTypes.any,
};
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        width: '100%',
    },
});
export default withNamespaces(['components', 'common'], { wait: true })(
    NormalFloatInput,
);
