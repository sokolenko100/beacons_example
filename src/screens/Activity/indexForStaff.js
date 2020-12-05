import React, { Component } from 'react';
import { View,BackHandler } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { observer, inject } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
import BottomRight from '../../components/Float/BottomRight';
import NoData from '../../components/NoData/NoData';
import ActivitySingleCheckCard from '../../components/Card/ActivityListItem';
import ErrorBoundaryWithoutDisplay from '../../components/ErrorBoundaries/ErrorBoundaryWithoutDisplay';
import HeaderD from '../../decorators/header.decorator';
import HVCenterView from '../../components/SpecView/HVCenterView';
import SplashScreen from 'react-native-splash-screen';
import Circle from '../../components/Circle/Circle';
import CheckIcon from '../../assets/svg/checkIcon.svg';
import Touch from '../../components/Touch/normalTouch';
import IncFlatList from '../../components/FlatList/IncFlatList';
@HeaderD({
    left: 'Time',
    title: 'null',
    right: 'UserInfo',
})
@inject('activityIndexStore', 'commonStore')
@observer
class Index extends Component {

    jumpToCheck = () => {

        this.props.navigation.navigate('HomeIndex');

    };

    constructor(props) {

        super();
        //SplashScreen.hide();
        this.state = {
            jobID: null,
        };

        props.navigation.setParams({
            bgColor: skin.$headerBgColor,
            queryList: this.handleRefresh,
        });
        // props.commonStore.fetchJobList();
        // props.activityIndexStore.fetchMyLatest();

    }

    componentDidMount() {

        this.handleRefresh();
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);

    }

    handleRefresh = (jobID = null) => {

        this.props.commonStore.fetchJobList();
        if (jobID) {
            this.setState(
                {
                    jobID,
                },
                () => {
                    if (this._flastList) {
                        this._flastList.refresh();
                    }
                },
            );
        } else if (this._flastList) {
            this._flastList.refresh();
        }

    };

    queryList = (page, postRefresh, endFetch, isRefresh = true) => {

        const { jobID } = this.state;
        this.props.activityIndexStore.fetchMyLatest(
            page,
            jobID,
            isRefresh,
            endFetch,
            postRefresh,
        );

    };

    componentWillUnmount() {

        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);

    }

    onBackPress = () => {};

    render() {

        const { ActivityList } = this.props.activityIndexStore;
        return (
            <View style={styles.container}>
                <IncFlatList
                    onFetch={this.queryList}
                    data={ActivityList}
                    ref={ref => (this._flastList = ref)}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={this.renderItem}
                    ListEmptyComponent={this.renderListEmptyComponent}
                    contentContainerStyle={styles.flatList}
                />
                <BottomRight
                    distance={{
                        right: 20,
                        bottom: 40,
                    }}
                >
                    <Touch onPress={this.jumpToCheck}>
                        <View>
                            <Circle
                                radius={25}
                                backgroundColor={skin.$deepGreen}
                            >
                                <CheckIcon width={25} height={25} />
                            </Circle>
                        </View>
                    </Touch>
                </BottomRight>
            </View>
        );

    }

    renderItem = (item, index, separators) => {

        if (item) {

            return (
                <ErrorBoundaryWithoutDisplay>
                    <ActivitySingleCheckCard
                        ActivityModel={item}
                        onClickEdit={() =>{
                            this.props.navigation.navigate('EditActivity', { record_id: item.ID, callback: this.handleRefresh });
                        }}
                    />
                </ErrorBoundaryWithoutDisplay>
            );

        }

        return null;

    };

    renderListEmptyComponent = () => {

        const label = this.props.t('noActivity');
        const { isLoadingActivityList } = this.props.activityIndexStore;
        return (
            <HVCenterView style={{ flex: 1 }}>
                <NoData label={label} />
            </HVCenterView>
        );

    };

}

Index.propTypes = {
    navigation: PropTypes.object,
    activityIndexStore: PropTypes.object,
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '$grey',
        paddingBottom: 0,
    },
    flatList: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '$grey',
    },
});

export default withNamespaces(['NoData', 'ActivityIndex', 'common'], {
    wait: true,
})(Index);
