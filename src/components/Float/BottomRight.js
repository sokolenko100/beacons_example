import React, { Component } from 'react';
import { View } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
class BottomRight extends Component {

    render() {

        const distance = this.props.distance;
        return (
            <View
                style={[
                    styles.container,
                    distance || null,
                    { ...this.props.style },
                ]}
            >
                {this.props.children}
            </View>
        );

    }

}
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: '$doubleNormalPadding',
        bottom: '$doubleNormalPadding',
    },
});
export default BottomRight;
