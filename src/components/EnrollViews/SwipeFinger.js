import React, { Component } from 'react';
import { View, Button, Text } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

export default class SwipeFinger extends Component {

    render() {

        return (
            <View style={styles.container}>
                <Button
                    title="Swipe Finger"
                    onPress={() => this.props.swipeFinger()}
                />
                <Text>Swipe the same finger until all bars are green</Text>
            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '$screenWidth',
        // height: 100,
    },
});
