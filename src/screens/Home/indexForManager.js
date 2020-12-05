/* eslint-disable id-length */
import React, { Component } from 'react';
import { View } from 'react-native';
import HeaderD from '../../decorators/header.decorator';
import BottomRight from '../../components/Float/BottomRight';
import Touch from '../../components/Touch/normalTouch';
import Circle from '../../components/Circle/Circle';
import Icon from 'react-native-vector-icons/Ionicons';
import StyleSheet from 'react-native-extended-stylesheet';
import { withNamespaces } from 'react-i18next';

@HeaderD({
    left: 'Time',
    title: 'null',
    right: 'UserInfo',
})
class IndexFormanager extends Component {

    constructor(props) {

        super(props);
        const { t } = this.props;
        this.state = {
            labels: [t('MessageAlert'), t('JobsCrew')],
        };

    }

    render() {

        return (
            <View style={styles.container}>
                <BottomRight distance={{ right: 20, bottom: 40 }}>
                    <Touch onPress={() => {}}>
                        <View>
                            <Circle
                                radius={25}
                                backgroundColor={skin.$mainGreen}
                            >
                                <Icon
                                    name="ios-add"
                                    style={{ color: 'white' }}
                                    size={25}
                                />
                            </Circle>
                        </View>
                    </Touch>
                </BottomRight>
            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '$grey',
        paddingBottom: 0,
    },
    flatList: {
        flexGrow: 1,
        backgroundColor: skin.$white,
    },
});

export default withNamespaces(['MoreIndex'], { wait: true })(IndexFormanager);
