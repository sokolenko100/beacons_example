/* eslint-disable id-length */
import React, { Component } from 'react';
import { View } from 'react-native';
import HeaderD from '../../decorators/header.decorator';
import StepCom from '../../components/Step/Step';
import StyleSheet from 'react-native-extended-stylesheet';
import Confirm from '../../components/EnrollViews/Confirm';
import IdentifyView from '../../components/EnrollViews/IdentifyView';
import SwipeFinger from '../../components/EnrollViews/SwipeFinger';
import { Snackbar, Text } from 'react-native-paper';
import FigIconWhite from '../../assets/svg/FIGIconWhite.svg';
import Icon from 'react-native-vector-icons/Ionicons';
import { inject } from 'mobx-react';

@HeaderD({
    left: 'Back',
    title: 'Enroll',
})
@inject('activityIndexStore', 'commonStore', 'beaconIndexStore')
export default class Enrollment extends Component {

    constructor(props) {

        super(props);
        props.navigation.setParams({ bgColor: skin.$lightGreen });

        this.state = {
            stepNum: 0,
            errorMsg: '',
        };
        props.beaconIndexStore.setBeaconType('enrollment');

    }

    componentDidMount() {
        this.props.beaconIndexStore.addListener('beaconsDidRangeenrollment', info => {
            if (info.beacons.length) {
                const beacon = info.beacons[0];
                this.props.beaconIndexStore.FetchDoCheck(beacon, (SerialNumber) => this.deviceBind(SerialNumber),false);
            }
        });
    }

    componentWillMount() {
        this.props.beaconIndexStore.setBeaconType('enrollment');
    }

    componentWillUnmount() {
        this.props.beaconIndexStore.setBeaconType('activity');
    }

    stepAhead(step) {

        this.setState({
            stepNum: step + 1,
        });
        this.scrollView.scrollTo({
            x: skin.$screenWidth * (step + 1),
            y: 0,
            animated: true,
        });

    }

    renderItem() {

        const arr = [];
        arr.push(IdentifyView);
        arr.push(SwipeFinger);
        arr.push(Confirm);
        return arr;

    }

    deviceBind = (SerialNumber) => {
        console.log(SerialNumber,'==============')
        global.ASY('users.bindDevice',
            null,
            '',
            { user_id: loginUser.getID(), serial_number: SerialNumber })
            .then(res => {
                console.log('res: ', res);
                if (res.code === 200) {
                    this.setState({
                        errorMsg: `Bind Success\n Serial Number:${SerialNumber}\n`,
                    });
                } else {
                    this.setState({
                        errorMsg: `${res.message}\n Serial Number:${SerialNumber}\n`,
                    });
                }
            });
    };

    render() {

        const arr = [];
        const { stepNum, errorMsg } = this.state;
        arr.push(<IdentifyView identifySuccessful={() => this.stepAhead(0)}/>);
        arr.push(<SwipeFinger swipeFinger={() => this.stepAhead(1)}/>);
        arr.push(<Confirm confirm={() => {
        }}/>);
        const bindResult = errorMsg && errorMsg.includes('Bind Success');
        return (
            <View style={styles.container}>
                <View
                    style={{
                        width: skin.$screenWidth,
                        height: 120,
                        backgroundColor: 'red',
                    }}
                >
                    <StepCom stepType={this.state.stepNum}/>
                </View>
                <Text style={styles.tipText}>Swipe the same finger until</Text>
                <Text style={[styles.tipText, { marginTop: 0 }]}>
                    all bars are green
                </Text>
                <FigIconWhite
                    width={180}
                    height={90}
                    style={{ marginTop: skin.$normalPadding * 4 }}
                />
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: skin.$normalPadding * 4,
                    }}
                >
                    <View
                        style={
                            stepNum == 0
                                ? styles.swipeGreenView
                                : styles.swipeGrayView
                        }
                    />
                    <View
                        style={
                            stepNum == 1
                                ? styles.swipeGreenView
                                : styles.swipeGrayView
                        }
                    />
                    <View
                        style={
                            stepNum == 2
                                ? styles.swipeGreenView
                                : styles.swipeGrayView
                        }
                    />
                </View>
                <Text
                    style={[
                        styles.tipText,
                        { marginTop: skin.$normalMargin * 4 },
                    ]}
                >
                    Number of swipes: {stepNum}
                </Text>
                <Text style={styles.tipText}>Successful swipes: 1</Text>
                <Snackbar
                    visible={!!errorMsg}
                    onDismiss={() => this.setState({ errorMsg: '' })}
                >
                    {errorMsg}
                    {/* <Icon
                        name={
                            !bindResult
                                ? 'md-warning'
                                : 'md-checkmark'
                        }
                        size={30}
                        color={
                            !bindResult
                                ? skin.$yellow
                                : skin.$lightGreen
                        }
                    />*/}
                </Snackbar>
            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    tipText: {
        color: '$deepGray',
        fontSize: 22,
        marginTop: skin.$normalPadding,
    },
    swipeGreenView: {
        width: 100,
        height: 28,
        backgroundColor: '#267B05',
        marginRight: skin.$normalPadding,
    },
    swipeGrayView: {
        width: 100,
        height: 28,
        backgroundColor: skin.$grayLineColor,
        marginRight: skin.$normalPadding,
    },
});
