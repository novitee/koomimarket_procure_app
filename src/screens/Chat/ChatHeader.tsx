import {View, Text, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {BackButton} from 'navigations/common';
import {useGlobalStore} from 'stores/global';
import Avatar from 'components/Avatar';
import firestore from '@react-native-firebase/firestore';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useMe from 'hooks/useMe';

function ChatHeader({navigation}: NativeStackHeaderProps) {
  const {currentChannel} = useGlobalStore();
  const {name, supplier} = currentChannel || {};
  const imageUrl = supplier?.photo?.url;
  const channelId = currentChannel?.id || '';
  const {channelMembers} = currentChannel || {};
  const {user} = useMe();
  const {id: userId} = user?.me || {};
  const [typingText, setTypingText] = useState('');
  const insets = useSafeAreaInsets();

  function generateTypingText(members: any[], typings: any) {
    if (!members) {
      return '';
    }

    if (!typings) {
      return '';
    }

    const typingMembers = members
      .filter(member => typings[member?.userId] && member?.userId !== userId)
      .map(member =>
        [member?.user?.firstName, member?.user?.lastName].join(' '),
      );

    if (typingMembers.length === 0) {
      return '';
    }
    if (typingMembers.length > 0 && typingMembers.length === 1) {
      return `${typingMembers.join(', ')} is typing...`;
    }
    return `${typingMembers.length} members are typing...`;
  }

  const fireStoreInstance = firestore()
    .collection('channelMessages')
    .doc(channelId);

  useEffect(() => {
    const subscriber = fireStoreInstance.onSnapshot(
      {includeMetadataChanges: true},
      documentSnapshot => {
        const {actions} = (documentSnapshot.data() as any) || {};
        const {typings} = actions || {};
        const text = generateTypingText(channelMembers, typings);
        setTypingText(text);
      },
    );

    // Stop listening for updates when no longer required
    return () => subscriber();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleGoBack() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MyOutlets');
    }
  }
  return (
    <SafeAreaView
      style={{
        paddingTop: insets.top,
      }}
      className="bg-white">
      <View className="px-3 py-3 flex-row items-center">
        <BackButton canGoBack={true} goBack={handleGoBack} />
        <View className="ml-1 flex-1 flex-row">
          <Avatar url={imageUrl} size={48} name={name} />
          <View className="flex-1 justify-center ml-4">
            <Text className="font-semibold text-18 mb-1" numberOfLines={1}>
              {name}
            </Text>
            {typingText ? (
              <Text className="italic text-primary-600">{`${typingText}...`}</Text>
            ) : (
              <Text>{`${channelMembers?.length} members`}</Text>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
export default React.memo(ChatHeader);
