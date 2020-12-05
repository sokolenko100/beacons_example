import React, { Component, Fragment } from 'react';
import { Text, View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { observer, inject } from 'mobx-react';
import HeaderD from '../../decorators/header.decorator';
import { withNamespaces } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Snackbar, ActivityIndicator, Portal, Dialog } from 'react-native-paper';
import format from 'date-fns/format';
import Touch from '../../components/Touch/normalTouch';
import RadioAndroid from '../../components/Radio/RadioAndroid';
import { AsIcon } from '../../components/index';

const DeviceIconSet = {
    phone: 'ios-phone-portrait',
    device: 'ios-finger-print',
    pc: 'as-computer',
};
const Reasons = ['Change Check-in Time', 'Change Check-out Time', 'Change Timestamp Type', 'Change Job association', 'Delete Timestamp'];

@HeaderD({
    left: 'Back',
    title: 'null',
    right: 'null',
})
@inject('commonStore')
@observer
class Edit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            record: null,
            errorMsg: '',
            queryLoading: true,
            saveLoading: false,
            reason: '',
            note: '',
            modalType: false,
        };
        this.record_id = this.props.navigation.state.params.record_id;
        this.callback = this.props.navigation.state.params?.callback || null;
    }

    componentDidMount() {
        this.queryDetail();
    }

    queryDetail = () => {
        this.setState({ queryLoading: true });
        global.ASY('records.detail', null, `/${this.record_id}`)
            .then(res => {
                if (res.code === 200) {
                    if (res.model.reason) {
                        this.setState({ reason: res.model.reason });
                    }
                    if (res.model.note) {
                        this.setState({ note: res.model.note });
                    }
                    this.setState({ record: res.model });
                } else {
                    this.setState({ errorMsg: res.message });
                }
                this.setState({ queryLoading: false });
            })
            .catch(e => {
                this.setState({ queryLoading: false });
                console.log(e);
            });
    };

    render() {
        const { errorMsg, queryLoading } = this.state;
        return (
            <TouchableOpacity onPress={()=>Keyboard.dismiss()} activeOpacity={1} style={styles.container}>
                {queryLoading ? this.renderLoading() : this.renderContent()}
                <Snackbar
                    visible={!!errorMsg}
                    onDismiss={() => this.setState({ errorMsg: '' })}
                    theme={{
                        colors: { background: '#ffffff', text: 'black' },
                    }}
                >
                    {errorMsg}
                </Snackbar>
            </TouchableOpacity>
        );

    }

    renderContent = () => {
        const { record, reason, note, modalType, saveLoading } = this.state;
        if (!record) {
            return null;
        }
        return <Fragment>
            <View style={styles.detailHeader}>
                <Text style={styles.username}>{global.getFullName(record?.user)}</Text>
                <View style={styles.cardTitleCheckTime}>
                    <View>
                        <Text style={{ fontSize: 12 }}>Actual: {format(record.created_at, 'ddd, MMM DD,YYYY')}</Text>
                        <Text style={{ marginTop: 3, fontSize: 12 }}>Effective: {format(record.check_at, 'ddd, MMM DD,YYYY')}</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <View>
                            <Text style={styles.cardCheckTimeText}>{format(record.created_at, 'hh:mm:ssa')}</Text>
                            <Text style={[styles.cardCheckTimeText, { marginTop: 5 }]}>{format(record.check_at, 'hh:mm:ssa')}</Text>
                        </View>
                        <Icon
                            name={record.type === 'in'
                                ? skin.$checkIn
                                : skin.$checkOut}
                            size={20}
                            color={record.type === 'in'
                                ? skin.$mainGreen
                                : skin.$red}
                        />
                    </View>
                    {record.device_type === 'pc' ? <AsIcon
                        name={DeviceIconSet[record.device_type]}
                        size={18}
                        color={skin.$black}
                    /> : <Icon
                        name={DeviceIconSet[record.device_type]}
                        size={20}
                        color={skin.$black}
                    />}
                </View>
            </View>
            <Selector title={'Reason for update'} type={1} onPress={this.onPressSelect} value={reason}/>
            <View
                style={SelectorStyles.textInput}
            >
                <Text style={SelectorStyles.title}>Explanation</Text>
                <TextInput
                    value={note}
                    style={{ flex: 1, marginTop: 3, fontSize: 16 }}
                    underlineColor={'transparent'}
                    multiline={true}
                    onChangeText={note => this.setState({ note })}
                />
            </View>
            <View style={{
                flexDirection: 'row',
                width: '100%',
                justifyContent: 'space-between',
                marginTop: skin.$doubleNormalMargin,
            }}>
                <Button
                    mode="text"
                    onPress={() => this.props.navigation.goBack()}
                >
                    <Text style={{ color: skin.$deepGreen }}>CANCEL</Text>
                </Button>
                <Button
                    mode="contained"
                    onPress={() => this.update()}
                    loading={saveLoading}
                    color={skin.$deepGreen}
                >
                    save
                </Button>
            </View>
            <Portal>
                <Dialog
                    visible={modalType}
                    onDismiss={() => this.onPressSelect(false)}
                >
                    <Dialog.Title>Select Reason</Dialog.Title>
                    <Dialog.Content>
                        {Reasons.map((item, index) => {
                            return (<RadioAndroid
                                key={index.toString()}
                                value={item}
                                text={item}
                                selected={item === reason}
                                onPress={() => this.onSelect(item)}
                            />);
                        })}
                    </Dialog.Content>
                </Dialog>
            </Portal>
        </Fragment>;
    };

    update = () => {
        const { note, reason } = this.state;
        this.setState({ saveLoading: true });
        let payload = {
            note,
            reason,
            pending_status: 'review',
        };
        global.cleanObject(payload);
        //return
        global.ASY('records.update', null, `/${this.record_id}`, payload)
            .then(res => {
                if (res.code === 200) {
                    if (this.callback) {
                        try {
                            this.callback();
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    //  this.props.commonStore.fetchJobList();
                    this.props.navigation.goBack();
                } else {
                    this.setState({ errorMsg: res.message });
                }
                this.setState({ saveLoading: false });
            })
            .catch(e => {
                this.setState({ saveLoading: false });
                console.log(e);
            });
    };

    onPressSelect = (modalType) => {
        Keyboard.dismiss()
        this.setState({ modalType: !!modalType });
    };

    onSelect = (value) => {
        this.setState({ reason: value });
        this.onPressSelect(false);
    };

    renderLoading = () => <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator animating={true} color={skin.$deepGreen}/>
    </View>;

}

class Selector extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { title, value, onPress } = this.props;
        return (
            <Touch onPress={() => onPress(true)}>
                <View
                    style={[
                        SelectorStyles.container,
                        this.props.style ? { ...this.props.style } : null,
                    ]}
                >
                    <View>
                        <Text style={SelectorStyles.title}>{title}</Text>
                        <Text style={SelectorStyles.content}>{value}</Text>
                    </View>
                    <View>
                        <Icon
                            name="md-arrow-dropdown"
                            size={20}
                            color={skin.$black}
                        />
                    </View>
                </View>
            </Touch>
        );

    }

}

const SelectorStyles = StyleSheet.create({
    container: {
        backgroundColor: '#ECEDEC',
        width: '100%',
        height: 50,
        padding: skin.$normalPadding,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: skin.$doubleNormalMargin,
    },
    textInput: {
        backgroundColor: '#ECEDEC',
        width: '100%',
        height: 100,
        padding: skin.$normalPadding,
        flexDirection: 'column',
        marginTop: skin.$doubleNormalMargin,
    },
    title: { fontSize: 12, color: skin.$darkGrey },
    content: { fontSize: 16, color: skin.$black },
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: skin.$normalPadding * 2 * global.adapt,
    },
    detailHeader: {
        backgroundColor: '$white',
        width: '100%',
        marginTop: '$doubleNormalMargin',
    },
    username: {
        fontSize: 23,
    },
    cardTitleCheckTime: {
        marginTop: '$normalMargin',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    cardCheckTimeText: {
        fontSize: 12,
        marginRight: '$normalMargin',
    },
});
export default withNamespaces(['test', 'common'], { wait: true })(Edit);
