import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';

// const stepNum = {
//     IdentifySelf: 0,
//     SwipeFinger: 1,
//     Confirm: 2,
// };

export default class Step extends Component {

    constructor(props) {

        super(props);

    }

    componentDidMount() {
    }

    render() {

        let identifySelfStyle;
        let swipeStyle;
        let confirmStyle;
        const { stepType } = this.props;
        switch (stepType) {

            case 0: {

                identifySelfStyle = { backgroundColor: '#71FE22' };
                swipeStyle = {
                    lineBackgroundColor: 'white',
                    borderColor: 'white',
                };
                confirmStyle = {
                    lineBackgroundColor: 'white',
                    borderColor: 'white',
                };
                break;

            }
            case 1: {

                identifySelfStyle = { backgroundColor: '#71FE22' };
                swipeStyle = {
                    lineBackgroundColor: '#71FE22',
                    borderColor: '#71FE22',
                };
                confirmStyle = {
                    lineBackgroundColor: 'white',
                    borderColor: 'white',
                };
                break;

            }
            case 2: {

                identifySelfStyle = { backgroundColor: '#71FE22' };
                swipeStyle = {
                    lineBackgroundColor: '#71FE22',
                    borderColor: '#71FE22',
                };
                confirmStyle = {
                    lineBackgroundColor: '#71FE22',
                    borderColor: '#71FE22',
                };
                break;

            }
            default:
                break;

        }

        return (
            <View style={styles.container}>
                <View style={styles.firstGroup}>
                    <View style={styles.lineGroup}>
                        <View style={styles.hiddenLine}/>
                        <View style={[styles.greenView, identifySelfStyle]}/>
                        <View
                            style={[
                                styles.rightLineView,
                                {
                                    backgroundColor:
                                    swipeStyle.lineBackgroundColor,
                                },
                            ]}
                        />
                    </View>
                    <Text style={styles.textStyle}>Step 1</Text>
                    <Text style={styles.textStyle}>Identify Yourself</Text>
                </View>
                <View style={styles.secondGroup}>
                    <View style={styles.lineGroup}>
                        <View
                            style={[
                                styles.leftLineView,
                                {
                                    backgroundColor:
                                    swipeStyle.lineBackgroundColor,
                                },
                            ]}
                        />
                        <View
                            style={[
                                styles.cornerRing,
                                { borderColor: swipeStyle.borderColor, marginRight: 0 },
                            ]}
                        />
                        <View
                            style={[
                                styles.rightLineView,
                                {
                                    backgroundColor:
                                    confirmStyle.lineBackgroundColor,
                                },
                            ]}
                        />
                    </View>
                    <Text style={styles.textStyle}>Step 2</Text>
                    <Text style={styles.textStyle}>Swipe Finger</Text>
                </View>
                <View style={styles.thirdGroup}>
                    <View style={styles.lineGroup}>
                        <View
                            style={[
                                styles.leftLineView,
                                {
                                    backgroundColor:
                                    confirmStyle.lineBackgroundColor,
                                },
                            ]}
                        />
                        <View
                            style={[
                                styles.cornerRing,
                                { borderColor: confirmStyle.borderColor },
                            ]}
                        />
                        <View style={styles.hiddenLine}/>
                    </View>
                    <Text style={styles.textStyle}>Step 3</Text>
                    <Text style={styles.textStyle}>Confirm</Text>
                </View>
            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '$darkerBlue',
        width: skin.$screenWidth,
        height: 120,
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '$darkerBlue',
    },

    leftLineView: {
        width:
            ((skin.$screenWidth -
                skin.$doubleNormalPadding -
                skin.$doubleNormalPadding) /
                3 -
                30) /
            2 + 1,
        height: 5,
        marginTop: 15,
        marginRight: 5,
        borderRadius: 2.5,
        backgroundColor: 'white',
    },

    rightLineView: {
        width:
            ((skin.$screenWidth -
                skin.$doubleNormalPadding -
                skin.$doubleNormalPadding) /
                3 -
                30) /
            2 + 5,
        height: 5,
        marginTop: 15,
        borderRadius: 2.5,
        backgroundColor: 'white',
        marginLeft: 5,
    },

    cornerRing: {
        width: 30,
        height: 30,
        marginRight: 5,
        borderRadius: 15,
        backgroundColor: '$darkerBlue',
        borderWidth: 5,
        borderColor: 'white',
    },

    greenView: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#71FE22',
    },

    firstGroup: {
        flexDirection: 'column',
        alignItems: 'center',
        width:
            (skin.$screenWidth -
                skin.$doubleNormalPadding -
                skin.$doubleNormalPadding) /
            3 + 20,
    },

    lineGroup: {
        flexDirection: 'row',
        marginBottom: 5,
    },

    secondGroup: {
        flexDirection: 'column',
        alignItems: 'center',
        width:
            (skin.$screenWidth -
                skin.$doubleNormalPadding -
                skin.$doubleNormalPadding) /
            3,
    },

    thirdGroup: {
        flexDirection: 'column',
        alignItems: 'center',
        width:
            (skin.$screenWidth -
                skin.$doubleNormalPadding -
                skin.$doubleNormalPadding) /
            3 + 20,
    },

    hiddenLine: {
        width:
            ((skin.$screenWidth -
                skin.$doubleNormalPadding -
                skin.$doubleNormalPadding) /
                3 -
                30) /
            2,
        height: 0,
        marginTop: 15,
        borderRadius: 2.5,
        backgroundColor: 'white',
        marginLeft: 5,
    },

    textStyle: {
        color: 'white',
    },
});
