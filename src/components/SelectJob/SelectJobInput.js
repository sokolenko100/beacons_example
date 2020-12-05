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
class SelectJobInput extends Component {

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
                key={SelectJobInput.ALL_JOB_ID.toString()}
                value={SelectJobInput.ALL_JOB_ID.toString()}
                text={'All'}
                selected={selected === SelectJobInput.ALL_JOB_ID}
                onPress={() => {

                    this.setState(
                        {
                            selectedJobID: SelectJobInput.ALL_JOB_ID,
                        },
                        () => {

                            this._hideDialog();
                            this.props.onChange(SelectJobInput.ALL_JOB_ID);

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
        if (selected !== SelectJobInput.ALL_JOB_ID) {

            jobInfo = modelStore.getModel('job', selected);

        }
        return (
            <Touch onPress={this._showDialog}>
                <View>
                    <Text
                        style={{
                            fontSize: 23,
                            color: skin.$lightGray,
                            lineHeight: 30,
                        }}
                    >
                        {this.props.label || 'Job'}
                    </Text>
                    <View style={SelectJobStyles.container}>
                        {selected === SelectJobInput.ALL_JOB_ID ? (
                            <View>
                                <Text style={SelectJobStyles.jobText}>
                                    {this.props.placeholder || 'Choose a job'}
                                </Text>
                            </View>
                        ) : (
                            <View>
                                <Text style={SelectJobStyles.jobText}>
                                    {jobInfo.get('name')}
                                </Text>
                            </View>
                        )}

                        <View>
                            <Icon
                                name={skin.$selectorDropDown}
                                size={20}
                                color={skin.$lightGray}
                            />
                        </View>
                        <Portal>
                            <Dialog
                                visible={this.state.visible}
                                onDismiss={this._hideDialog}
                            >
                                <Dialog.Title>{t('SelectJob')}</Dialog.Title>
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
                </View>
            </Touch>
        );

    }

}

SelectJobInput.ALL_JOB_ID = -1;
SelectJobInput.propTypes = {
    commonStore: PropTypes.object,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    label: PropTypes.string,
};
const SelectJobStyles = StyleSheet.create({
    container: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: '$normalPadding',
        // backgroundColor: '$jobSelectorBgColor',
        borderWidth: 1,
        borderColor: '$lightGray',
    },
    jobText: {
        color: '$lightGray',
    },
});
export default withNamespaces(['ActivityIndex', 'common'], { wait: true })(
    SelectJobInput,
);
