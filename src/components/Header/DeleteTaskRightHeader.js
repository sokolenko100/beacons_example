import React, { Component } from 'react';
import { View, Text, DeviceEventEmitter } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { Button } from 'react-native-paper';
import config from '../../config/index';
export default class DeleteTaskRightHeader extends Component {

    deleteTask = () => {

        const { monitorConfig } = config;
        DeviceEventEmitter.emit(monitorConfig.deleteTask);

    };

    render() {

        return (
            <Button
                style={styles.container}
                mode="contained"
                onPress={this.deleteTask}
            >
                <Text>Delete</Text>
            </Button>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        width: 80,
        height: 40,
        marginRight: skin.$normalPadding,
    },
});
