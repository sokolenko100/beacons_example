/* eslint-disable id-length */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { withNamespaces } from 'react-i18next';
class CommonHeaderRight extends Component {

    render() {

        const { t } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.planned}>
                    {t('Header.CommonHeaderRight.plannedNum', { num: 10 })}
                </Text>
                <Text style={styles.working}>
                    {t('Header.CommonHeaderRight.workingNum', { num: 5 })}
                </Text>
            </View>
        );

    }

}
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '$normalPadding',
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
    CommonHeaderRight,
);
