import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import HeaderD from '../../decorators/header.decorator';
import { observer, inject } from 'mobx-react';
import { withNamespaces } from 'react-i18next';
import {
    Button,
    Card,
    TextInput,
    Paragraph,
    Portal,
    Dialog,
    Snackbar,
} from 'react-native-paper';
import Loading from '../../components/Loading/MdNormalLoading';

@HeaderD({
    left: 'Back',
    title: 'Edit Task To',
    right: '',
    pageName: 'Tasks',
})
@inject('jobsIndexStore')
@observer
class EditTask extends Component {

    constructor(props) {

        super(props);
        const {
            job_id,
            job_name,
            job_task,
            task_id,
        } = this.props.navigation.state.params;
        this.timer = null;
        this.isDelete = true;
        this.state = {
            jobId: job_id,
            taskId: task_id,
            task: job_task === undefined ? '' : job_task,
            jobName: job_name,
            visible: false,
            // isFirstLoad: true,
        };

    }

    componentDidMount() {
        // const { monitorConfig } = config;
        // this.subscription = DeviceEventEmitter.addListener(
        //     monitorConfig.deleteTask,
        //     this.deleteTask,
        // );
    }

    componentWillUnmount() {

        if (this.timer) {

            clearTimeout(this.timer);

        }
        // this.subscription.remove();

    }

    render() {

        const { isPostingTask, createTaskSuccess } = this.props.jobsIndexStore;
        const { taskId, task, visible } = this.state;
        const { t } = this.props;
        const tip = this.isDelete
            ? t('DeleteTaskSuccess')
            : t('SaveTaskSuccess');
        if (createTaskSuccess === true) {

            if (!this.timer) {

                this.timer = setTimeout(() => {

                    this.props.jobsIndexStore.resetTaskListPage();
                    this.props.jobsIndexStore.fetchTasksList(this.state.jobId);
                    this.props.jobsIndexStore.changeTaskPostTag(false);
                    this.props.navigation.goBack();

                }, 1000);

            }

        }
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.section}>
                    <Text
                        style={[
                            styles.header,
                            {
                                textAlignVertical: 'center',
                                textAlign: 'center',
                            },
                        ]}
                    >
                        Job
                    </Text>
                    <Card style={styles.jobName}>
                        <Card.Content>
                            <Paragraph
                                style={{
                                    fontSize: 15,
                                    marginTop: skin.$normalPadding,
                                }}
                            >
                                {this.state.jobName}
                            </Paragraph>
                        </Card.Content>
                    </Card>
                </View>
                <View style={styles.section}>
                    <Text
                        style={[
                            styles.header,
                            {
                                textAlignVertical: 'center',
                                textAlign: 'center',
                            },
                        ]}
                    >
                        Task
                    </Text>
                    <TextInput
                        placeholder="Task"
                        label="Task"
                        style={styles.inputStyle}
                        value={this.state.task}
                        disabled={false}
                        multiline={true}
                        onChangeText={text => this.setState({ task: text })}
                    />
                </View>
                <View style={styles.buttons}>
                    {/*          <Button
                        mode="contained"
                        style={[
                            styles.buttonStyle,
                            { backgroundColor: skin.$grayIcon },
                        ]}
                        onPress={this.cancelEditTask.bind(this)}
                    >
                        <Text>CANCEL</Text>
                    </Button>*/}
                    <Button
                        mode="text"
                        onPress={this.cancelEditTask.bind(this)}
                        style={[styles.buttonStyle, { backgroundColor: 'transparent' }]}
                    >
                        <Text style={{ color: skin.$deepGreen }}>CANCEL</Text>
                    </Button>
                    <Button
                        mode="contained"
                        style={styles.buttonStyle}
                        onPress={this.saveTask.bind(this, taskId, task)}
                    >
                        <Text>SAVE</Text>
                    </Button>
                    <Button
                        mode="contained"
                        style={[
                            styles.buttonStyle,
                            { backgroundColor: skin.$red },
                        ]}
                        onPress={() => this.toggleDialog(true)}
                    >
                        <Text>DELETE</Text>
                    </Button>
                </View>
                <View>{isPostingTask ? <Loading/> : <Text/>}</View>
                <Portal>
                    <Dialog visible={createTaskSuccess}>
                        <Dialog.Content>
                            <Text>{tip}</Text>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
                <Portal>
                    <Dialog
                        visible={visible}
                        onDismiss={() => this.toggleDialog(false)}>
                        <Dialog.Title>Are you sure</Dialog.Title>
                        <Dialog.Actions>
                            <Button color={skin.$deepGreen} style={styles.cancel} onPress={() => this.toggleDialog(false)}>Cancel</Button>
                            <Button mode="contained"
                                    style={styles.save} onPress={() => this.deleteTask()}>Ok</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ScrollView>
        );

    }

    saveTask(task_id, task) {

        if (task.length === 0) {

            return (
                <View>
                    <Snackbar>Task title is null;</Snackbar>
                </View>
            );
            // alert('task is null');
            // API.get("jobs.edit",{
            //     data:{
            //         title: "task3"
            //     },
            //     subPath:`/${id}`
            // })

        }
        this.isDelete = false;
        this.props.jobsIndexStore.fetchEditTask(task_id, task);

    }

    cancelEditTask() {

        this.props.navigation.goBack();

    }

    deleteTask = () => {
        const { taskId } = this.state;
        this.props.jobsIndexStore.fetchDeleteTask(taskId);
        this.toggleDialog(false);
    };

    toggleDialog = (visible) => {
        this.setState({ visible });
    };

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
    },

    section: {
        marginTop: 50,
        justifyContent: 'center',
        flexDirection: 'column',
        // marginTop: '$doubleNormalMargin',
        width: skin.$screenWidth - skin.$doubleNormalMargin * 2,
    },

    buttons: {
        width: skin.$screenWidth - skin.$doubleNormalMargin * 2,
        flexDirection: 'column',
        marginTop: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonStyle: {
        marginBottom: 10,
        backgroundColor: '$deepGreen',
        width: 180,
        height: 48,
        justifyContent: 'center',
    },

    save: {
        width: 90,
        backgroundColor: '$deepGreen',
    },
    cancel: {
        width: 90,
        color: '$deepGreen',
        marginRight: 5,
    },

    header: {
        fontSize: 22,
        color: '#6c8490',
    },

    jobName: {
        width: skin.$screenWidth - skin.$doubleNormalMargin * 2,
        height: 60,
    },

    inputStyle: {
        marginTop: '$normalPadding',
    },
});

export default withNamespaces(['EditTask'], { wait: true })(EditTask);
