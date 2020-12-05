import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import { Icon } from '@ant-design/react-native';
import AsIcon from '../components/Icon/Icon';
import React from 'react';
// CheckInOut
import CheckInOutIndex from '../screens/CheckInOut/index';
import SelfCheck from '../screens/CheckInOut/selfCheck';
import EditStamp from '../screens/CheckInOut/editStamp';

// Activity
import Activity from '../screens/Activity/indexForStaff';
import EditActivity from '../screens/Activity/edit';
// Crew
import Crew from '../screens/Crew/index';
import AddCrew from '../screens/Crew/add';
// Jobs
import Jobs from '../screens/Jobs/index';
import JobEdit from '../screens/Jobs/JobEdit';
import AddTask from '../screens/Jobs/AddTask';
import EditTask from '../screens/Jobs/EditTask';
// More
import MoreIndex from '../screens/More/index';
import Enrollment from '../screens/More/Enrollment';
// Home
import HomeIndex from '../screens/Home/indexForStaff';
// Notification
import Notification from '../screens/Notification';

import BLE from '../screens/BLE/index';

const defaultNavigationOptions = {
    headerStyle: {
        backgroundColor: skin.$headerBgColorForStaff,
        height: 130,
    },
};


// tabbar stack for staff
const tabbarStaff = createMaterialBottomTabNavigator(
    {
        Message: createStackNavigator(
            {
                Notification,
            },
            {
                defaultNavigationOptions,
            },
        ),
        Home: createStackNavigator(
            {
                HomeIndex,
            },
            {
                defaultNavigationOptions,
            },
        ),
        Activity: createStackNavigator(
            {
                ActivityIndex: Activity,
            },
            {
                defaultNavigationOptions,
            },
        ),
        Jobs: createStackNavigator(
            {
                Index: Jobs,
            },
            {
                defaultNavigationOptions,
            },
        ),
        More: createStackNavigator(
            {
                MoreIndex,
            },
            {
                defaultNavigationOptions,
            },
        ),
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {

                const { routeName } = navigation.state;
                const iconMap = {
                    Message: 'message',
                    Home: 'as-home',
                    Activity: 'clock-circle',
                    Crew: 'as-crew',
                    Jobs: 'as-job',
                    More: 'menu',
                };
                if (routeName === 'Activity' || routeName === 'More' || routeName === 'Message') {
                    return iconMap[routeName] ? (
                        <Icon
                            name={iconMap[routeName]}
                            size="md"
                            color={
                                focused
                                    ? skin.$bottomTabActiveColor
                                    : skin.$bottomTabNormalColor
                            }
                        />
                    ) : null;
                }
                return <AsIcon
                    name={iconMap[routeName]}
                    size={20}
                    color={
                        focused
                            ? skin.$bottomTabActiveColor
                            : skin.$bottomTabNormalColor
                    }
                />;

            },
            // tabBarVisible: false,
            tabBarOnPress: ({ navigation }) => {

                if (
                    navigation.state.routes[0].params &&
                    navigation.state.routes[0].params.queryList
                ) {

                    navigation.state.routes[0].params.queryList();

                }
                navigation.navigate(navigation.state.routeName);

            },
        }),
        shifting: false,
        barStyle: { backgroundColor: skin.$bottomTabBgColor },

        activeColor: skin.$bottomTabActiveColor,
        inactiveColor: skin.$bottomTabNormalColor,
    },
);

// stack for staff
const AppNavigatorStaff = createStackNavigator(
    {
        TabBar: {
            screen: tabbarStaff,
            navigationOptions: ({ navigation }) => ({
                header: null,
            }),
        },
        CheckInOutIndex: {
            screen: CheckInOutIndex,
        },
        SelfCheck: {
            screen: SelfCheck,
        },
        EditStamp: {
            screen: EditStamp,
        },
        EditActivity: {
            screen: EditActivity,
        },
        Enrollment: {
            screen: Enrollment,
        },
        JobEdit: {
            screen: JobEdit,
        },
        AddTask: {
            screen: AddTask,
        },
        BLE: {
            screen: BLE,
        },
        EditTask: {
            screen: EditTask,
        },
    },
    {
        mode: 'modal',
        headerMode: 'screen',
        initialRouteName: 'TabBar',
        defaultNavigationOptions,
    },
);
export default AppNavigatorStaff;
