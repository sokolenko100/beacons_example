import { action, observable } from 'mobx';
import { NativeEventEmitter, NativeModules, Alert, PermissionsAndroid, Platform } from 'react-native';
import Storage from '../utils/Storage/index';
import BleManager, { start } from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
import { BluetoothStatus } from 'react-native-bluetooth-status';
import Beacons from 'react-native-beacons-manager';
import Toast from '@remobile/react-native-toast';
import { stringToBytes } from 'convert-string';
import Eddystone from '@lg2/react-native-eddystone';

const region = {
    identifier: 'Estimote',
    uuid: '66ef5858-06bc-4d02-87ff-12363593ab19',
};

const bleServer = Platform.select({ android: 'fb3b571a-4a4a-11e9-8646-d663bd873d93', ios: 'FB3B571A-4A4A-11E9-8646-D663BD873D93' });

const AcknowledgeBleCharacteristics = Platform.select({
    android: 'fb3b5d78-4a4a-11e9-8646-d663bd873d93',
    ios: 'FB3B5D78-4A4A-11E9-8646-D663BD873D93',
});

const SerialNumberBleCharacteristics = Platform.select({
    android: 'fb3b60ac-4a4a-11e9-8646-d663bd873d93',
    ios: 'FB3B60AC-4A4A-11E9-8646-D663BD873D93',
});

let authorizationStatusDidChange = data => {
    deviceLog.log('authorizationStatusDidChange', data);
};
let beaconsDidRangelogin = data => {
    deviceLog.log('beaconsDidRangelogin', data);
};
let beaconsDidRangeenrollment = data => {
    deviceLog.log('beaconsDidRangeenrollment', data);
};
let beaconsDidRangeactivity = data => {
    deviceLog.log('beaconsDidRangeactivity', data);
};
let regionDidEnter = data => {
    deviceLog.log('regionDidEnter', data);
};
let regionDidExit = data => {
    deviceLog.log('regionDidExit', data);
};

class BeaconIndexStore {
    peripherals = new Map();

    ProcessedBeacon = new Map();

    @observable BeaconType = 'activity';

    @observable isStartBeacon = false;

    @observable isStartBLE = false;


    @observable isBleConnecting = false;

    @observable characteristics = [];


