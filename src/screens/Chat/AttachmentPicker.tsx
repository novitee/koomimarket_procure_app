import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import PaperclipIcon from 'assets/images/paperclip.svg';

import BottomSheet from 'components/BottomSheet';
import CloseCircle from 'assets/images/close-circle.svg';
import ImagePicker, {IAsset} from 'components/ImagePicker';
import {isEmptyArray} from 'utils/validate';
import FilePicker, {IFile} from 'components/FilePicker';
import {IMessageItem} from './type';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import {useChatStore} from 'stores/chat';
import {useGlobalStore} from 'stores/global';
import useMe from 'hooks/useMe';
import useMutation from 'libs/swr/useMutation';
import ImageIcon from 'assets/images/camera.svg';
import FileIcon from 'assets/images/document-text.svg';
import colors from 'configs/colors';
function AttachmentPicker() {
  const {addLocalMessage} = useChatStore();
  const [isOpen, setIsOpen] = useState(false);
  const {currentChannel} = useGlobalStore();
  const {user} = useMe();
  const {id: userId, fullName} = user?.me || {};
  const channelId = currentChannel?.id || '';

  const [{}, submitMessage] = useMutation({
    url: '',
    method: 'POST',
  });

  async function handlePickImage(assets: IAsset[]) {
    if (!assets || isEmptyArray(assets)) {
      return;
    }

    await Promise.all([
      assets.map(async (asset: IAsset) => {
        const a = await submitMessage(
          {
            message: {
              channelId,
              attachmentObject: {
                files: [
                  {
                    url: asset.uri,
                    type: asset.type,
                    name: asset.fileName,
                    size: asset.size,
                    width: asset.width,
                    height: asset.height,
                  },
                ],
              },
              text: '',
              type: 'photo',
              clientMsgId: asset.uuid,
            },
          },
          {
            overrides: {
              url: `/channels/${channelId}/messages`,
            },
          },
        );
        console.log(`a :>>`, a);
      }),
    ]);
  }

  function handleSelectImage(values: IAsset[]) {
    setIsOpen(false);
    values.map((value: IAsset) => {
      const message: IMessageItem = {
        id: uuidv4(),
        clientMsgId: value.uuid,
        createdAt: new Date(),
        type: 'photo',
        status: 'unsent',
        channelId: channelId,
        userId: userId,
        userName: fullName,
        attachmentObject: {
          files: [
            {
              uri: value.uri,
              type: value.type,
              name: value.fileName,
              size: value.fileSize,
              width: value.width,
              height: value.height,
            },
          ],
        },
      };
      addLocalMessage(message);
    });
  }

  async function handlePickDocument(files: IFile[]) {
    if (!files || isEmptyArray(files)) {
      return;
    }

    await Promise.all([
      files.map(async (file: IFile) => {
        const a = await submitMessage(
          {
            message: {
              channelId,
              attachmentObject: {
                files: [
                  {
                    url: file.uri,
                    type: file.type,
                    name: file.name,
                    size: file.size,
                  },
                ],
              },
              text: '',
              type: 'attachment',
              clientMsgId: file.uuid,
            },
          },
          {
            overrides: {
              url: `/channels/${channelId}/messages`,
            },
          },
        );
        console.log(`a file :>>`, a);
      }),
    ]);
  }

  function handleSelectDocument(values: IFile[]) {
    setIsOpen(false);
    values.map((value: IFile) => {
      const message: IMessageItem = {
        id: uuidv4(),
        clientMsgId: value.uuid,
        createdAt: new Date(),
        type: 'attachment',
        status: 'unsent',
        channelId: channelId,
        userId: userId,
        userName: fullName,
        attachmentObject: {
          files: [
            {
              uri: value.uri,
              type: value.type,
              name: value.name,
              size: value.name,
            },
          ],
        },
      };
      addLocalMessage(message);
    });
  }

  return (
    <>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
        <PaperclipIcon className="w-6 h-6" />
      </TouchableOpacity>
      <BottomSheet
        isOpen={isOpen}
        contentHeight={200}
        onClose={() => setIsOpen(false)}>
        <View className="pb-10 pt-3 flex-1">
          <View className="flex-row justify-end pr-3">
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <CloseCircle width={24} height={24} />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center w-full px-5 pt-5">
            <ImagePicker
              onChange={handlePickImage}
              onSelect={handleSelectImage}>
              {({onPick}) => (
                <TouchableOpacity
                  onPress={onPick}
                  className="flex-1 h-20 rounded-xl border-2 border-gray-400 border-dashed items-center justify-center ">
                  <ImageIcon color={colors.gray.D4D4D8} />
                  <Text className="text-gray-400 mt-1">Upload Image</Text>
                </TouchableOpacity>
              )}
            </ImagePicker>

            <FilePicker
              onChange={handlePickDocument}
              onSelect={handleSelectDocument}>
              {({onPick}) => (
                <TouchableOpacity
                  onPress={onPick}
                  className="flex-1 h-20 rounded-xl border-2 border-gray-400 border-dashed items-center justify-center ml-5">
                  <FileIcon color={colors.gray.D4D4D8} />
                  <Text className="text-gray-400">Upload documents</Text>
                </TouchableOpacity>
              )}
            </FilePicker>
          </View>
        </View>
      </BottomSheet>
    </>
  );
}

export default AttachmentPicker;
