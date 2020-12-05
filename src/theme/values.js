import { Dimensions } from 'react-native';

const size = require('../../@incpad/decorators/decorators/react-native-size');
const { height, width } = Dimensions.get('window');
const originValue = {
    color: {
        white: '#ffffff',
        black: '#000000',
        red: '#CC2B01',
        grey: '#EDF1F5',
        yellow: '#feae2e',
        lightCyanBlue: '#6c8490',
        deepBlue: '#697ad8',
        darkBlue: '#1A2B51',
        darkerBlue: '#222F8F',
        blue: '#2278FF',
        lightBlue: '#F7FAFF',
        green: '#66DB96',
        lightGreen: '#AFF56E',
        darkGreen: '#71FE22',
        deepGreen: '#1F6509',
        mainGreen: '#22700A',
        lightRed: '#FF6E70',
        darkGrey: '#858585',
        purple: '#44198F',
        greyLine: '#E4E4E4',
        lightGray: '#4A4848',
        deepGray: '#454545',
        grayLineColor: '#DBDBDB',
        grayIcon: '#767676',
    },
    icon: {
        logIn: 'ios-log-in',
        logOut: 'ios-log-out',
        dropDown: 'ios-arrow-down',
        phone: 'ios-phone-portrait',
        device: 'ios-finger-print',
    },
    @size('px2pt') normalPadding: 10,
    @size('px2pt') normalMargin: 10,
};
const computedValue = {
    screenWidth: width,
    screenHeight: height,
    doubleNormalPadding: originValue.normalPadding * 2,
    doubleNormalMargin: originValue.normalMargin * 2,
};

const basePx = 730;
export const scale = iElemPx => (iElemPx / basePx) * computedValue.screenHeight;
export default {
    ...originValue,
    ...computedValue,
};
