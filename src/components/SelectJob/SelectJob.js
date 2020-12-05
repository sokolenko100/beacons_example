/* eslint-disable id-length */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { withNamespaces } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import { Portal, Dialog } from 'react-native-paper';
import { observer, inject } from 'mobx-react';
import Touch from '../Touch/normalTouch';
import Loading from '../Loading/MdNormalLoading';
import RadioAndroid from '../Radio/RadioAndroid';
// ---------------------------
@observer
@inject('commonStore')
class SelectJob extends Component {

    static ALL_JOB_ID = -1;
    constructor(props) {

        super();
        this.state = {
            visible: false,
            selectedJobID: -1,
        };
        props.commonStore.fetchJobList();

    }
    _showDialog = () => this.setState({ visible: true });

    _hideDialog = () => this.setState({ visible: false });
    initList = (jobList, selected) => {

        const tempArr = jobList.map(job => (
            <RadioAndroid
                key={job.getID().toString()}
                value={job.get('name')}
                text={job.get('name')}
                selected={selected === job.getID()}
                onPress={() => {

                    this.setState(
                        {
                            selectedJobID: job.getID(),
                        },
                        () => {

                            this._hideDialog();
                            this.props.onChange(job.getID());

                        },
                    );

                }}
            />
        ));
        tempArr.unshift(
            <RadioAndroid
                key={SelectJob.ALL_JOB_ID.toString()}
                value={SelectJob.ALL_JOB_ID.toString()}
                text={this.props.t('SelectJob')}
                selected={selected === SelectJob.ALL_JOB_ID}
                onPress={() => {

                    this.setState(
                        {
                            selectedJobID: SelectJob.ALL_JOB_ID,
                        },
                        () => {

                            this._hideDialog();
                            this.props.onChange(SelectJob.ALL_JOB_ID);

                        },
                    );

                }}
            />,
        );
        return tempArr;

    };
    render() {

        const { t } = this.props;
        const { isLoadingJobList, jobList } = this.props.commonStore;
        const selected = this.state.selectedJobID;
        let jobInfo = null;
        if (selected !== -1) {

            jobInfo = modelStore.getModel('job', selected);

        }
        return (
            <Touch onPress={this._showDialog}>
                <View style={SelectJobStyles.container}>
                    {selected === -1 ? (
                        <View>
                            <Text style={SelectJobStyles.jobText}>
                                {t('SelectJob')}
                            </Text>
                        </View>
                    ) : (
                        <View>
                            <Text style={SelectJobStyles.jobText}>
                                {jobInfo.get('name')}
                            </Text>
                            <Text style={SelectJobStyles.jobText}>
                                {jobInfo.get('address')}
                            </Text>
                        </View>
                    )}
                    <View>
                        <Icon
                            name={skin.$selectorDropDown}
                            size={20}
                            color={skin.$white}
                        />
                    </View>
                    <Portal>
                        <Dialog
                            visible={this.state.visible}
                            onDismiss={this._hideDialog}
                        >
                            <Dialog.Title>{t('SelectJobTitle')}</Dialog.Title>
                            <Dialog.Content>
                                {isLoadingJobList ? (
                                    <Loading />
                                ) : (
                                    this.initList(jobList, selected)
                                )}
                            </Dialog.Content>
                        </Dialog>
                    </Portal>
                </View>
            </Touch>
        );

    }

}

SelectJob.ALL_JOB_ID = -1;
SelectJob.propTypes = {
    commonStore: PropTypes.object,
    onChange: PropTypes.func,
};
const SelectJobStyles = StyleSheet.create({
    container: {
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: '$normalPadding',
        backgroundColor: '$jobSelectorBgColor',
    },
    jobText: {
        color: '$white',
    },
});
export default withNamespaces(['ActivityIndex', 'common'], { wait: true })(
    SelectJob,
);
