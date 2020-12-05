/* eslint-disable id-length */
import React, { Component } from 'react';
import { View, BackHandler } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { observer, inject } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
import NoData from '../../components/NoData/NoData';
import JobItem from '../../components/Card/JobListItem';
import ErrorBoundaryWithoutDisplay from '../../components/ErrorBoundaries/ErrorBoundaryWithoutDisplay';
import HeaderD from '../../decorators/header.decorator';
import { IncFlatList } from '../../components/index';
import Loading from '../../components/Loading/MdNormalLoading';
import HVCenterView from '../../components/SpecView/HVCenterView';
import SplashScreen from 'react-native-splash-screen';
import SelectJob from '../../components/SelectJob/SelectJob';

@HeaderD({
    left: 'Time',
    title: 'null',
    right: 'UserInfo',
})
@inject('commonStore')
@observer
class Index extends Component {

    constructor(props) {

        super();
        //SplashScreen.hide();
        this.state = {
            jobID: null,
        };
        props.navigation.setParams({ bgColor: skin.$headerBgColor });
        this._flastList = null;
        this.handleRefresh();
    }

    componentDidMount() {

        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        this.props.navigation.setParams({
            queryList: this.handleRefresh,
        });

    }

    componentWillUnmount() {

        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);

    }

    handleRefresh = () => {
        if (this._flastList) {
            this._flastList.refresh();
        }
    };


    queryList = (page, postRefresh, endFetch, isRefresh = true) => {
        this.props.commonStore.fetchJobList(page, postRefresh, endFetch, isRefresh);
    };

    onBackPress = () => {
    };

    render() {

        const { jobList, isLoadingJobList } = this.props.commonStore;
        const { t } = this.props;
        return (
            <View style={styles.container}>
                <IncFlatList
                    onFetch={this.queryList}
                    data={jobList}
                    ref={ref => (this._flastList = ref)}
                    keyExtractor={(item, index) => item.getID()
                        .toString()}
                    renderItem={(item, index) => (
                        <ErrorBoundaryWithoutDisplay>
                            <JobItem
                                JobModel={item}
                                onClickEdit={() => {
                                    this.props.navigation.navigate('JobEdit', {
                                        JobModel: item,
                                    });

                                }}
                            />
                        </ErrorBoundaryWithoutDisplay>
                    )}
                    ListEmptyComponent={()=> <HVCenterView style={{ flex: 1 }}>
                            {isLoadingJobList ? (
                                <Loading/>
                            ) : (
                                <NoData label={t('noJob')}/>
                            )}
                        </HVCenterView>}
                    contentContainerStyle={styles.flatList}
                />
            </View>
        );

    }

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
        width: '$screenWidth',
        alignItems: 'center',
        backgroundColor: '$grey',
        paddingBottom: skin.$normalPadding,
    },
});

export default withNamespaces(['NoData', 'ActivityIndex', 'common'], {
    wait: true,
})(Index);
