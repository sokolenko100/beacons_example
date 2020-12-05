/* eslint-disable id-length */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
class TextTitleHeader extends Component {

    render() {

        const { t } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>
                    {t(`pageTitle.${this.props.pageName}`)}
                </Text>
            </View>
        );

    }

}
TextTitleHeader.propTypes = {
    pageName: PropTypes.string,
};
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '$normalPadding',
    },
    headerText: {
        color: '$white',
        fontSize: 21,
    },
});
export default withNamespaces(['common'], { wait: true })(TextTitleHeader);
