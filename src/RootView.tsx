import React, {useEffect, useState} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  PermissionsAndroid,
  PermissionStatus,
  Alert,
} from 'react-native';
import Navigations from './navigations';
import BootSplash from 'react-native-bootsplash';
import messaging from '@react-native-firebase/messaging';
import useMutation from 'libs/swr/useMutation';
import notifee, {
  AuthorizationStatus,
  AndroidImportance,
  EventType,
} from '@notifee/react-native';
import {watchInitialNotification} from 'utils/notification';

function RootView(): JSX.Element {
  const [isReady, setIsReady] = useState(false);

  const [, updateToken] = useMutation({
    url: '/me/devise-tokens',
    method: 'PUT',
  });

  useEffect(() => {
    async function onAppBootstrap() {
      try {
        await notifee.createChannel({
          id: 'messages',
          name: 'Messages',
          vibration: true,
          importance: AndroidImportance.HIGH,
        });
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        console.log(`token :>>`, token);
        await updateToken({deviseToken: token});
      } catch (e) {
        console.log(`e :>>`, e);
      }
    }
    async function requestPermission() {
      if (Platform.OS === 'ios') {
        await notifee.requestPermission();
        return;
      }
      try {
        let result: PermissionStatus = 'granted';
        const settings = await notifee.getNotificationSettings();

        if (Platform.Version >= 33) {
          result = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
        }
        if (
          result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN &&
          settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED
        ) {
          Alert.alert(
            'Storage Permission Required',
            'App needs access to your storage to read files. Please go to app settings and grant permission.',
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Open Settings',
                onPress: () => notifee.openNotificationSettings(),
              },
            ],
          );
        }
      } catch (error) {
        console.log(`error :>>`, error);
      }
    }

    requestPermission();
    onAppBootstrap();
    setTimeout(() => {
      setIsReady(true);
      setTimeout(() => {
        watchInitialNotification();
        BootSplash.hide({fade: true});
      }, 100);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent(async ({type, detail}) => {
      if (type !== EventType.PRESS && type !== EventType.ACTION_PRESS) {
        return;
      }
      watchInitialNotification(detail);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor="white" />
      <>{isReady && <Navigations />}</>
    </View>
  );
}

export default RootView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
