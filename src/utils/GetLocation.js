import Geocoder from 'react-native-geocoder';
import RNLocation from 'react-native-location';

const GoogleAPIAvailability = require('react-native-google-api-availability-bridge');
// RNLocation.configure({
//     distanceFilter: 100,
//     androidProvider: 'auto',
// });

//RNLocation.getLatestLocation
export default async function GetLocation() {
    return new Promise((resolve, reject) => {
        try {
            if (global.isIos) {

                RNLocation.configure({
                    distanceFilter: 5.0
                })

                RNLocation.requestPermission({
                    ios: "whenInUse",
                }).then(granted => {
                    if (granted) {
                        this.locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
                        console.log("GetLocation -> locations", locations)
                            this.locationSubscription()
                            const location = {
                                lat: !__DEV__ ? locations[0].latitude : 30.6160510598,//30.6160510598,//res.coords.latitude,
                                lng: !__DEV__ ? locations[0].longitude : 104.0406934153,//104.0406934153,// res.coords.longitude,
                            };
                            console.log("GetLocation -> location", location)
                            Geocoder.geocodePosition(location)
                                .then(address => {
                                    resolve(address);
                                })
                                .catch(err => {
                                    console.log("GetLocation -> err", err)
                                    resolve(false);
                                });

                        })
                    }
                })



                // navigator.geolocation.requestAuthorization();
                // navigator.geolocation.getCurrentPosition((res) => {

                // }, (err) => {
                //     console.log("GetLocation -> err", err)

                //     resolve(false);
                // });
            } else {
                // RNLocation.configure({
                //     distanceFilter: 5.0,
                //     androidProvider: 'standard',
                // });
                // RNLocation.requestPermission({
                //     android: {
                //         detail: 'fine',
                //     },
                // })
                //     .then(granted => {
                //         if (granted) {
                //             RNLocation.getLatestLocation({ timeout: 6000 })
                //                 .then(resAddress => {
                //                     if (!resAddress) {
                //                         resolve(false);
                //                     }
                //                     const location = {
                //                         lat: resAddress.latitude,//30.6160510598,//res.coords.latitude,
                //                         lng: resAddress.longitude,//104.0406934153,// res.coords.longitude,
                //                     };
                //                     Geocoder.geocodePosition(location)
                //                         .then(address => {
                //                             resolve(address);
                //                         })
                //                         .catch(err => {
                //
                //                             resolve(false);
                //                         });
                //                 })
                //                 .catch(e => {
                //
                //                     resolve(false);
                //                 });
                //         }
                //     });

                GoogleAPIAvailability.checkGooglePlayServices((result) => {
                    if (result === 'update' || result === 'success') {
                        RNLocation.configure({
                            distanceFilter: 5.0,
                            androidProvider: 'standard',
                        });
                        RNLocation.requestPermission({
                            android: {
                                detail: 'fine',
                            },
                        })
                            .then(granted => {
                                if (granted) {
                                    RNLocation.getLatestLocation({ timeout: 6000 })
                                        .then(resAddress => {
                                            if (!resAddress) {
                                                resolve(false);
                                            }
                                            const location = {
                                                lat: resAddress.latitude,//30.6160510598,//res.coords.latitude,
                                                lng: resAddress.longitude,//104.0406934153,// res.coords.longitude,
                                            };
                                            Geocoder.geocodePosition(location)
                                                .then(address => {
                                                    resolve(address);
                                                })
                                                .catch(err => {

                                                    resolve(false);
                                                });
                                        })
                                        .catch(e => {

                                            resolve(false);
                                        });
                                }
                            });
                    } else {
                        resolve({ errorMsg: 'No Google Server' });
                    }
                });
            }
        } catch (e) {
            console.log("GetLocation -> e", e)
            resolve(false);
        }
    });
}