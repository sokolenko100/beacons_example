import React, { Component } from 'react';
import CommonHeaderTitle from '../components/Header/CommonHeaderTitle';
import CommonHeaderTime from '../components/Header/CommonHeaderTime';
import CommonHeaderRight from '../components/Header/CommonHeaderRight';
import TextHeader from '../components/Header/TextHeader';
import TextTitleHeader from '../components/Header/TextTitleHeader';
import BackHeader from '../components/Header/BackHeader';
import NormalTimer from '../components/Timer/NormalTimer';
import UserInfo from '../components/Header/UserImage';
import DeleteTask from '../components/Header/DeleteTaskRightHeader';
const headerComp = {
    Time: CommonHeaderTime,
    NormalRight: CommonHeaderRight,
    NormalTitle: CommonHeaderTitle,
    TextTitleHeader,
    Back: BackHeader,
    UserInfo,
    DeleteTask,
    null: () => null,
};
const get = need('lodash.get');
function HeaderD(comps) {

    return function(target) {

        if (!comps) {

            target.navigationOptions = {
                header: null,
            };
            return target;

        }
        const Left = get(headerComp, comps.left, props => (
            <TextHeader text={comps.left} />
        ));
        const Right = get(headerComp, comps.right, props => (
            <TextHeader text={comps.right} />
        ));
        const Title = get(headerComp, comps.title, props => (
            <TextHeader text={comps.title} />
        ));
        target.navigationOptions = ({ navigation }) => ({
            headerTitle: (
                <Title
                    pageName={comps.pageName}
                    navigation={navigation}
                    position="center"
                />
            ),
            headerLeft:
                comps.left === 'Time' ? (
                    <NormalTimer>
                        <Left
                            pageName={comps.pageName}
                            navigation={navigation}
                            position="left"
                        />
                    </NormalTimer>
                ) : (
                    <Left
                        pageName={comps.pageName}
                        navigation={navigation}
                        position="left"
                    />
                ),
            headerRight:
                comps.right === 'Time' ? (
                    <NormalTimer>
                        <Right
                            pageName={comps.pageName}
                            navigation={navigation}
                            position="right"
                        />
                    </NormalTimer>
                ) : (
                    <Right
                        pageName={comps.pageName}
                        navigation={navigation}
                        position="right"
                    />
                ),
            // headerStyle: {
            //     backgroundColor: navigation.getParam(
            //         'bgColor',
            //         skin.$headerBgColor,
            //     ),
            // },
        });
        return target;

    };

}
export default HeaderD;
