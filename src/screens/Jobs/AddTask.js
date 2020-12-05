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
    title: 'Add Task To',
    right: '',
})
@inject('jobsIndexStore')
@observer
class AddTask extends Component {

    constructor(props) {

        super(props);
        const { job_id, job_name } = this.props.navigation.state.params;
        this.timer = null;

        this.state = {
            jobId: job_id,
            task: '',
            jobName: job_name,
            // isFirstLoad: true,
        };

    }

    componentDidMount() {}

    componentWillUnmount() {

        if (this.timer) {

            clearInterval(this.timer);

        }

    }

    render() {

        const { isPostingTask, createTaskSuccess } = this.props.jobsIndexStore;
        const { jobId, task } = this.state;
        const { t } = this.props;

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
                    <Button
                        mode="contained"
                        style={[
                            styles.buttonStyle,
                            { backgroundColor: skin.$grayIcon },
                        ]}
                        onPress={this.cancelEditTask.bind(this)}
                    >
                        <Text>CANCEL</Text>
                    </Button>
                    <Button
                        mode="contained"
                        style={styles.buttonStyle}
                        onPress={this.saveTask.bind(this, jobId, task)}
                    >
                        <Text>SAVE</Text>
                    </Button>
                </View>
                <View>{isPostingTask ? <Loading /> : <Text />}</View>
                <Portal>
                    <Dialog visible={createTaskSuccess}>
                        <Dialog.Content>
                            <Text>{t('AddTaskSuccess')}</Text>
                        </Dialog.Content>
                    </Dialog>
                </Portal>
                {/* <Loading style={{display: isDisplay}}/> */}
                {/* <Portal>
                    <Dialog>
                        <Dialog.Content>
                            {createTaskSuccess ? (<Loading />) : <Text>Successful！</Text>}
                        </Dialog.Content>
                    </Dialog>
                </Portal> */}
            </ScrollView>
        );

    }

    saveTask(job_id, title) {

        if (title.length === 0) {

            return (
                <View>
                    <Snackbar>Task title is null;</Snackbar>
                </View>
            );

        }
        this.props.jobsIndexStore.fetchAddTask(job_id, title);

    }

    cancelEditTask() {

        this.props.navigation.goBack();

    }

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
        flexDirection: 'row',
        marginTop: 100,
        justifyContent: 'space-around',
    },

    buttonStyle: {
        backgroundColor: '$deepGreen',
        width: 160,
        height: 48,
        justifyContent: 'center',
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

export default withNamespaces(['EditTask'], { wait: true })(AddTask);
