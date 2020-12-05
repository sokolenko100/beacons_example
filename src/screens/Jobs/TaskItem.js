import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

export default class TaskItem extends Component {

    constructor(props) {

        super(props);

    }

    static defaultProps = {
        onClickEdit: () => {},
    };

    render() {

        const { taskItem, onClickEdit } = this.props;
        return (
            <TouchableOpacity onPress={onClickEdit}>
                <View style={{ flexDirection: 'column' }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: 40,
                        }}
                    >
                        <Text style={{ color: skin.$darkerBlue }}>
                            {taskItem.title}
                        </Text>
                        <Icon
                            name="ios-arrow-forward"
                            size={25}
                            color={skin.$darkerBlue}
                        />
                    </View>
                    <View
                        style={{
                            width: 375,
                            height: 1,
                            backgroundColor: skin.$grayLineColor,
                        }}
                    />
                </View>
            </TouchableOpacity>
        );

    }

}

TaskItem.propTypes = {
    onClickEdit: PropTypes.func,
};
