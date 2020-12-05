/* eslint-disable id-length */
import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { View } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { ActivityIndicator } from 'react-native-paper';
class MdNormalLoading extends Component {

    render() {

        const { t, display } = this.props;

        return (
            <View style={styles.container}>
                <ActivityIndicator animating={true} />
            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '$normalPadding',
    },
});
export default withNamespaces(['components', 'common'], { wait: true })(
    MdNormalLoading,
);
