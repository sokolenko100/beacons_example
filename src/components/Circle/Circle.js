import React, { Component } from 'react';
import { View } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
class Circle extends Component {

    render() {

        const { radius } = this.props;
        const bgColor = this.props.backgroundColor;
        return (
            <View
                style={[
                    styles.container,
                    {
                        borderRadius: radius,
                        backgroundColor: bgColor,
                        width: radius * 2,
                        height: radius * 2,
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                    },
                    { ...this.props.style },
                ]}
            >
                {this.props.children}
            </View>
        );

    }

}
const styles = StyleSheet.create({
    container: {},
});
export default Circle;
