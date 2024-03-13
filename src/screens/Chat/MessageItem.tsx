import {
  View,
  Image,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React from 'react';
import {IMessageItem} from './type';
import Text from 'components/Text';
import clsx from 'libs/clsx';
import dayjs from 'dayjs';
import DoubleCheck from 'assets/images/double-check.svg';
import colors from 'configs/colors';
import RenderHtml from 'react-native-render-html';
import {Dimensions} from 'react-native';
import OrderCardDetail from './OrderCardDetail';
import {IAsset} from 'components/ImagePicker';
import UploadProgress from 'components/UploadProgress';
import {useModal} from 'libs/modal';
import CloseCircle from 'assets/images/close-circle.svg';
import ClipboardListIcon from 'assets/images/clipboard-list.svg';
const {width: WINDOW_WIDTH} = Dimensions.get('window');
import * as Progress from 'react-native-progress';
import {formatBytes} from 'utils/format';

function Avatar({uri, name}: {uri?: string; name: string}) {
  return (
    <View
      className={clsx({
        'relative rounded-full flex-shrink-0  w-10 h-10 mr-3': true,
        'items-center justify-center bg-primary': !uri,
      })}>
      {uri ? (
        <Image source={{uri}} className="w-10 h-10 rounded-full" />
      ) : (
        <Text className="text-white font-medium">
          {name && name[0] ? name[0].toLocaleUpperCase() : ''}
        </Text>
      )}
    </View>
  );
}

function UploadProgressCircle({
  name,
  size = 40,
}: {
  name: string;
  size?: number;
}) {
  return (
    <UploadProgress filename={name || ''}>
      {({progress}) => {
        return (
          <Progress.Circle
            size={size}
            color={colors.primary.DEFAULT}
            thickness={2}
            // eslint-disable-next-line react-native/no-inline-styles
            textStyle={{fontSize: 8}}
            progress={(progress || 0) / 100}
            showsText
          />
        );
      }}
    </UploadProgress>
  );
}

function NetworkImage({asset}: {asset: IAsset}) {
  const {width, height, url} = asset;

  const imageStyle: any = {
    aspectRatio: width && height ? width / height : 1,
  };

  return (
    <View className="w-full">
      <Image
        style={[imageStyle]}
        className="w-full h-auto object-contain"
        source={{uri: url}}
      />
    </View>
  );
}

function LoadingImage({asset}: {asset: IAsset}) {
  const {width, height, uri, name} = asset;
  const imageStyle: any = {
    aspectRatio: width && height ? width / height : 1,
  };
  return (
    <View className="w-full relative">
      <Image
        style={[imageStyle]}
        className="w-full h-auto object-contain"
        source={{uri}}
      />
      <View className="w-full h-full absolute top-0 left-0 z-10 items-center justify-center bg-white/50">
        <UploadProgressCircle name={name || ''} />
      </View>
    </View>
  );
}

export default function MessageItem({
  item,
  currentUserId,
  isSameSender,
}: {
  item: IMessageItem;
  currentUserId: string;
  isSameSender?: boolean;
}) {
  const {
    createdAt,
    status,
    type,
    userId,
    userName,
    text,
    attachmentObject,
    avatarUrl,
  } = item || {};

  const isMine = userId === currentUserId;
  const {showCustomModal, closeModal} = useModal();

  function openLink(url: string) {
    try {
      Linking.openURL(url);
    } catch (err) {}
  }

  function getTextMsg() {
    if (!text) {
      return '';
    }
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    let msg = text.replace(':userName', isMine ? 'You' : `${userName}`);
    const containUrl = text ? urlRegex.test(text) : false;
    if (containUrl) {
      const msgArray: any[] = text.split(' ');
      msgArray.forEach((msgItem: any, index) => {
        if (msgItem.startsWith('https://')) {
          msgArray[index] = (
            <Text
              onPress={() => Linking.openURL(msgItem)}
              className="text-blue-500">
              {msgItem}
            </Text>
          );
        }
      });
      msg = msgArray.join(' ');
    }
    return msg;
  }
  function renderMessageFooter() {
    return (
      <View className="flex-row items-center mt-1 justify-end">
        <Text className="text-[10px] font-light text-gray-400">
          {dayjs(createdAt).format('HH:mm')}
        </Text>
        {isMine &&
          (status === 'unsent' ? (
            <ActivityIndicator
              className="ml-1"
              size={'small'}
              color={colors.primary.DEFAULT}
            />
          ) : (
            <DoubleCheck
              // eslint-disable-next-line react-native/no-inline-styles
              style={{marginLeft: 1}}
              color={
                status === 'seen' ? colors.primary.DEFAULT : colors.gray.D4D4D8
              }
              width={13}
              height={8}
            />
          ))}
      </View>
    );
  }
  function renderMessage() {
    return (
      <View
        className={clsx({
          'pt-1.5 pb-1 px-2  overflow-hidden': true,
          'rounded-b-xl rounded-tr-xl bg-gray-50': !isMine && !isSameSender,
          'rounded-t-xl rounded-bl-xl bg-primary-100': isMine && !isSameSender,
          'rounded-2xl': !!isSameSender,
          'bg-gray-50': !isMine,
          'bg-red-50': !!isMine,
        })}>
        <RenderHtml contentWidth={WINDOW_WIDTH} source={{html: getTextMsg()}} />
        {renderMessageFooter()}
      </View>
    );
  }

  function renderOrderCard() {
    return (
      <View className="w-full">
        <OrderCardDetail order={attachmentObject} />
        {renderMessage()}
      </View>
    );
  }
  function renderAttachment() {
    const {files} = attachmentObject || {};

    return (
      <View
        className={clsx({
          'w-full': true,
          'rounded-b-xl rounded-tr-xl bg-gray-50': !isMine,
          'rounded-t-xl rounded-bl-xl bg-red-50': isMine,
        })}>
        <View className="w-full">
          {Array.isArray(files) &&
            files.map(file => (
              <View
                key={file.url}
                className="flex-row w-full items-center justify-between px-2 pt-2">
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => openLink(file.url)}
                    disabled={status === 'unsent'}
                    className="items-center justify-center w-[56px] h-[56px] bg-red-100/50 rounded-full">
                    {status === 'unsent' ? (
                      <UploadProgressCircle name={file.name || ''} />
                    ) : (
                      <ClipboardListIcon
                        color={colors.primary.DEFAULT}
                        width={36}
                        height={36}
                      />
                    )}
                  </TouchableOpacity>

                  <View className="flex-1 ml-3">
                    <Text
                      className="text-base font-medium text-gray-500"
                      numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text className="text-sm  text-gray-500">
                      {formatBytes(file.size)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
        </View>

        <View className="px-2 pb-2 -mt-5">
          {!!text && (
            <Text className="text-gray-700 text-sm mt-1">{getTextMsg()}</Text>
          )}
          {renderMessageFooter()}
        </View>
      </View>
    );
  }
  function renderDocument() {
    const {files} = attachmentObject || {};
    return (
      <View
        className={clsx({
          'w-full': true,
          'rounded-b-xl rounded-tr-xl bg-gray-50': !isMine,
          'rounded-t-xl rounded-bl-xl bg-red-50': isMine,
        })}>
        <View className="w-full">
          {Array.isArray(files) &&
            files.map(file => (
              <View
                key={file.url}
                className="flex-row w-full items-center justify-between px-2 pt-2">
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => openLink(file.url)}
                    disabled={status === 'unsent'}
                    className="items-center justify-center w-[56px] h-[56px] bg-red-100/50 rounded-full">
                    {status === 'unsent' ? (
                      <UploadProgressCircle name={file.name || ''} />
                    ) : (
                      <ClipboardListIcon
                        color={colors.primary.DEFAULT}
                        width={36}
                        height={36}
                      />
                    )}
                  </TouchableOpacity>

                  <View className="flex-1 ml-3">
                    <Text
                      className="text-base font-medium text-gray-500"
                      numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text className="text-sm  text-gray-500">
                      {formatBytes(file.size)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
        </View>
        <View className="px-2 py-1">
          {!!text && (
            <Text className="text-gray-700 text-sm mt-1">{getTextMsg()}</Text>
          )}
          {renderMessageFooter()}
        </View>
      </View>
    );
  }

  function openImageModal(file: any) {
    showCustomModal({
      // eslint-disable-next-line react/no-unstable-nested-components
      content: () => (
        <SafeAreaView className="px-4 pt-10 w-full h-full relative flex-1 bg-black/80">
          <View className="flex-row justify-end px-5">
            <TouchableOpacity
              className=" bg-white rounded-full"
              onPress={() => closeModal()}>
              <CloseCircle width={30} height={30} />
            </TouchableOpacity>
          </View>

          <View className="flex-1 px-5 justify-center items-center">
            <NetworkImage asset={file} />
          </View>
        </SafeAreaView>
      ),
    });
  }
  function renderImage() {
    const {files} = attachmentObject || {};

    return (
      <View
        className={clsx({
          'overflow-hidden': true,
          'rounded-b-xl rounded-tr-xl bg-gray-50': !isMine,
          'rounded-t-xl rounded-bl-xl bg-red-50': isMine,
        })}>
        {Array.isArray(files) &&
          files.map(file => (
            <TouchableOpacity
              key={file.uri || file.url}
              disabled={status === 'unsent'}
              onPress={() => openImageModal(file)}
              className="overflow-hidden cursor-pointer w-full">
              {status === 'unsent' ? (
                <LoadingImage asset={file} />
              ) : (
                <NetworkImage asset={file} />
              )}
            </TouchableOpacity>
          ))}
        <View className="px-2 py-1">
          {!!text && (
            <Text className="text-gray-700 text-sm mt-1">{getTextMsg()}</Text>
          )}
          {renderMessageFooter()}
        </View>
      </View>
    );
  }

  if (type === 'group_notification') {
    const msg = text?.replace(':userName', isMine ? 'You' : `${userName}`);
    return (
      <View
        className={clsx({
          ' py-8 justify-center flex-row ': true,
        })}>
        <Text className="text-gray-600 text-sm">{msg}</Text>
      </View>
    );
  }

  return (
    <View
      className={clsx({
        'flex-row mt-1': true,
        'justify-start': !isMine,
        'justify-end': !!isMine,
      })}>
      {isSameSender || isMine ? (
        <View className="w-12" />
      ) : (
        <Avatar uri={avatarUrl} name={userName} />
      )}
      <View className="max-w-[80%] w-auto">
        {/* {<Text>{dayjs(createdAt).format('DD/MM/YYYY HH:mm')}</Text>} */}
        {type === 'text' && renderMessage()}
        {type === 'order_card' && renderOrderCard()}
        {type === 'attachment' && renderAttachment()}
        {type === 'document' && renderDocument()}
        {type === 'photo' && renderImage()}
      </View>
    </View>
  );
}
