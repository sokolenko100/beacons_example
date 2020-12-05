import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import {
    TextInput,
    Button,
    Card,
    Paragraph,
    Portal,
    Dialog,
} from 'react-native-paper';
import StyleSheet from 'react-native-extended-stylesheet';
import HeaderD from '../../decorators/header.decorator';
import { observer, inject } from 'mobx-react';
import format from 'date-fns/format';
import ErrorBoundaryWithoutDisplay from '../../components/ErrorBoundaries/ErrorBoundaryWithoutDisplay';
import TaskItem from './TaskItem';
import NoData from '../../components/NoData/NoData';
import HVCenterView from '../../components/SpecView/HVCenterView';
import Loading from '../../components/Loading/MdNormalLoading';
import { withNamespaces } from 'react-i18next';
@HeaderD({
    left: 'Back',
    title: 'null',
    right: 'null',
})
@inject('jobsIndexStore', 'commonStore')
@observer
class JobEdit extends Component {

    constructor(props) {

        super(props);
        const { JobModel } = this.props.navigation.state.params;
        const { page, totalPage } = this.props.jobsIndexStore;
        this.timer = null;
        this.state = {
            JobModels: JobModel,
            editNotes: JobModel.get('notes'),
            currentNetPage: page,
            displayPage: 1,
            total: totalPage,
        };
        props.jobsIndexStore.fetchTasksList(JobModel.get('ID'));

    }

    componentDidMount() {}

    componentWillUnmount() {

        if (this.timer) {

            clearTimeout(this.timer);

        }

    }

