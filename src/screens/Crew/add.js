import React, { Component } from 'react';
import { Text, View } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { observer } from 'mobx-react';
import HeaderD from '../../decorators/header.decorator';
import { withNamespaces } from 'react-i18next';
import PropTypes from 'prop-types';
import { Button, Card, Dialog, Paragraph, Portal, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Touch from '../../components/Touch/normalTouch';
import Loading from '../../components/Loading/MdNormalLoading';
import RadioAndroid from '../../components/Radio/RadioAndroid';

const width = skin.$screenWidth - skin.$normalMargin * 4;

@HeaderD({
    left: 'Back',
    title: 'ADD CREW',
    right: 'null',
    pageName: 'AddCrew',
})
@observer
class AddCrew extends Component {

    constructor(props) {

        super(props);
        const job = this.props.navigation.state.params.job;
        this.callback = this.props.navigation.state.params.callback;
        this.state = {
            job_id: job ? job.ID : '',
            selectedTask: '',
            selectedEmployee: '',
            selectedName: job ? job.name : '',
            jobModel: null,
            tasks: [],
            employee: [],
            pickerType: -1, // 0:employee 1:tasks
            errorMsg: '',
            saveLoading: false,
            employeeLoading: false,
            taskLoading: false,
        };
        this.job = job;
        this.toggle = false;
        this.MoveView = null;
        this.selectedTaskId = '';
        this.selectedEmployeeId = '';

    }

    componentDidMount() {

        // this.getJobDetailInfo();
        // this.getEmployee();

    }

    renderActionButtons = () => (
            <View style={styles.buttons}>
                <Button
                    mode="text"
                    onPress={this.cancelButtonClick}
                    style={[styles.buttonStyle, { backgroundColor: 'transparent' }]}
                >
                    <Text style={{ color: skin.$deepGreen }}>CANCEL</Text>
                </Button>
                <Button
                    mode="contained"
                    onPress={this.saveJobButtonClick}
                    loading={this.state.saveLoading}
                    style={styles.buttonStyle}
                >
                    <Text>SAVE</Text>
                </Button>
            </View>
        );

    renderTaskView = () => {
        const { selectedTask } = this.state;
        return (<Touch onPress={() => this.openModal(1)}>
            <View
                style={{
                    flexDirection: 'row',
                    flex: 1,
                    justifyContent: 'space-between',
                }}
            >
                <Paragraph>{selectedTask ? selectedTask.title : ''}</Paragraph>
                <Icon
                    size={20}
                    color={skin.$deepGreen}
                    name={skin.$selectorDropDown}
                />
            </View>
        </Touch>);
        // if (global.isIos) {
        //
        //     return (
        //         <Touch onPress={() => this.showIosPicker(1)}>
        //             <View
        //                 style={{
        //                     flexDirection: 'row',
        //                     flex: 1,
        //                     justifyContent: 'space-between',
        //                 }}
        //             >
        //                 <Paragraph>{selectedTask ? tasks[selectedTask].title : ''}</Paragraph>
        //                 <Icon
        //                     size={20}
        //                     color={skin.$deepGreen}
        //                     name={skin.$selectorDropDown}
        //                 />
        //             </View>
        //         </Touch>
        //     );
        //
        // }
        // return (
        //     <PickerAnd
        //         selectedValue={this.state.selectedTask}
        //         mode={'dialog'}
        //         onValueChange={(value, index) => {
        //
        //             this.setState({ selectedTask: value });
        //             this.selectedTaskId = this.state.tasks[index].id;
        //
        //         }}
        //         style={styles.picker}
        //     >
        //         {this.state.tasks.map((task, key) => (
        //             <PickerAnd.Item
        //                 label={task.title}
        //                 value={task.title}
        //                 key={key.toString}
        //             />
        //         ))}
        //     </PickerAnd>
        // );

    };

    showIosPicker = (type = 0) => {

        this.setState({ pickerType: type });
        if (this.MoveView) {

            this.MoveView.open();

        }

    };

    openModal = (type) => {
        type === 0 ? this.getEmployee() : this.getJobDetailInfo();
        this.setState({ pickerType: type, selectorVisible: true });
    };

    renderEmployeeView = () => {
        const { selectedEmployee } = this.state;

        return (
            <Touch onPress={() => this.openModal(0)}>
                <View
                    style={{
                        flexDirection: 'row',
                        flex: 1,
                        justifyContent: 'space-between',
                    }}
                >
                    <Paragraph>{selectedEmployee ? global.getFullName(selectedEmployee) : ''}</Paragraph>
                    <Icon
                        size={20}
                        color={skin.$deepGreen}
                        name={skin.$selectorDropDown}
                    />
                </View>
            </Touch>
        );
        // if (global.isIos) {
        //
        //     return (
        //         <Touch onPress={() => this.showIosPicker(0)}>
        //             <View
        //                 style={{
        //                     flexDirection: 'row',
        //                     flex: 1,
        //                     justifyContent: 'space-between',
        //                 }}
        //             >
        //                 <Paragraph>{this.state.selectedEmployee}</Paragraph>
        //                 <Icon
        //                     size={20}
        //                     color={skin.$deepGreen}
        //                     name={skin.$selectorDropDown}
        //                 />
        //             </View>
        //         </Touch>
        //     );
        //
        // }
        // return (
        //     <PickerAnd
        //         selectedValue={this.state.selectedEmployee}
        //         mode={'dialog'}
        //         onValueChange={(value, index) => {
        //
        //             this.setState({ selectedEmployee: value });
        //             this.selectedEmployeeId = this.state.employee[index].id;
        //
        //         }}
        //         style={styles.picker}
        //     >
        //         {this.state.employee.map((employee, key) => (
        //             <PickerAnd.Item
        //                 label={`${employee.first_name} ${employee.last_name}`}
        //                 value={`${employee.first_name} ${employee.last_name}`}
        //                 key={key.toString}
        //             />
        //         ))}
        //     </PickerAnd>
        // );

    };

    render() {

        const { errorMsg, pickerType, employeeLoading, taskLoading, employee, tasks, selectedEmployee, selectedTask } = this.state;
        const isEmployee = pickerType === 0;
        const loading = isEmployee ? employeeLoading : taskLoading;
        const pickerList = isEmployee ? employee : tasks;
        const selected = isEmployee ? selectedEmployee.id : selectedTask.id;
        return (
            <View style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Job</Text>
                    <Card>
                        <Card.Content style={styles.cardContent}>
                            <Paragraph style={{ fontSize: 18 }}>
                                {this.job.name ? this.job.name : ''}
                            </Paragraph>
                        </Card.Content>
                    </Card>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Lookup Employee</Text>
                    <View>
                        <Card>
                            <Card.Content style={styles.cardContent}>
                                {this.renderEmployeeView()}
                            </Card.Content>
                        </Card>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Task</Text>
                    <View>
                        <Card>
                            <Card.Content style={styles.cardContent}>
                                {this.renderTaskView()}
                            </Card.Content>
                        </Card>
                    </View>
                </View>
                {this.renderActionButtons()}
                <Portal>
                    <Dialog
                        visible={this.state.selectorVisible}
                        onDismiss={() => {
                            this.setState({
                                selectorVisible: false,
                            });
                        }}
                    >
                        <Dialog.Title>{isEmployee ? 'Look Up Employee' : 'Select Task'}</Dialog.Title>
                        <Dialog.Content>
                            {loading ? (
                                <Loading/>
                            ) : (
                                pickerList.map(item => (
                                    <RadioAndroid
                                        key={item.id.toString()}
                                        value={item.id.toString()}
                                        text={isEmployee ? global.getFullName(item) : item.title}
                                        selected={selected === item.id}
                                        onPress={() => {
                                            if (isEmployee) {
                                                this.selectedEmployeeId = item.id;
                                                this.setState(
                                                    {
                                                        selectedEmployee: item,
                                                    },
                                                    () => {

                                                        this.setState({
                                                            selectorVisible: false,
                                                        });
                                                        // this.props.onChange(job.getID());

                                                    },
                                                );
                                            } else {
                                                this.selectedTaskId = item.id;
                                                this.setState(
                                                    {
                                                        selectedTask: item,
                                                    },
                                                    () => {

                                                        this.setState({
                                                            selectorVisible: false,
                                                        });

                                                    },
                                                );
                                            }

                                        }}
                                    />
                                ))
                            )}
                        </Dialog.Content>
                    </Dialog>
                </Portal>
                <Snackbar
                    visible={!!errorMsg}
                    onDismiss={() => this.setState({ errorMsg: '' })}
                    theme={{
                        colors: { background: '#ffffff', text: 'black' },
                    }}
                >
                    {errorMsg}
                </Snackbar>
            </View>
        );

    }

    getJobDetailInfo = () => {
        this.setState({ taskLoading: true });
        global.ASY('jobs.detail', '', `/${this.job.ID}`)
            .then(data => {
                this.setState({ taskLoading: false });

                if (data && data.model) {

                    this.setState({
                        jobModel: data.model,
                        tasks: data.model.tasks ? data.model.tasks : [],
                    });

                }

            })
            .catch(error => {
                this.setState({ taskLoading: false });
            });
    };

    getEmployee = () => {
        this.setState({ employeeLoading: true });
        global.ASY('users.list', { size: 100, roleType: [3, 4, 5].join(',') })
            .then(data => {
                this.setState({ employeeLoading: false });
                if (data && data.code === 200) {
                    this.setState({
                        employee: data.list ? data.list : [],
                    });

                }

            })
            .catch(error => {
                this.setState({ employeeLoading: false });
            });
    };

    cancelButtonClick = () => {

        this.props.navigation.pop();

    };

    saveJobButtonClick = () => {

        const { selectedTaskId, selectedEmployeeId } = this;
        if (selectedEmployeeId) {

            this.setState({ saveLoading: true });
            const params = {
                user_id: selectedEmployeeId,
                task_id: selectedTaskId,
                job_id: this.job.ID,
            };
            global.ASY('crews.create', null, '', params)
                .then(data => {

                    if (data.code === 200) {

                        if (this.callback) {

                            this.callback();

                        }
                        this.setState({ saveLoading: false }, () => this.props.navigation.goBack(),
                        );

                    } else {

                        this.setState({
                            saveLoading: false,
                            errorMsg: data.message
                                ? data.message
                                : 'User already exists in this job',
                        });

                    }

                });

        } else {

            this.setState({ errorMsg: 'Employee must be selected' });

        }

    };

}

AddCrew.propTypes = {
    navigation: PropTypes.object,
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '$grey',
        // flexDirection: 'row',
    },

    section: {
        justifyContent: 'center',
        flexDirection: 'column',
        width,
        marginTop: 20,
    },

    sectionHeader: {
        fontSize: 22,
        color: '#6c8490',
        textAlignVertical: 'center',
        textAlign: 'left',
        marginBottom: skin.$normalMargin,
    },
    cardContent: {
        paddingVertical: 8,
        flexDirection: 'row',
    },

    picker: {
        flex: 1,
        //  backgroundColor: 'red',
        height: 30,
        paddingLeft: 0,
        // marginTop: 30,
    },
    arrowView: {
        justifyContent: 'center',
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
export default withNamespaces(['test', 'common'], { wait: true })(AddCrew);
