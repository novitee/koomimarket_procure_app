import notifee from '@notifee/react-native';
import {getState} from 'stores/app';
import axios from 'libs/axios';
import {setGlobal} from 'stores/global';
import {navigationRef} from 'navigations/index';

async function getChannelById(channelId: string) {
  const authToken = getState().authToken || '';
  const authRefreshToken = getState().authRefreshToken || '';
  const cartToken = getState().cartToken || '';
  try {
    const result = await axios({authToken, authRefreshToken, cartToken}).get(
      `channels/${channelId}`,
      {
        params: {
          include: 'channelMembers(id,userId,user,role)',
        },
      },
    );
    return result.data;
  } catch (error) {
    return null;
  }
}
export async function watchInitialNotification() {
  const initialNotification = await notifee.getInitialNotification();
  if (initialNotification?.pressAction?.id !== 'open-chat') {
    return;
  }
  const {data} = initialNotification.notification || {};
  const {channelId} = data || {};
  if (!channelId) {
    return;
  }

  const channelData = await getChannelById(channelId as string);

  if (channelData) {
    setGlobal({currentChannel: channelData.channel});
    setTimeout(() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate('Chat' as never);
      }
    }, 100);
  }
}
