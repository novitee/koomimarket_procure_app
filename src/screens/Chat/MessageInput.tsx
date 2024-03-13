import {View, TouchableOpacity} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import Input from 'components/Input';
import AttachmentPicker from './AttachmentPicker';
import EmojiPicker from './EmojiPicker';
import SendCircle from 'assets/images/send-circle.svg';
import firestore from '@react-native-firebase/firestore';
import useMutation from 'libs/swr/useMutation';
import {useGlobalStore} from 'stores/global';
import useMe from 'hooks/useMe';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
export default function MessageInput() {
  const [text, setText] = useState('');
  const [inputHeight, setInputHeight] = useState(50);
  const {currentChannel} = useGlobalStore();
  const {user} = useMe();
  const {id: userId} = user?.me || {};
  const channelId = currentChannel?.id || '';
  const isFirstLoad = useRef<Boolean>(false);
  const isTypingCalled = useRef<Boolean>(false);

  const fireStoreInstance = firestore()
    .collection('channelMessages')
    .doc(channelId);

  const [{}, submitMessage] = useMutation({
    url: '',
    method: 'POST',
  });
  function handleChangeText(textValue: string) {
    setText(textValue);

    if (!textValue) {
      turnOffTyping();
    } else {
      turnOnTyping();
    }
  }

  const finalInputHeight = useMemo(() => {
    if (inputHeight < 50) {
      return 50;
    }
    if (inputHeight + 20 > 200) {
      return 20;
    }
    return inputHeight + 20;
  }, [inputHeight]);

  function turnOnTyping() {
    if (!isTypingCalled.current) {
      isTypingCalled.current = true;
      fireStoreInstance.update({
        'actions.typings': {
          [userId]: true,
        },
      });
    }
  }

  function turnOffTyping() {
    if (isTypingCalled.current) {
      isTypingCalled.current = false;
      fireStoreInstance.update({
        'actions.typings': {
          [userId]: false,
        },
      });
    }
  }

  function handleSendText() {
    if (text) {
      submitMessage(
        {
          message: {
            type: 'text',
            text,
            channelId,
            clientMsgId: uuidv4(),
          },
        },
        {
          overrides: {
            url: `/channels/${channelId}/messages`,
          },
        },
      );
      setText('');
    }
  }
  useEffect(() => {
    isFirstLoad.current = true;
  }, []);

  function handleAddAttachment() {}

  function handleAddEmoji(emoji: string) {
    setText(`${text}${emoji}`);
  }

  return (
    <View className="flex-row items-center px-3 ">
      <EmojiPicker handleSelect={handleAddEmoji} />
      <Input
        multiline
        value={text}
        className="flex-1 border-0 pt-4 "
        inputClassName="px-3 pb-3.5 pt-0"
        onChangeText={handleChangeText}
        showSoftInputOnFocus={!!isFirstLoad.current}
        autoFocus={true}
        onContentSizeChange={e =>
          setInputHeight(e.nativeEvent.contentSize.height)
        }
        style={{height: finalInputHeight}}
      />
      {text ? (
        <TouchableOpacity hitSlop={10} onPress={handleSendText}>
          <SendCircle width={40} height={40} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity hitSlop={10} onPress={handleAddAttachment}>
          <AttachmentPicker />
        </TouchableOpacity>
      )}
    </View>
  );
}
