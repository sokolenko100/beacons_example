import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

class RecordStatus extends Component {

    static defaultProps = {
        style: {},
        status: '',
    };

    setStatus = (status, pending_status) => {
        let backgroundColor = skin.$yellow;
        let _status = '';
        if (pending_status === 'review') {
            _status = 'Pending';
        } else {
            switch (status) {
                case 'error-noLocation':
                    _status = 'No Location';
                    break;
                case 'error-in':
                    _status = 'Overtime';
                    break;
                case 'error-out':
                    _status = 'Overtime';
                    break;
                case 'error-multiple':
                    _status = 'Multiple Job';
                    break;
                default:
                    backgroundColor = 'transparent';
                    break;
            }
        }
        return { backgroundColor, _status };
    };

    render() {

        const { status, style, pending_status } = this.props;
        const { backgroundColor, _status } = this.setStatus(status, pending_status);
        return (
            <View style={[styles.container, { ...style }, { backgroundColor }]}>
                <Text style={style.text}>{_status}</Text>
            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        height: 20,
        paddingHorizontal: 6,
        borderRadius: 4,
        justifyContent: 'center',
    },
    text: {
        fontSize: 18,
        color: skin.$white,
        textAlign: 'center',
    },
});
export default RecordStatus;
