import {Platform, View} from 'react-native';
import React, {useCallback, useLayoutEffect} from 'react';

import MessageInput from './MessageInput';
import MessageListing from './MessageListing';
import {AvoidSoftInputView, AvoidSoftInput} from 'react-native-avoid-softinput';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  NativeStackHeaderProps,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import ChatHeader from './ChatHeader';
import Button from 'components/Button';
import Text from 'components/Text';
import ChevronRightIcon from 'assets/images/chevron-right.svg';

export default function ChatScreen({navigation}: NativeStackScreenProps<any>) {
  const onFocusEffect = React.useCallback(() => {
    AvoidSoftInput.setShouldMimicIOSBehavior(true);
    if (Platform.OS === 'android') {
      AvoidSoftInput.setAdjustPan();
    }
    return () => {
      AvoidSoftInput.setShouldMimicIOSBehavior(false);
      if (Platform.OS === 'android') {
        AvoidSoftInput.setAdjustResize();
      }
    };
  }, []);

  useFocusEffect(onFocusEffect);

  const chatHeaderCallback = useCallback(
    (props: NativeStackHeaderProps) => <ChatHeader {...props} />,
    [],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      header: chatHeaderCallback,
    });
  }, [chatHeaderCallback, navigation]);
  return (
    <SafeAreaView
      className="px-0 flex-1 bg-white"
      edges={['bottom', 'left', 'right']}>
      <AvoidSoftInputView className="flex-1">
        <View className="flex-1 px-3 bg-slate-300">
          <MessageListing />
        </View>
        <View>
          <Button
            onPress={() => navigation.navigate('NewOrder')}
            className="w-full justify-between rounded-none">
            <Text className="text-white">Start Order</Text>
            <ChevronRightIcon color="white" />
          </Button>
          <MessageInput />
        </View>
      </AvoidSoftInputView>
    </SafeAreaView>
  );
}
