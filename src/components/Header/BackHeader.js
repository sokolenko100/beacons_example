import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/Ionicons';
import Touch from '../Touch/normalTouch';

class BackHeader extends Component {

    goBack = () => {

        this.props.navigation.goBack();

    };
    render() {

        return (
            <Touch onPress={this.goBack}>
                <View style={styles.container}>
                    <Icon name="md-arrow-back" size={26} color={skin.$white} />
                </View>
            </Touch>
        );

    }

}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '$doubleNormalPadding',
    },
    time: {
        color: '$white',
        fontSize: 19,
    },
    date: {
        color: '$white',
        fontSize: 15,
    },
});
export default BackHeader;
