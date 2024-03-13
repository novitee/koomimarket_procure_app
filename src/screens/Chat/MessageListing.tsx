import {StyleSheet, ActivityIndicator} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlashList} from '@shopify/flash-list';
import MessageItem from './MessageItem';

import firestore from '@react-native-firebase/firestore';
import useMe from 'hooks/useMe';
import {IMessageItem} from './type';
import dayjs from 'dayjs';
import DateSeparator from './DateSeparator';
import colors from 'configs/colors';
import {useGlobalStore} from 'stores/global';
import {getChat, useChatStore} from 'stores/chat';

const PAGE_SIZE = 20;

export default function MessageListing() {
  const [messages, setMessages] = useState<any>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const {currentChannel} = useGlobalStore();
  const {user} = useMe();
  const {id: currentUserId} = user?.me || {};
  const {localMessages} = useChatStore();

  const isFirstSnapshotLoaded = useRef<Boolean>(false);
  const fireStoreInstance = firestore()
    .collection('channelMessages')
    .doc(currentChannel?.id)
    // .doc('65e5445310d00ac9b38335de')
    .collection('messages');

  const loadMessages = async () => {
    setLoadingMore(true);
    let query = fireStoreInstance.orderBy('createdAt', 'desc').limit(PAGE_SIZE);
    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }
    try {
      const snapshot = await query.get();
      const data = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
      if (data.length > 0) {
        const lastDocument = snapshot.docs[snapshot.docs.length - 1];
        setLastDoc(lastDocument);
        setMessages((prevMessages: any) => {
          if (lastDoc) {
            return [...prevMessages, ...data];
          } else {
            return data;
          }
        });
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const subscriber = fireStoreInstance.onSnapshot(
      {includeMetadataChanges: true},
      documentSnapshot => {
        if (!isFirstSnapshotLoaded.current) {
          isFirstSnapshotLoaded.current = true;
          return;
        }
        const docChanges = documentSnapshot.docChanges({
          includeMetadataChanges: true,
        });
        docChanges.forEach(change => {
          if (change.type === 'added') {
            const newMessage = change.doc.data();
            const {localMessages: localMessagesData, setLocalMessages} =
              getChat();
            const existedIndex = (localMessagesData || []).findIndex(
              m => m.clientMsgId === newMessage.clientMsgId,
            );
            if (existedIndex > -1) {
              const newLocalMessages = (localMessagesData || []).filter(
                (m, index) => index !== existedIndex,
              );
              setLocalMessages(newLocalMessages);
            }

            setMessages((prevMessages: any) => {
              return [newMessage, ...prevMessages];
            });
          }
        });
      },
    );

    // Stop listening for updates when no longer required
    return () => subscriber();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const _renderItem = useCallback(
    ({
      item,
      index,
      extraData,
    }: {
      item: IMessageItem;
      index: number;
      extraData?: any;
    }) => {
      const nextMsg =
        index === extraData.length - 1 ? null : extraData[index + 1];
      let renderDateSeparator = true;

      if (nextMsg && dayjs(nextMsg.createdAt).isSame(item.createdAt, 'date')) {
        renderDateSeparator = false;
      }
      const isSameSender = nextMsg?.userId === item?.userId;
      return (
        <React.Fragment>
          {renderDateSeparator && <DateSeparator dateTime={item.createdAt} />}
          <MessageItem
            item={item}
            currentUserId={currentUserId}
            isSameSender={isSameSender}
          />
        </React.Fragment>
      );
    },
    [currentUserId],
  );

  const renderFooter = () => {
    if (loadingMore) {
      return (
        <ActivityIndicator
          size="small"
          color={colors.primary.DEFAULT}
          className="my-3"
        />
      );
    }
    return null;
  };

  const totalMessages = [...(localMessages || []), ...(messages || [])];

  return (
    <FlashList
      showsVerticalScrollIndicator={false}
      inverted
      data={totalMessages}
      extraData={totalMessages}
      renderItem={_renderItem}
      estimatedItemSize={200}
      contentContainerStyle={styles.contentContainerStyle}
      onEndReached={loadMessages}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingTop: 20,
  },
});
