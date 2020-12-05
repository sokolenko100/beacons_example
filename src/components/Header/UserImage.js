/* eslint-disable id-length */
import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { withNamespaces } from 'react-i18next';
import Circle from '../Circle/Circle';
class UserImage extends Component {

    render() {

        const { t } = this.props;
        const user = global.loginUser;
        const username = user.get('fullName') ?? '';
        return (
            <View style={styles.container}>
                <Circle radius={25} backgroundColor={'transparent'}>
                    <Image
                        style={{ width: 50, height: 50 }}
                        source={require('../../assets/img/logo.png')}
                    />
                </Circle>
                <Text style={{ color: skin.$white }}>{username}</Text>
            </View>
        );

    }

}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '$normalPadding',
        justifyContent: 'center',
        alignItems: 'center',
    },
    planned: {
        color: '$white',
        fontSize: 15,
        textAlign: 'right',
    },
    working: {
        color: '$white',
        fontSize: 15,
        textAlign: 'right',
    },
});
export default withNamespaces(['components', 'common'], { wait: true })(
    UserImage,
);
