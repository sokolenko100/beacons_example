/** @format */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import setup from './setup';
// if (!__DEV__) {
//     global.console = {
//         info: () => {
//         },
//         log: () => {
//         },
//         warn: () => {
//         },
//         debug: () => {
//         },
//         error: () => {
//         },
//     };
// }
AppRegistry.registerComponent(appName, () => setup());
