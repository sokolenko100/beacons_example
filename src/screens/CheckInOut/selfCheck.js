/* eslint-disable id-length */
import React, { Component } from 'react';
import { BackHandler, Text, View } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { observer, inject } from 'mobx-react';
import HeaderD from '../../decorators/header.decorator';
import { withNamespaces } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import format from 'date-fns/format';

import {
    TextInput,
    Button,
    Modal,
    Portal,
    Card,
    Snackbar,
} from 'react-native-paper';

import SwipeLogin from '../../assets/svg/swipeLoginSpec.svg';
import HVCenterView from '../../components/SpecView/HVCenterView';

@HeaderD({
    left: 'Back',
    title: 'null',
    right: 'null',
    pageName: 'CheckInOutIndex',
})
@inject('activityIndexStore', 'commonStore')
@observer
class SelfCheck extends Component {

    constructor(props) {

        super(props);
        this.state = {
            query: '',
            password: '',
            errorMsg: '',
            visible: false,
            data: {},
            snackBarVisible: false,
        };
        // props.navigation.setParams({ bgColor: skin.$darkerBlue });

    }

    componentDidMount() {

        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);

    }

    componentWillUnmount() {

        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);

    }

    onBackPress = () => {

        this.props.navigation.goBack();

    };
    doCheck = () => {

        this.setState({
            errorMsg: '',
        });
        const jobID = this.props.navigation.getParam('jobID');
        API.get('users.myCheckIn')
            .then(data => {

                if (data?.data?.code !== 200) {

                    tap(data?.data);
                    this.setState({
                        snackBarVisible: true,
                        errorMsg: data?.data?.message,
                    });
                    return;

                }
                // re-fetch record list
                this.props.activityIndexStore.fetchLatest(jobID);
                // clear input
                this.setState({
                    data: data?.data,
                });
                // show success modal
                this._showModal();

            })
            .catch(error => {

                this.setState({
                    snackBarVisible: true,
                    errorMsg: 'user not found',
                });

            })
            .finally(() => {

                this.props.commonStore.updateCheckInfo();

            });

    };
    jumpToCheckByAccount = () => {

        this.props.navigation.navigate('CheckInOutIndex');

    };
    _showModal = () => this.setState({ visible: true });
    _hideModal = () => this.setState({ visible: false });

    render() {

        const { t } = this.props;
        const { data } = this.state;
        const roles = loginUser.get('roles');
        const isSuper = Array.isArray(roles) && roles.includes('supervisor');
        return (
            <View style={styles.container}>
                <SwipeLogin
                    fill={'red'}
                    stroke={'red'}
                    width={200}
                    height={100}
                    style={{ color: 'red' }}
                />
                <Snackbar
                    visible={this.state.snackBarVisible}
                    onDismiss={() => this.setState({ snackBarVisible: false })}
                    theme={{
                        colors: { background: '#ffffff', text: 'black' },
                    }}
                >
                    {this.state.errorMsg}
                </Snackbar>
                <Button
                    mode="contained"
                    color={skin.$deepGreen}
                    style={styles.button}
                    onPress={this.doCheck}
                >
                    <Text style={styles.buttonText}>
                        {t('CheckInOutButtonText')}
                    </Text>
                </Button>
                {isSuper ? (
                    <View style={{ width: '100%' }}>
                        <View style={styles.OrSwipeLogin}>
                            <Text style={styles.OrSwipeLoginText}>
                                {t('OrCheckByAccountText')}
                            </Text>
                        </View>
                        <Button
                            mode="contained"
                            color={skin.$deepGreen}
                            style={styles.jumpButton}
                            onPress={this.jumpToCheckByAccount}
                        >
                            <Text style={styles.buttonText}>
                                {t('OrCheckByAccountButtonLabel')}
                            </Text>
                        </Button>
                    </View>
                ) : null}

                <Portal>
                    <Modal
                        visible={this.state.visible}
                        onDismiss={this._hideModal}
                    >
                        <Card style={{ width: 280, alignSelf: 'center' }}>
                            <Card.Content
                                style={{
                                    backgroundColor: skin.white,
                                    height: 280,
                                    padding: skin.$doubleNormalPadding,
                                }}
                            >
                                <View style={styles.successIcon}>
                                    <Icon
                                        name="md-checkmark"
                                        size={60}
                                        color={skin.$lightGreen}
                                    />
                                </View>
                                <View style={styles.successText}>
                                    <Text
                                        style={{
                                            fontSize: 22,
                                            textAlign: 'center',
                                        }}
                                    >
                                        {`${data?.user?.first_name} ${
                                            data?.user?.last_name
                                        } checked ${
                                            data?.record?.type
                                        } at ${format(
                                            data?.record?.check_at,
                                            'hh:mm a',
                                        )}.`}
                                    </Text>
                                    <View
                                        style={{
                                            width: '100%',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Button
                                            mode="contained"
                                            color={skin.$deepGreen}
                                            style={[
                                                styles.button,
                                                {
                                                    width: 100,
                                                    height: 40,
                                                },
                                            ]}
                                            onPress={this._hideModal}
                                        >
                                            <Text
                                                style={[
                                                    styles.buttonText,
                                                    {
                                                        lineHeight: 20,
                                                    },
                                                ]}
                                            >
                                                OK
                                            </Text>
                                        </Button>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    </Modal>
                </Portal>
            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '$grey',
        padding: '$doubleNormalPadding',
    },
    input: {
        width: '100%',
        marginTop: '$normalMargin * 3',
        height: 60,
        borderWidth: 0,
    },
    button: {
        width: '100%',
        marginTop: '$normalMargin * 3',
        height: 60,
        color: '$white',
        justifyContent: 'center',
    },
    buttonText: {
        lineHeight: 40,
        marginVertical: 0,
    },
    jumpButton: {
        width: '100%',
        marginTop: '$normalMargin * 2',
        height: 60,
        color: '$white',
        justifyContent: 'center',
    },
    successIcon: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successText: {
        justifyContent: 'center',
    },
    OrSwipeLogin: {
        width: '100%',
        marginTop: '$doubleNormalMargin',
    },
    OrSwipeLoginText: {
        color: '$black',
    },
});
export default withNamespaces(['CheckInOutIndex', 'common'], { wait: true })(
    SelfCheck,
);
