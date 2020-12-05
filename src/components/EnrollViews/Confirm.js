import React, { Component } from 'react';
import { View, Button } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

export default class Confirm extends Component {

    render() {

        return (
            <View style={styles.container}>
                <Button title="Confirm" onPress={() => this.props.confirm()} />
            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '$screenWidth',
        // height: 100,
        backgroundColor: 'red',
    },
});
