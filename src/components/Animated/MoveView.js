import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';

const [width, height] = [skin.$screenWidth, skin.$screenHeight];
export default class ConfirmAlert extends Component {

    static defaultProps = {
        startDelta: height,
        endDelta: height - 168,
        useNativeDriver: global.isIos,
        duration: 450,
        tapClose: true,
        showBk: true,
    };

    constructor(props) {

        super(props);
        this.state = {
            animationValue: new Animated.Value(0),
            isOpen: false,
            bkShow: false,
        };

    }

    open = () => {

        this.setState({ isOpen: true, bkShow: true }, () => {

            Animated.spring(this.state.animationValue, {
                toValue: 1,
                duration: this.props.duration - 300,
                friction: 9,
                useNativeDriver: this.props.useNativeDriver,
            }).start();

        });

    };

    close = () => {

        this.setState({ bkShow: false }, () => {

            Animated.spring(this.state.animationValue, {
                toValue: 0,
                duration: this.props.duration,
                friction: 9,
                useNativeDriver: this.props.useNativeDriver,
            }).start(() => this.setState({ isOpen: false }));

        });

    };

    tapClose = () => {

        if (this.props.tapClose) {

            this.close();

        }

    };

    render() {

        const {
            style,
            contentStyle,
            startDelta,
            endDelta,
            children,
            showBk,
        } = this.props;
        const { isOpen, animationValue, bkShow } = this.state;
        const animatedStyle = {
            transform: [
                {
                    translateY: animationValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [startDelta, endDelta],
                    }),
                },
            ],
        };
        if (isOpen) {

            return showBk ? (
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.tapClose()}
                    style={[styles.container, style]}
                >
                    {bkShow ? (
                        <View
                            style={{
                                width,
                                height,
                                backgroundColor: 'rgba(0,0,0,0.3)',
                            }}
                        />
                    ) : null}
                    <Animated.View
                        ref={ref => (this.mainView = ref)}
                        style={[styles.content, animatedStyle, contentStyle]}
                    >
                        {children}
                    </Animated.View>
                </TouchableOpacity>
            ) : (
                <Animated.View
                    ref={ref => (this.mainView = ref)}
                    style={[styles.content, animatedStyle, contentStyle]}
                >
                    {children}
                </Animated.View>
            );

        }
        return null;

    }

}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width,
        height,
        top: 0,
        zIndex: 3,
        //  backgroundColor:'rgba(0,0,0,0.3)'
    },
    content: {
        width,
        height: 168,
        backgroundColor: '#FFFFFF',
        position: 'absolute',
    },
});
