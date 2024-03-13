import React from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import Text from './Text';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import useMutation from 'libs/swr/useMutation';
import {formatFilename} from 'utils/format';
import Toast from 'react-native-simple-toast';
import {useGlobalStore} from 'stores/global';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

export type IFile = DocumentPickerResponse & {
  uuid?: string;
  url?: string;
};
interface FilePickerProps extends Omit<TouchableOpacityProps, 'children'> {
  onChange?: (value: IFile[]) => void;
  onSelect?: (value: IFile[]) => void;

  multiple?: boolean;
  placeholder?: string;
  children?: ({
    onPick,
    selectedUri,
    progress,
  }: {
    onPick?: () => void;
    selectedUri?: string[];
    progress?: number;
  }) => void;
}

export default function FilePicker({
  onChange,
  onSelect,
  placeholder = 'Select Photo',
  children,
}: FilePickerProps) {
  const {setUploadProgress} = useGlobalStore();
  const [{}, getSignS3] = useMutation({
    url: 's3/sign',
  });

  function getFileData(file: DocumentPickerResponse) {
    return {
      uri: file.uri,
      type: file.type,
      name: file.name,
      size: file.size,
    };
  }

  async function handleUpload(assets: IFile[]) {
    const uploadedFiles: (IFile & {signedKey?: string})[] = [];
    const uploadToS3 = (data: any, file: IFile) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', data.signedRequestURL, true);
        xhr.upload.onprogress = function (event) {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setUploadProgress?.({
              [file.name as string]: percentComplete,
            });
          }
        };
        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
              resolve({
                ...file,
                uri: data.url || '',
                signedKey: data.signedKey,
                size: file.size || 0,
              });
            } else {
              reject(xhr.statusText);
            }
          }
        };
        xhr.setRequestHeader(
          'Content-Type',
          file.type || 'application/octet-stream',
        );
        xhr.setRequestHeader('x-amz-acl', 'public-read');
        xhr.send(getFileData(file));
      });
    };

    await Promise.all(
      assets.map(async file => {
        const variables = {
          filename: formatFilename(file.name || ''),
        };

        const {data} = await getSignS3(variables);

        if (data) {
          try {
            const uploadedFile = await uploadToS3(data, file);
            if (uploadedFile) {
              uploadedFiles.push(uploadedFile as any);
            }
          } catch (error) {
            Toast.show('Storage provider error! Can not upload file.');
          }
        } else {
          Toast.show('Server side error! Can not upload file.');
        }
      }),
    );
    onChange?.(uploadedFiles);
  }

  async function handleSelect() {
    try {
      const pickerResult = await DocumentPicker.pickSingle({});
      const selectedFile: IFile = {
        ...pickerResult,
        uuid: uuidv4(),
      };
      onSelect?.([selectedFile]);
      await handleUpload([selectedFile]);
    } catch (e) {
      console.log(`e :>>`, e);
    }
  }

  return children ? (
    <>{children({onPick: handleSelect})}</>
  ) : (
    <TouchableOpacity
      className="px-5 py-3 rounded-5 bg-gray-F5F6FA min-h-[56px] justify-center"
      onPress={handleSelect}>
      <Text className="text-gray-92">{placeholder}</Text>
    </TouchableOpacity>
  );
}
