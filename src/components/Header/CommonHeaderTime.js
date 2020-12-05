import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import format from 'date-fns/format';
class CommonHeaderTime extends Component {
    render() {
        const date = new Date();
        const { position } = this.props;
        return (
            <View style={styles.container}>
                <Text
                    style={[
                        styles.date,
                        {
                            textAlign: position,
                        },
                    ]}
                >
                    {format(date, 'MMM DD,YYYY')}
                </Text>
                <Text
                    style={[
                        styles.time,
                        {
                            textAlign: position,
                        },
                    ]}
                >
                    {format(date, 'hh:mma ')}
                </Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '$normalPadding',
    },
    time: {
        color: '$white',

        fontSize: 36,
    },
    date: {
        color: '$white',
        fontSize: 19,
    },
});
export default CommonHeaderTime;
