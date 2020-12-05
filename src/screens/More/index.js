/* eslint-disable id-length */
import React, { Component } from 'react';
import { BackHandler, FlatList, Text, View, ScrollView, Dimensions,Platform } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { observer, inject } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
import { List, Divider, Button } from 'react-native-paper';
import HeaderD from '../../decorators/header.decorator';
import ErrorBoundaryWithoutDisplay from '../../components/ErrorBoundaries/ErrorBoundaryWithoutDisplay';
import Icon from 'react-native-vector-icons/Ionicons';
import HVCenterView from '../../components/SpecView/HVCenterView';
import DeviceInfo from 'react-native-device-info';
import Share from 'react-native-share';

const mainWith = skin.$screenWidth - skin.$doubleNormalPadding * 4;

@HeaderD({
    left: 'Time',
    title: 'null',
    right: 'null',
})
@inject(['commonStore'])
@observer
class MoreIndex extends Component {

    constructor(props) {

        super(props);
        const { t } = this.props;
        this.state = {
            list: [
                {
                    label: t('enrollment'),
                    func: () => {

                        this.props.navigation.navigate('Enrollment');

                    },
                    right: {
                        tipIcon: {
                            name: 'ios-log-in',
                            color: skin.$darkGrey,
                            size: 25,
                        },
                        icon: {
                            name: 'ios-arrow-forward',
                            color: skin.$darkGrey,
                            size: 25,
                        },
                    },
                },
                // {
                //     label: t('MRR'),
                //     func: () => {
                //     },
                //     right: {
                //         tipIcon: {
                //             name: 'ios-paper',
                //             color: skin.$darkGrey,
                //             size: 25,
                //         },
                //         icon: {
                //             name: 'ios-arrow-forward',
                //             color: skin.$darkGrey,
                //             size: 25,
                //         },
                //     },
                // },
                // {
                //     label: t('TimeConfigure'),
                //     func: () => {
                //     },
                //     right: {
                //         tipIcon: {
                //             name: 'ios-timer',
                //             color: skin.$darkGrey,
                //             size: 25,
                //         },
                //         icon: {
                //             name: 'ios-arrow-forward',
                //             color: skin.$darkGrey,
                //             size: 25,
                //         },
                //     },
                // },
                // {
                //     label: t('AlertsAndNotification'),
                //     func: () => {
                //         // this.props.navigation.navigate('Notification');
                //     },
                //     right: {
                //         tipIcon: {
                //             name: 'ios-notifications-outline',
                //             color: skin.$darkGrey,
                //             size: 25,
                //         },
                //         icon: {
                //             name: 'ios-arrow-forward',
                //             color: skin.$darkGrey,
                //             size: 25,
                //         },
                //     },
                // },
                // {
                //     label: t('ProfileAndPassword'),
                //     func: () => {
                //     },
                //     right: {
                //         tipIcon: {
                //             name: 'ios-lock',
                //             color: skin.$darkGrey,
                //             size: 25,
                //         },
                //         icon: {
                //             name: 'ios-arrow-forward',
                //             color: skin.$darkGrey,
                //             size: 25,
                //         },
                //     },
                // },
                 {
                    label: t(`Version ${DeviceInfo.getVersion()}-${DeviceInfo.getBuildNumber()}`),
                    func: () => {
                    },
                    right: {
                        tipIcon: {
                            name: 'ios-information-circle-outline',
                            color: skin.$darkGrey,
                            size: 25,
                        },
                        // icon: {
                        //     name: 'ios-arrow-forward',
                        //     color: skin.$darkGrey,
                        //     size: 25,
                        // },
                    },
                },
                {
                    label: t('debug'),
                    func: () => {
                        this.props.navigation.navigate('BLE');
                    },
                    right: {
                        tipIcon: {
                            name: 'ios-log-out',
                            color: skin.$darkGrey,
                            size: 25,
                        },
                        icon: {
                            name: 'ios-arrow-forward',
                            color: skin.$darkGrey,
                            size: 25,
                        },
                    },
                },
                {
                    label: t('export log'),
                    func: () => {
                        const shareOptions = {
                            // title: 'Share via',
                            // message: 'some message',
                            url: (Platform.OS === 'android' ? 'file://' + LOG_PATH : LOG_PATH),
                            type: "text/plain",
                            social: Share.Social.WHATSAPP,
                            whatsAppNumber: "999999999", 
                        };
                        Share.open(shareOptions).catch((err) => { console.log(err); });
                    },
                    right: {
                        tipIcon: {
                            name: 'ios-log-out',
                            color: skin.$darkGrey,
                            size: 25,
                        },
                        icon: {
                            name: 'ios-arrow-forward',
                            color: skin.$darkGrey,
                            size: 25,
                        },
                    },
                },
            ],
        };
        this.height = Dimensions.get('window').height;
    }

    componentDidMount() {

        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        console.log(Dimensions.get('window'));
    }

    componentWillUnmount() {

        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);

    }

    onBackPress = () => {
    };

    onLogout = () => {

        this.props.commonStore.logout()
            .then(() => {
                // this.props.navigation.navigate('Auth');
            });

    };

    render() {

        const { list } = this.state;
        const { t } = this.props;
        console.log(this.height < (592 + 40 * global.adapt))
        return (
            <ScrollView scrollEnabled={this.height < (592 + 40 * global.adapt)}
                contentContainerStyle={[styles.container, global.isIos ? { flex: 1 } : {}]}>
                <List.Section style={{ width: '100%' }}>
                    {list.map((item, index) => (<ErrorBoundaryWithoutDisplay key={index.toString()}>
                        <List.Item
                            title={item.label}
                            onPress={item.func}
                            left={() => {

                                const tipIcon = item ?.right ?.tipIcon;
                                if (tipIcon) {

                                    return (
                                        <HVCenterView>
                                            <Icon
                                                style={{
                                                    marginRight:
                                                        skin.$normalPadding,
                                                    width: 25,
                                                }}
                                                name={
                                                    tipIcon
                                                        ? tipIcon.name
                                                        : ''
                                                }
                                                color={
                                                    tipIcon
                                                        ? tipIcon.color
                                                        : ''
                                                }
                                                size={
                                                    tipIcon
                                                        ? tipIcon.size
                                                        : 0
                                                }
                                            />
                                        </HVCenterView>
                                    );

                                }

                            }}
                            right={() => {

                                const icon = item ?.right ?.icon;

                                if (icon) {

                                    return (
                                        <HVCenterView>
                                            <Icon
                                                name={icon.name}
                                                color={icon.color}
                                                size={icon.size}
                                            />
                                        </HVCenterView>
                                    );

                                }

                            }}
                        />
                    </ErrorBoundaryWithoutDisplay>))}
                </List.Section>
                <Button
                    mode="contained"
                    style={styles.buttonStyle}
                    onPress={this.onLogout}
                >
                    <Text>LOGOUT</Text>
                </Button>
            </ScrollView>
        );

    }

}

MoreIndex.propTypes = {
    navigation: PropTypes.object,
    commonStore: PropTypes.object,
};
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'center',
        backgroundColor: '$grey',
        paddingBottom: 10
    },
    flatList: {
        flexGrow: 1,
    },
    buttonStyle: {
        backgroundColor: '$red',
        width: mainWith,
        height: 40 * global.adapt,
        justifyContent: 'center',
    },
});
export default withNamespaces(['MoreIndex', 'common'], { wait: true })(
    MoreIndex,
);
