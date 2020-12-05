/* eslint-disable id-length */
import React, { Component } from 'react';
import { View, BackHandler, ScrollView, Text, RefreshControl } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { observer, inject } from 'mobx-react';
import HeaderD from '../../decorators/header.decorator';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
import { Card } from 'react-native-paper';
import Loading from '../../components/Loading/MdNormalLoading';
import {
    HVCenterView,
    NoData,
    CrewsCard,
    ActivityCrewCard, IncFlatList,
} from '../../components';

@HeaderD({
    left: 'Time',
    title: 'null',
    right: 'UserInfo',
    pageName: 'CrewIndex',
})
@inject(['commonStore'])
@observer
class CrewIndex extends Component {

    constructor(props) {

        super(props);
        this.state = {
            list: [],
        };
        this._flastList = null;
        this.setTimeOut = null;
    }

    componentDidMount() {

        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        this.setTimeOut = setTimeout(() => this.queryList(), 300);
        this.props.navigation.setParams({ queryList: this.queryList });

    }

    queryList = () => {
        this.getJobList();
        this.getUserList();
    };

    componentWillUnmount() {
        clearTimeout(this.setTimeOut);
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);

    }

    onBackPress = () => {
    };

    jumpToAddCrew = params => {
        this.props.navigation.navigate('AddCrew', params);
    };

    renderCrewsCard = (item, key) => (
        <CrewsCard
            key={key.toString()}
            item={item}
            navigation={this.props.navigation}
            style={{
                marginTop: skin.$doubleNormalMargin,
            }}
        />
    );
    renderActivityCrewCard = (item, key) => (
        <ActivityCrewCard
            key={key.toString()}
            item={item}
            navigation={this.props.navigation}
            jumpToAddCrew={this.jumpToAddCrew}
            refreshList={this.queryList}
            style={{
                marginTop: skin.$doubleNormalMargin,
            }}
        />
    );

    getUserList = () => global.ASY('users.children')
        .then(res => {

            if (res) {

                this.setState({ list: res.list });

            }

        });

    getJobList = () => {

        this.props.commonStore.fetchJobList();

    };

    renderEmpty = () => (
        <HVCenterView style={{ flex: 1 }}>
            <NoData/>
        </HVCenterView>
    );

    render() {

        const { t, commonStore } = this.props;
        const { isLoadingJobList } = this.props.commonStore;
        return (
            <View style={styles.container}>
                {commonStore.jobList.length > 0 ? (
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 20, alignItems: 'center' }}
                        refreshControl={<RefreshControl
                            onRefresh={this.queryList}
                            refreshing={isLoadingJobList}
                            colors={[skin.$deepGreen]}
                            tintColor={skin.$deepGreen}
                        />}
                        ref={ref => this._flastList = ref}
                        style={styles.scrollableTabView}
                    >
                        {commonStore.jobList.map((item, key) => this.renderActivityCrewCard(item, key),
                        )}
                        {this.state.list.length > 0 ? (
                            <Card style={styles.card}>
                                <Card.Content>
                                    <Text
                                        style={[
                                            styles.litterFont,
                                            styles.deepColor,
                                        ]}
                                    >
                                        OTHER CREW MEMBERS
                                    </Text>
                                    <View style={styles.lineView}/>
                                    {this.state.list.map((item, key) => this.renderCrewsCard(item, key),
                                    )}
                                </Card.Content>
                            </Card>
                        ) : null}
                    </ScrollView>
                ) : (
                    <View style={styles.loadView}>
                        {isLoadingJobList ? (
                            <Loading/>
                        ) : (
                            <NoData label={t('noCrew')}/>
                        )}
                    </View>
                )}
            </View>
        );

    }

}

// isLoadingJobList ? <Loading/> : <NoData label={t('noCrew')}/>

CrewIndex.propTypes = {
    navigation: PropTypes.object,
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        backgroundColor: '$grey',
    },
    loadView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    scrollableTabView: {
        flex: 1,
        // paddingBottom: 20,
    },
    card: {
        width: '$screenWidth - $doubleNormalPadding',
        paddingTop: 0,
        marginVertical: '$normalMargin',
    },
    lineView: {
        height: 1,
        backgroundColor: '$greyLine',
        marginTop: '$normalMargin',
    },
    litterFont: {
        fontSize: 14,
    },
    greyColor: {
        color: '$darkGrey',
    },
    deepColor: {
        color: '$black',
    },
});
export default withNamespaces(['NoData'], { wait: true })(CrewIndex);