    render() {

        const { JobModels } = this.state;
        const name = JobModels.get('name');
        const address = JobModels.get('address');
        const startTime = format(JobModels.get('startedDate'), 'MMM DD,YYYY');
        const endDate = format(JobModels.get('endDate'), 'MMM DD,YYYY');
        const contact = JobModels.get('contact');
        const { t } = this.props;
        const { isPostingTask, editJobSuccess } = this.props.jobsIndexStore;
        if (editJobSuccess === true) {

            if (!this.timer) {

                this.timer = setTimeout(() => {

                    this.props.commonStore.fetchJobList();
                    this.props.jobsIndexStore.changeEidtJobTag(false);
                    this.props.navigation.goBack();

                }, 1000);

            }

        }
        return (
            <ScrollView style={styles.container}>
                <Text
                    style={[styles.bigFont, { marginTop: skin.$normalPadding }]}
                >
                    {name}
                </Text>

                {/* <View style={[styles.borderView, {marginTop: skin.$doubleNormalMargin}]}>
                    <Text style={[styles.greyText, styles.bigFont, {padding: 5 }]}>{address}</Text>
                </View> */}

                <Card style={{ marginTop: skin.$doubleNormalMargin }}>
                    <Card.Content>
                        <Paragraph>{address}</Paragraph>
                    </Card.Content>
                </Card>
                <View style={styles.workTime}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={[styles.bigFont, styles.cyanText]}>
                            Start
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: skin.$normalPadding,
                            }}
                        >
                            <Text style={[styles.bigFont, styles.greyText]}>
                                {startTime}
                            </Text>
                            {/* <Icon
                                name="paper"
                                size={60}
                                color={skin.$darkGrey}
                            /> */}
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={[styles.bigFont, styles.cyanText]}>
                            End
                        </Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: skin.$normalPadding,
                            }}
                        >
                            <Text style={[styles.bigFont, styles.greyText]}>
                                {endDate}
                            </Text>
                            {/* <Icon
                                name="paper"
                                size={60}
                                color={skin.$darkGrey}
                            /> */}
                        </View>
                    </View>
                </View>
                {/* <View style={styles.workingsHoursSection}>
                    <View style={styles.workingHours}>
                        <View>
                            <Text>8:00 am</Text>
                            <Icon />
                        </View>
                        <View>
                            <Text>5:30 pm</Text>
                            <Icon />
                        </View>
                    </View>
                    <Icon>Time Rules</Icon>
                </View> */}
                {this.renderContact(contact)}
                {this.renderNotes()}
                {this.renderTasks()}
                {this.renderActionButtons()}
                <View>{isPostingTask ? <Loading /> : <Text />}</View>
                <Portal>
                    <Dialog visible={editJobSuccess}>
                        <Dialog.Content>
                            <Text>{t('SaveTaskSuccess')}</Text>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
                <View />
            </ScrollView>
        );

    }

    renderContact(contact) {

        if (contact !== null) {

            const contactName = contact.first_name + contact.last_name;
            const { phone } = contact;
            const { email } = contact;
            return (
                <View
                    style={{
                        flexDirection: 'column',
                        marginTop: skin.$doubleNormalMargin,
                    }}
                >
                    <Text style={[styles.cyanText, styles.bigFont]}>
                        Contact
                    </Text>

                    <Card style={{ marginTop: skin.$normalPadding }}>
                        <Card.Content>
                            <Text>Primary Contact: {contactName}</Text>
                            <Text>Phone: {phone}</Text>
                            <Text>Email: {email}</Text>
                        </Card.Content>
                    </Card>
                </View>
            );

        }

    }

    renderNotes() {

        return (
            <View
                style={{
                    flexDirection: 'column',
                    marginTop: skin.$doubleNormalMargin,
                }}
            >
                <TextInput
                    placeholder="Notes"
                    label="Notes"
                    style={{ marginTop: skin.$normalPadding }}
                    value={this.state.editNotes}
                    disabled={false}
                    multiline={true}
                    onChangeText={text => this.setState({ editNotes: text })}
                />
                {/* <TextInput
                    label="Notes"
                    value={this.state.editNotes}
                    disabled={false}
                    multiline={true}
                    // underlineColor={skin.$deepGreen}
                    // selectionColor={skin.$deepGreen}
                    style={{ marginTop: skin.$normalPadding }}
                    onChangeText={text => this.setState({ editNotes: text })}
                /> */}
            </View>
        );

    }

    renderTasks() {

        const job_id = this.state.JobModels.get('ID');
        const job_name = this.state.JobModels.get('name');

        const { taskList, isLoadingTaskList } = this.props.jobsIndexStore;
        return (
            <View
                style={{
                    flexDirection: 'column',
                    marginTop: skin.$doubleNormalMargin,
                }}
            >
                <View style={styles.taskHeader}>
                    <Text
                        style={[
                            styles.cyanText,
                            styles.bigFont,
                            { marginTop: skin.$normalPadding },
                        ]}
                    >
                        Tasks
                    </Text>
                    <Button
                        mode="text"
                        onPress={() => this.props.navigation.navigate('AddTask', {
                            job_id,
                            job_name,
                        })
                        }
                    >
                        <Text style={{ color: skin.$deepGreen }}>
                            Add Task +
                        </Text>
                    </Button>
                </View>
                <View
                    style={{
                        flex: 1,
                        height: 2,
                        backgroundColor: skin.$grayLineColor,
                    }}
                />
                <FlatList
                    refreshing={false}
                    data={taskList}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ErrorBoundaryWithoutDisplay>
                            <TaskItem
                                taskItem={item}
                                onClickEdit={() => {

                                    this.props.navigation.navigate('EditTask', {
                                        job_id,
                                        job_name,
                                        task_id: item.id,
                                        job_task: item.title,
                                    });

                                }}
                            />
                        </ErrorBoundaryWithoutDisplay>
                    )}
                    onRefresh={() => this.requestTaskListData()}
                    onEndReached={() => this.requestTaskListData()}
                    onEndReachedThreshold={0.1}
                    ListEmptyComponent={
                        <HVCenterView style={{ flex: 1 }}>
                            {isLoadingTaskList ? <Loading /> : <NoData />}
                        </HVCenterView>
                    }
                />
            </View>
        );

    }

    renderActionButtons() {

        return (
            <View style={styles.buttons}>
                <Button
                    mode="contained"
                    onPress={this.cancelButtonClick}
                    style={[
                        styles.buttonStyle,
                        { backgroundColor: skin.$grayIcon },
                    ]}
                >
                    <Text>CANCEL</Text>
                </Button>
                <Button
                    mode="contained"
                    onPress={this.saveJobButtonClick.bind(this)}
                    style={styles.buttonStyle}
                >
                    <Text>SAVE</Text>
                </Button>
            </View>
        );

    }

    requestTaskListData() {
        /* return;
        const job_id = this.state.JobModels.get('ID');
        
        this.props.jobsIndexStore.fetchTasksList(job_id); */
    }

    cancelButtonClick = () => {

        this.props.navigation.goBack();

    };

    saveJobButtonClick() {

        const notes = this.state.JobModels.get('notes');
        const { editNotes } = this.state;
        // if (notes === editNotes) return;
        const job_id = this.state.JobModels.get('ID');
        this.props.jobsIndexStore.fetchEditJob(job_id, editNotes);

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '$grey',
        flexDirection: 'column',
        padding: '$normalPadding',
    },
    workTime: {
        flexDirection: 'row',
        marginTop: '$doubleNormalMargin',
        justifyContent: 'space-between',
    },
    workingsHoursSection: {
        flexDirection: 'row',
    },
    workingHours: {
        flexDirection: 'row',
    },

    borderView: {
        borderWidth: 1,
        borderColor: '$grayIcon',
        borderRadius: 5,
        padding: 5,
        marginTop: 5,
    },

    greyText: {
        color: '$lightGray',
    },

    cyanText: {
        color: '#6c8490',
    },

    bigFont: {
        fontSize: 15,
    },

    litterFont: {
        fontSize: 13,
    },

    taskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    buttons: {
        width: skin.$screenWidth - skin.$doubleNormalMargin * 2,
        height: 160,
        flexDirection: 'row',
        // marginTop: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '$normalPadding',
    },

    buttonStyle: {
        marginLeft: '$normalPadding',
        backgroundColor: '$deepGreen',
        width: 100,
        height: 48,
        justifyContent: 'center',
    },
});

export default withNamespaces(['EditTask'], { wait: true })(JobEdit);
