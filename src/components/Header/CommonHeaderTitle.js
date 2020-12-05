import React, { Component } from 'react';
import { View } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

import { Icon } from '@ant-design/react-native';
class CommonHeaderTitle extends Component {

    render() {

        return (
            <View style={styles.container}>
                <Icon name="question" size="md" color={skin.$grey} />
            </View>
        );

    }

}
const styles = StyleSheet.create({
    container: {},
});
export default CommonHeaderTitle;