    /**
     * @returns Promise
     */
    @action.bound
    checkPermission = async () => {
        if (Platform.OS !== 'android') {
            return Promise.resolve(true);
        }
        try {
            await BleManager.enableBluetooth();
            const isEnabled = await BluetoothStatus.state();
            if (!isEnabled) {
                return Alert.alert('Please turn on Bluetooth.');
            }
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ]);
        } catch (error) {
            return Promise.reject(error);
        }
    };

    /**
     *
     */
    @action.bound
    start() {
        if (this.isStartBeacon) {
            return;
        }
        this.isStartBeacon = true;
        if (Platform.OS === 'android') {
            this.startAndroidRangingBeacons();
        } else {
            this.startIOSRangingBeacons();
        }


        this.BleManagerDiscoverPeripheral = bleManagerEmitter.addListener(
            'BleManagerDiscoverPeripheral',
            peripheral => {
                const { peripherals } = this;
                if (!peripherals.has(peripheral.id)) {
                    peripherals.set(peripheral.id, peripheral);
                    this.peripherals = peripherals;
                }
            },
        );

        this.BleManagerDidUpdateState = bleManagerEmitter.addListener('BleManagerDidUpdateState', args => {
            // Alert.alert(args.state)
            if (args.state === 'on') {
                this.start();
            }
            if (args.state === 'off') {
                this.isStartBeacon = false;
                this.isStartBLE = false;
                this.BleManagerDiscoverPeripheral.remove();
                if (Platform.OS === 'ios') {
                    this.authorizationStatusDidChange.remove();
                    this.beaconsDidRange.remove();
                    this.regionDidEnter.remove();
                    this.regionDidExit.remove();
                } else {
                    this.onUIDFrame.remove();
                }
            }
        });

        if (Platform.OS === 'ios') {
            this.authorizationStatusDidChange = Beacons.BeaconsEventEmitter.addListener(
                'authorizationStatusDidChange',
                data => {
                    authorizationStatusDidChange(data);
                },
            );

            this.beaconsDidRange = Beacons.BeaconsEventEmitter.addListener('beaconsDidRange', data => {
                deviceLog.log('Beacon list', data);
                switch (this.BeaconType) {
                    case 'login':
                        beaconsDidRangelogin(data);
                        break;
                    case 'enrollment':
                        beaconsDidRangeenrollment(data);
                        break;
                    case 'activity':
                        beaconsDidRangeactivity(data);
                        break;
                }
            });

            this.regionDidEnter = Beacons.BeaconsEventEmitter.addListener('regionDidEnter', data => {
                regionDidEnter(data);
            });

            this.regionDidExit = Beacons.BeaconsEventEmitter.addListener('regionDidExit', data => {
                regionDidExit(data);
            });
        } else {
            this.onUIDFrame = Eddystone.addListener('onUIDFrame', (beacon) => {
                beacon = JSON.parse(beacon.byte);
                const data = {
                    beacons: [this.getMid(this.getSN(beacon))],
                };
                deviceLog.log('Beacon list', data);
                switch (this.BeaconType) {
                    case 'login':
                        beaconsDidRangelogin(data);
                        break;
                    case 'enrollment':
                        beaconsDidRangeenrollment(data);
                        break;
                    case 'activity':
                        beaconsDidRangeactivity(data);
                        break;
                }
            });
        }

    }

    /**
     *
     */
    @action.bound
    startIOSRangingBeacons() {
        Beacons.requestAlwaysAuthorization();
        Beacons.shouldDropEmptyRanges(true);
        // Beacons.requestWhenInUseAuthorization();

        Beacons.startMonitoringForRegion(region);
        Beacons.startRangingBeaconsInRegion(region);

        Beacons.startUpdatingLocation();
        deviceLog.success(`Beacons ranging started succesfully!`);
    }

    /**
     */
    @action.bound
    startAndroidRangingBeacons = async () => {
        Eddystone.startScanning();
        deviceLog.success(`Eddystone ranging started succesfully!`);
    };

    /**
     * @param  {string} name
     * @param  {func} callback
     */
    @action.bound
    addListener(name, callback) {
        switch (name) {
            case 'authorizationStatusDidChange':
                authorizationStatusDidChange = callback;
                break;
            case 'beaconsDidRangelogin':
                beaconsDidRangelogin = callback;
                break;
            case 'beaconsDidRangeenrollment':
                beaconsDidRangeenrollment = callback;
                break;
            case 'beaconsDidRangeactivity':
                beaconsDidRangeactivity = callback;
                break;
            case 'regionDidEnter':
                regionDidEnter = callback;
                break;
            case 'regionDidExit':
                regionDidExit = callback;
                break;
        }
    }

    @action.bound
    setBeaconType(type) {
        this.BeaconType = type;
    }

    @action.bound
    AddProcessedBeacons(beacon) {
        let { ProcessedBeacon } = this
        const sn = this.getSN([beacon.major, beacon.minor], 9, 16)
        if (!ProcessedBeacon.has(sn)) {
            deviceLog.log('The beacon being processed', beacon);
            ProcessedBeacon.set(sn, beacon);
            this.ProcessedBeacon = ProcessedBeacon;
        }
    }

    @action.bound
    RemoveProcessedBeacons(beacon) {
        let { ProcessedBeacon } = this
        const sn = this.getSN([beacon.major, beacon.minor], 9, 16)
        deviceLog.log('Remove processed beacons', beacon);
        ProcessedBeacon.delete(sn);
        this.ProcessedBeacon = ProcessedBeacon;
    }


    @action.bound
    BLEConnect(peripheral, beacon, callback) {
        const disconnect = (num, _callback) => {
            if (num === 3) {
                deviceLog.error(`(${this.getSN([beacon.major, beacon.minor], 9, 16)})Device failed three times to disconnect`);
                setTimeout(() => {
                    this.isBleConnecting = false
                }, 2000)
                deviceLog.success('Start receiving and processing beacons');
                deviceLog.debug('isBleConnecting: ' + this.isBleConnecting);
                setTimeout(() => {
                    this.RemoveProcessedBeacons(beacon)
                }, 10000);
                return false
            }
            return BleManager.disconnect(peripheral.id)
                .then(() => {
                    if (_callback) {
                        _callback
                    }
                    setTimeout(() => {
                        this.isBleConnecting = false
                    }, 2000)
                    deviceLog.success('Start receiving and processing beacons');
                    deviceLog.debug('isBleConnecting: ' + this.isBleConnecting);
                    setTimeout(() => {
                        this.RemoveProcessedBeacons(beacon)
                    }, 10000);
                    deviceLog.success(`(${this.getSN([beacon.major, beacon.minor], 9, 16)})Disconnect device:` + peripheral.id);
                })
                .catch(ERR => {
                    deviceLog.error(`(${this.getSN([beacon.major, beacon.minor], 9, 16)})Device disconnection failed:`, ERR);
                    deviceLog.error(`(${this.getSN([beacon.major, beacon.minor], 9, 16)})Device disconnected Bluetooth connection failed, retry ${num}rd`);
                    setTimeout(() => {
                        disconnect(num++, _callback)
                    }, 1000);
                });
        }
        if (peripheral) {
            if (peripheral.connected) {
                setTimeout(() => {
                    disconnect(1)
                }, 1000);
            } else {
                deviceLog.success(`(${this.getSN([beacon.major, beacon.minor], 9, 16)})Connecting device:` + peripheral.id, peripheral);
                BleManager.connect(peripheral.id)
                    .then(() => {
                        deviceLog.success(`(${this.getSN([beacon.major, beacon.minor], 9, 16)})connection succeeded:` + peripheral.id, peripheral);
                        BleManager.retrieveServices(peripheral.id)
                            .then(async (peripheralInfo) => {
                                deviceLog.info('Read the parameters used', {
                                    peripheralId: peripheral.id,
                                    serviceUUID: bleServer,
                                    characteristicUUID: SerialNumberBleCharacteristics
                                })
                                BleManager.read(peripheral.id, bleServer, SerialNumberBleCharacteristics)
                                    .then((readData) => {
                                        deviceLog.success(`(${this.getSN([beacon.major, beacon.minor], 9, 16)})device read data:`, readData);
                                        deviceLog.success('GATT Serial Number:' + this.getSN(readData));
                                        setTimeout(() => {
                                            const byteData = stringToBytes('0');
                                            deviceLog.info('Write the parameters used', {
                                                peripheralId: peripheral.id,
                                                serviceUUID: bleServer,
                                                characteristicUUID: AcknowledgeBleCharacteristics,
                                                data: byteData
                                            })
                                            BleManager.write(peripheral.id, bleServer, AcknowledgeBleCharacteristics, byteData)
                                            deviceLog.success(`(${this.getSN([beacon.major, beacon.minor], 9, 16)})Write device:` + peripheral.id);
                                            setTimeout(() => {
                                                disconnect(1, callback(this.getSN([beacon.major, beacon.minor], 9, 16)))
                                            }, 1000);
                                        }, 500);
                                    });
                            })
                            .catch((err) => {
                                Toast.showLongBottom(`(${this.getSN([beacon.major, beacon.minor], 9, 16)})Fig reading error. Please swipe again.`);
                                deviceLog.error('retrieveServices error:' + err);
                                setTimeout(() => {
                                    disconnect(1)
                                }, 1000);
                            });
                    })
                    .catch((error) => {
                        deviceLog.error('Connection error:' + error);
                        setTimeout(() => {
                            this.isBleConnecting = false
                        }, 2000)
                        deviceLog.success('Start receiving and processing beacons');
                        deviceLog.info('isBleConnecting: ' + this.isBleConnecting);
                        setTimeout(() => {
                            this.RemoveProcessedBeacons(beacon)
                        }, 10000);
                    });
            }
        }
    }

    @action.bound
    getSN(byteArr, num = 9, base = 8) {
        try {
            let str = 0;
            byteArr.reverse()
                .forEach((it, index) => {
                    if (base == 8) {
                        it = new Uint8Array([it]);
                    }
                    if (base == 16) {
                        it = new Uint16Array([it]);
                    }
                    str = it[0] * Math.pow(Math.pow(2, base), index) + str * 1;
                });
            str = str + '';
            return str.padStart(num, '0');
        } catch (error) {
            deviceLog.error('getSN error: ', error);

        }
    }

    @action.bound
    getMid(sn) {
        try {
            let major = sn >>> 16;
            let minor = sn << 16 >>> 16;
            return {
                minor, major,
            };
        } catch (error) {
            deviceLog.error('getMid error: ', error);

        }
    }

    @action.bound
    checkScanDeviceList(beacon) {
        let list = Array.from(this.peripherals.values());
        deviceLog.log('Scanned device list:', list);
        return list.find(it => {
            if (Platform.OS !== 'android') {
                let a = this.getMid(this.getSN([
                    it.advertising.serviceData.FEAA.bytes[14],
                    it.advertising.serviceData.FEAA.bytes[15],
                    it.advertising.serviceData.FEAA.bytes[16],
                    it.advertising.serviceData.FEAA.bytes[17],

                ]));
                return beacon.minor == a.minor && beacon.major == a.major;
            } else {
                let a = this.getMid(this.getSN([
                    it.advertising.manufacturerData.bytes[25],
                    it.advertising.manufacturerData.bytes[26],
                    it.advertising.manufacturerData.bytes[27],
                    it.advertising.manufacturerData.bytes[28],
                ], 9));
                return beacon.minor == a.minor && beacon.major == a.major;
            }
        });
    }

    @action.bound
    scanAndConnectedBLE(callback, beacon) {
        BleManager.scan(['FEAA'], 60, true)
            .then(() => {
                deviceLog.success('Start scanning BLE devices');
                const time = setInterval(() => {
                    try {
                        const Device = this.checkScanDeviceList(beacon);
                        if (Device) {
                            BleManager.stopScan();
                            this.BLEConnect(Device, beacon, callback);
                            clearInterval(time);
                        } else {
                            deviceLog.error('No matching fig, continue scanning');
                        }
                    } catch (error) {
                        deviceLog.error('error: ', error);
                    }
                }, 1000);
            });
    }


    @action.bound
    async  FetchDoCheck(beacon, callback, CheckBelong = true) {
        const sn = this.getSN([beacon.major, beacon.minor], 9, 16)
        if (this.ProcessedBeacon.has(sn) || this.isBleConnecting) {
            deviceLog.error(`(${this.getSN([beacon.major, beacon.minor], 9, 16)})Checking in is being processed, or rejected the device`);
            return false
        }
        deviceLog.debug('List of devices processed:', this.ProcessedBeacon);
        this.isBleConnecting = true
        const postData = { serial_number: this.getSN([beacon.major, beacon.minor], 9, 16) }
        deviceLog.log('Is an organization interface parameter', postData);
        if (CheckBelong) {
            API.get('organizations.isBelong', { params: postData }).then(async data => {
                deviceLog.log('Check the parameters returned by the binding organization API', data.data);
                if (data.data.code === 200) {
                    this.peripherals.clear()
                    deviceLog.debug('Device belongs to this organization');
                    deviceLog.debug('isBleConnecting: ' + this.isBleConnecting);
                    this.AddProcessedBeacons(beacon)
                    deviceLog.success('Ready to connect bluetooth, reject beacon signal.');
                    if (!this.isStartBLE) {
                        this.isStartBLE = true;
                        BleManager.start({ showAlert: false });
                    }
                    setTimeout(() => {
                        this.scanAndConnectedBLE(callback, beacon);
                    }, 500);
                } else {
                    deviceLog.error(this.getSN([beacon.major, beacon.minor], 9, 16) + data.data.message);
                    Toast.showLongBottom(data.data.message);
                    this.AddProcessedBeacons(beacon)
                    setTimeout(() => {
                        this.RemoveProcessedBeacons(beacon)
                    }, 20000);
                    this.isBleConnecting = false
                }
            })
        } else {
            this.peripherals.clear()
            deviceLog.debug('Device belongs to this organization');
            deviceLog.debug('isBleConnecting: ' + this.isBleConnecting);
            this.AddProcessedBeacons(beacon)
            deviceLog.success('Ready to connect bluetooth, reject beacon signal.');
            if (!this.isStartBLE) {
                this.isStartBLE = true;
                BleManager.start({ showAlert: false });
            }
            setTimeout(() => {
                this.scanAndConnectedBLE(callback, beacon);
            }, 500);
        }
    }
}

const beaconIndexStore = new BeaconIndexStore();

export { beaconIndexStore };
