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
import Activity from '../screens/Activity/indexForManager';
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
import BLE from '../screens/BLE/index';

//Notification
import Notification from '../screens/Notification/index';

const defaultNavigationOptions = {
    headerStyle: {
        backgroundColor: skin.$headerBgColorForManager,
        height: 130,
    },
};
const tabbarManageer = createMaterialBottomTabNavigator(
    {
        Home: createStackNavigator(
            {
                Notification,
            },
            { defaultNavigationOptions },
        ),
        Activity: createStackNavigator(
            {
                ActivityIndex: Activity,
            },
            {
                defaultNavigationOptions,
            },
        ),
        Crew: createStackNavigator(
            {
                CrewIndex: Crew,
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
                    Home: 'as-home',
                    Activity: 'clock-circle',
                    Crew: 'as-crew',
                    Jobs: 'as-job',
                    More: 'menu',
                };
                if (routeName === 'Activity' || routeName === 'More') {
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
// stack for manager
const AppNavigatorManager = createStackNavigator(
    {
        TabBar: {
            screen: tabbarManageer,
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
        EditActivity: {
            screen: EditActivity,
        },
        AddCrew: {
            screen: AddCrew,
        },
        Enrollment: {
            screen: Enrollment,
        },
        BLE: {
            screen: BLE,
        },
        JobEdit: {
            screen: JobEdit,
        },
        AddTask: {
            screen: AddTask,
        },
        EditTask: {
            screen: EditTask,
        },
        // Notification: {
        //     screen: Notification,
        // },
    },
    {
        mode: 'modal',
        headerMode: 'screen',
        initialRouteName: 'TabBar',
        defaultNavigationOptions,
    },
);
export default AppNavigatorManager;
