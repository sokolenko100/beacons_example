import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import { observer } from 'mobx-react';
import HeaderD from '../../decorators/header.decorator';
import { withNamespaces } from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Card, TextInput } from 'react-native-paper';

@HeaderD({
    left: 'Back',
    title: 'null',
    right: 'null',
})
@observer
class EditStamp extends Component {

    constructor(props) {

        super(props);
        this.state = {
            explanation: '',
        };

    }

    render() {

        const { explanation } = this.state;
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.detailHeader}>
                    <Text style={styles.username}>Juan Rodriguez</Text>
                    <View style={styles.cardTitleCheckTime}>
                        <Text>Tuesday, 12 Dec</Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={styles.cardCheckTimeText}>123</Text>
                            <Icon
                                name={skin.$checkIn}
                                size={20}
                                color={skin.$green}
                            />
                        </View>

                        <Icon
                            name={'ios-phone-portrait'}
                            size={20}
                            color={skin.$black}
                        />
                    </View>
                </View>
                <Selector style={{ marginTop: skin.$doubleNormalMargin }}/>
                <Selector style={{ marginTop: skin.$doubleNormalMargin }}/>
                <TextInput
                    label="Explanation"
                    placeholder="Notes"
                    multiline={true}
                    disabled={false}
                    style={styles.explanation}
                    value={explanation}
                    onChangeText={text => this.setState({ explanation: text })}
                />
                <Card
                    style={{
                        marginTop: skin.$normalPadding,
                        width: '100%',
                        backgroundColor: '#F0F0F0',
                    }}
                >
                    <Card.Content>
                        <Text style={{ color: '#676767', fontSize: 12 }}>
                            Caption
                        </Text>
                        <Text style={styles.grayText}>
                            Check in method:
                            <Text style={styles.blueText}>
                                {' '}
                                Mobile App login
                            </Text>
                        </Text>
                        <Text style={styles.grayText}>
                            Location:
                            <Text style={styles.blueText}> 48.12345 Lat</Text>
                        </Text>
                        <Text style={styles.grayText}>
                            User:
                            <Text style={styles.blueText}>Frank Carl</Text>
                        </Text>
                        <Text style={styles.grayText}>
                            IP Address:
                            <Text style={styles.blueText}>196.284.35.11</Text>
                        </Text>
                    </Card.Content>
                </Card>
                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        marginTop: skin.$doubleNormalMargin * 2,
                    }}
                >
                    <Button
                        mode="contained"
                        onPress={() => console.log('Pressed')}
                        style={{
                            width: '40%',
                            height: 48,
                            justifyContent: 'center',
                            backgroundColor: skin.$white,
                            color: skin.$mainGreen,
                        }}
                        // color={skin.$white}
                    >
                        <Text style={{ color: skin.$mainGreen }}>CANCEL</Text>
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => console.log('Pressed')}
                        style={{
                            width: '40%',
                            height: 48,
                            justifyContent: 'center',
                        }}
                        color={skin.$mainGreen}
                    >
                        <Text>SAVE</Text>
                    </Button>
                </View>
            </ScrollView>
        );

    }

}

class Selector extends Component {

    render() {

        return (
            <View
                style={[
                    SelectorStyles.container,
                    this.props.style ? { ...this.props.style } : null,
                ]}
            >
                <View>
                    <Text style={SelectorStyles.title}>Title</Text>
                    <Text style={SelectorStyles.content}>asdasdasdasd</Text>
                </View>
                <View>
                    <Icon
                        name="md-arrow-dropdown"
                        size={20}
                        color={skin.$black}
                    />
                </View>
            </View>
        );

    }

}

const SelectorStyles = StyleSheet.create({
    container: {
        backgroundColor: '#F0F0F0',
        width: '100%',
        height: 50,
        padding: skin.$normalPadding,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: { fontSize: 11, color: skin.$darkGrey },
    content: { fontSize: 16, color: skin.$black },
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: '$doubleNormalPadding*2',
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
    explanation: {
        width: '100%',
        marginTop: skin.$doubleNormalMargin,
        backgroundColor: '#F0F0F0',
    },
    grayText: {
        color: '#676767',
        fontSize: 16,
    },
    blueText: {
        color: '#1E3766',
        fontSize: 16,
    },
});
export default withNamespaces(['test', 'common'], { wait: true })(EditStamp);
