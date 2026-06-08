import {
  AppState,
  LogBox,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/pages/splash/SplashScreen';
import Toast from 'react-native-toast-message';
import { useEffect, useState } from 'react';
import Route from './src/routes/Route';
import NetInfo from '@react-native-community/netinfo';
import { getTimeZone } from 'react-native-localize';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  EventType,
} from '@notifee/react-native';
import { userConstants } from './src/constants/user';
import {
  setfcmToken,
  setNewNotification,
  setTimeZone,
} from './src/store/slices/user';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { toastConfig } from './src/utils/CustomToast';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

function App() {
  const dispatch = useDispatch();
  const timezone = getTimeZone();
  const [loader, setLoader] = useState(false);

  // Notification handler
  const handleNotificationMessage = async (
    remoteMessage,
    source = 'foreground',
  ) => {
    try {
      let message =
        remoteMessage?.notification?.body ||
        remoteMessage?.data?.body ||
        'New notification received';

      await notifee.displayNotification({
        id: `notif_${Date.now()}`,
        title: remoteMessage?.notification?.title || 'Notification',
        body: message,
        android: {
          channelId: 'default',
          importance: AndroidImportance.HIGH,
        },
      });

      dispatch(setNewNotification(true));
    } catch (error) {
      console.log(`Error showing ${source} notification:`, error);
    }
  };

  useEffect(() => {
    if (!loader) return; // Wait until splash done
    const setupNotifications = async () => {
      try {
        if (timezone) dispatch(setTimeZone(timezone));
        // 👇 Request permission AFTER splash shows
        const settings = await notifee.requestPermission();
        if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
          console.log('Notification permission granted.');
        } else {
          console.log('Notification permission denied.');
        }
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        console.log('FCM Token ------------>', token);
        if (token) dispatch(setfcmToken(token));
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });
        const unsubscribeForeground = messaging().onMessage(
          async remoteMessage => {
            await handleNotificationMessage(remoteMessage, 'foreground');
          },
        );
        messaging().setBackgroundMessageHandler(async remoteMessage => {
          await handleNotificationMessage(remoteMessage, 'background');
        });
        const unsubscribeNotifee = notifee.onForegroundEvent(({ type }) => {
          if (type === EventType.PRESS) dispatch(setNewNotification(true));
        });
        const unsubscribeTokenRefresh = messaging().onTokenRefresh(token => {
          dispatch(setfcmToken(token));
        });
        const appStateSub = AppState.addEventListener('change', () => {});
        return () => {
          unsubscribeForeground?.();
          unsubscribeNotifee?.();
          unsubscribeTokenRefresh?.();
          appStateSub?.remove?.();
        };
      } catch (err) {
        console.log('Notification setup failed:', err);
      }
    };

    const timer = setTimeout(() => {
      setupNotifications();
    }, 1000); // wait 1 sec after splash

    return () => clearTimeout(timer);
  }, [loader]);

  // Network check
  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      const isConnected = state.isConnected ? 'true' : 'false';
      AsyncStorage.setItem(userConstants.isInternetAvailable, isConnected);
      if (isConnected === 'false') {
        Toast.show({
          type: 'error',
          text1: 'No Internet Connection. Please check your connection.',
        });
      }
    });
    return () => unsubscribeNetInfo && unsubscribeNetInfo();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoader(true);
    }, 3500);
  }, []);

  return (
    <KeyboardProvider statusBarTranslucent={false}>
      <SafeAreaProvider style={styles.container}>
        {/* <StatusBar
          barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.colors.background}
          translucent={false}
        /> */}
        <View style={styles.container}>
          {!loader ? <SplashScreen /> : <Route />}
        </View>

        <Toast
          config={toastConfig}
          topOffset={Platform.OS === 'ios' ? 60 : 20}
        />
      </SafeAreaProvider>
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default App;
