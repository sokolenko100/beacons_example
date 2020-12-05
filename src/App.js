import './lang';
import './global';
import React from 'react';
import {
    createAppContainer,
    createSwitchNavigator,
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Sentry } from 'react-native-sentry';
import { Text, TextInput } from 'react-native';

TextInput.defaultProps = Object.assign({}, TextInput.defaultProps, { allowFontScaling: false, defaultProps: false })
Text.defaultProps = Object.assign({}, Text.defaultProps, { allowFontScaling: false })

// Auth
import Login from './screens/Auth/login';
import AuthCheck from './screens/Auth/authCheck';
// router for different roles
import AppNavigatorManager from './router/manager';
import AppNavigatorStaff from './router/staff';
// sentry configure
Sentry.config(
    'https://e76b0ae59aa54eefba12a608a9580bfc@sentry.io/1256617',
)
    .install();

const stackWithAuth = createSwitchNavigator(
    {
        AuthCheck,
        Auth: createStackNavigator({
            Login,
        }),
        MainForManager: AppNavigatorManager,
        MainForStaff: AppNavigatorStaff,
    },
    {
        initialRouteName: 'AuthCheck',
    },
);
const AppContainer = createAppContainer(stackWithAuth);
export default class App extends React.Component {

    render() {
        return (
            <PaperProvider>
                <AppContainer/>
            </PaperProvider>
        );
    }
}
