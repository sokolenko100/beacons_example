import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import Touch from '../../components/Touch/normalTouch';

export default class IdentifyView extends Component {

    render() {

        return (
            <View style={styles.container}>
                <Button
                    title="Identify Youself"
                    onPress={() => this.props.identifySuccessful()}
                />
            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '$screenWidth',
        // height: 100,
        backgroundColor: 'green',
    },
});
