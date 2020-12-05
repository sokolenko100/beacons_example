package com.authentiksystemsapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import cl.json.RNSharePackage;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.ivanwu.googleapiavailabilitybridge.ReactNativeGooglePlayServicesPackage;
import com.remobile.toast.RCTToastPackage;
import com.github.reactnativecommunity.location.RNLocationPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.lg2.eddystone.EddystonePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import it.innove.BleManagerPackage;
import com.solinor.bluetoothstatus.RNBluetoothManagerPackage;
import com.horcrux.svg.SvgPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import io.sentry.RNSentryPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;
public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNSharePackage(),
            new SafeAreaContextPackage(),
            new AsyncStoragePackage(),
            new RNFetchBlobPackage(),
            new ReactNativePushNotificationPackage(),
            new ReactNativeGooglePlayServicesPackage(),
            new RCTToastPackage(),
            new RNLocationPackage(),
            new RNGeocoderPackage(),
            new EddystonePackage(),
            new RNDeviceInfo(),
            new BleManagerPackage(),
            new RNBluetoothManagerPackage(),
            new SvgPackage(),
            new SplashScreenReactPackage(),
            new VectorIconsPackage(),
            new RNSentryPackage(),
            new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
