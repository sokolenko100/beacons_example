import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-community/async-storage';
const keyList = {
    loginInfo: 'loginInfo',
    beaconInfo: 'beaconInfo',
};
const storage = new Storage({
    // maximum capacity, default 1000
    size: 1000,

    // Use AsyncStorage for RN apps, or window.localStorage for web apps.
    // If storageBackend is not set, data will be lost after reload.
    storageBackend: AsyncStorage, // for web: window.localStorage

    // expire time, default: 1 day (1000 * 3600 * 24 milliseconds).
    // can be null, which means never expire.
    defaultExpires: null,

    // cache data in the memory. default is true.
    enableCache: true,

    // if data was not found in storage or expired data was found,
    // the corresponding sync method will be invoked returning
    // the latest data.
    sync: {
        [keyList.beaconInfo](params) {

            const {
                id,
                resolve,
                syncParams: { path },
            } = params;
            storage.remove({
                key: keyList.beaconInfo,
                id,
            });
            resolve && resolve(path);

        },
        // we'll talk about the details later.
    },
});

/**
 * save user to local-storage
 * @param loginUserModel {loginUserModel} - loginUserModel
 */
function saveLoginInfo(loginUserModel) {

    storage
        .save({
            key: keyList.loginInfo,
            data: {
                token: loginUserModel.get('token'),
            },
        })
        .catch(error => {

            tap('saveLoginInfo Error:', error);

        });

}
function loadLoginInfo() {

    return storage
        .load({
            key: keyList.loginInfo,
            autoSync: true,
        })
        .then(data => data)
        .catch(error => {

            // TODO: need error handler
            tap('localStorage Error', error);
            return null;

        });

}

function saveBeaconInfo(beacon) {

    return storage
        .save({
            key: keyList.beaconInfo,
            id: `${beacon.major}000${beacon.minor}`,
            data: beacon,
            expires: 1000 * 40,
        })
        .then(data => data)
        .catch(error => (
            // tap('saveBeaconInfo Error:', error);
            null
        ))
}

function loadBeaconInfo(beacon) {

    return storage
        .load({
            key: keyList.beaconInfo,
            id: `${beacon.major}000${beacon.minor}`,
            autoSync: true,
        })
        .then(data => data)
        .catch(error => null)

}

function removeBeaconInfo(beacon) {

    return storage.remove({
        key: keyList.beaconInfo,
        id: `${beacon.major}000${beacon.minor}`,
    });

}

function removeLoginInfo() {

    return storage.remove({
        key: keyList.loginInfo,
    });

}

const utils = {
    storage,
    loginInfo: {
        save: saveLoginInfo,
        load: loadLoginInfo,
        removeAll: removeLoginInfo,
    },
    beaconInfo: {
        save: saveBeaconInfo,
        load: loadBeaconInfo,
        remove: removeBeaconInfo,
    },
};
export default utils;
