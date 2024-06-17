/* eslint-disable prettier/prettier */
/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidVisibility, EventType } from '@notifee/react-native';
import colors from 'configs/colors';
import { watchInitialNotification } from 'utils/notification';
if (__DEV__) {
    require("./ReactotronConfig");
}
// Note that an async function or a function that returns a Promise 
// is required for both subscribers.
if (__DEV__) {
    require("./ReactotronConfig");
  }
async function onMessageReceived(message) {
    console.log(`message :>>`, JSON.stringify(message, null, 2));
    const { data } = message;
    const { title, body, channelId } = data || {};
    await notifee.displayNotification({
        title: title,
        body: body,
        data: {
            channelId,
        },
        android: {
            channelId: 'messages',
            visibility: AndroidVisibility.PRIVATE,
            color: colors.primary.DEFAULT,
            smallIcon: 'ic_notification',
            actions: [
                {
                    title: 'Open',
                    pressAction: {
                        id: 'open-chat',
                        launchActivity: 'default',
                    },
                },
            ],
        },
    });
}

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.ACTION_PRESS) {
        await watchInitialNotification();
    }

});


AppRegistry.registerComponent(appName, () => App);
