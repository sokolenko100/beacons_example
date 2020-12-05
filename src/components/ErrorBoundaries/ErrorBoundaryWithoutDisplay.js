import React from 'react';
import { View } from 'react-native';

class ErrorBoundaryWithoutDisplay extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            hasError: false,
        };

    }

    componentDidCatch(error, info) {

        tap('info', info);
        this.setState({ hasError: true });
        // TODO: should upload error to sentry here

    }

    render() {

        if (this.state.hasError) {

            return <View />;

        }
        return this.props.children;

    }

}

export default ErrorBoundaryWithoutDisplay;
