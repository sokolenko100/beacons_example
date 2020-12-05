/* eslint-disable id-length */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
class NormalTimer extends Component {

    static getDerivedStateFromProps(np, ps) {

        const { startTime } = np;
        if (startTime !== ps.startTime) {

            return {
                startTime,
                counter: 0,
            };

        }
        return null;

    }
    static defaultProps = {
        startTime: null,
    };
    constructor(props) {

        super(props);
        this.state = {
            startTime: null,
            counter: 0,
        };
        this.timer = null;
        const { Provider, Consumer } = React.createContext(0);
        this.Provider = Provider;
        this.Consumer = Consumer;

    }
    componentDidMount() {

        if (!this.timer) {

            this.timer = setInterval(() => {

                const { counter } = this.state;
                this.setState({
                    counter: counter + 1,
                });

            }, 1000);

        }

    }
    componentWillUnmount() {

        if (this.timer) {

            clearInterval(this.timer);

        }

    }
    render() {

        const { t } = this.props;
        const { counter } = this.state;
        const { Provider, Consumer } = this;
        return (
            <Provider value={counter}>
                <Consumer>
                    {value => React.Children.map(this.props.children, child => React.cloneElement(child, {
                        timerCount: value,
                    }),
                    )
                    }
                </Consumer>
            </Provider>
        );

    }

}
NormalTimer.propTypes = {
    navigation: PropTypes.object,
    startTime: PropTypes.string,
};
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '$normalPadding',
    },
});
export default withNamespaces(['components', 'common'], { wait: true })(
    NormalTimer,
);
