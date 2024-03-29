import React, {useState} from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import Text from './Text';
import {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';
import useMutation from 'libs/swr/useMutation';
import {fileSize, formatFilename} from 'utils/format';
import Toast from 'react-native-simple-toast';
import {useGlobalStore} from 'stores/global';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
export type IAsset = Asset & {
  uuid?: string;
  size?: number;
  name?: string;
  url?: string;
};

interface ImagePickerProps extends Omit<TouchableOpacityProps, 'children'> {
  onChange?: (value: IAsset[]) => void;
  onSelect?: (value: IAsset[]) => void;
  options?: CameraOptions | ImageLibraryOptions;
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

export default function ImagePicker({
  onChange,
  onSelect,
  options = {
    mediaType: 'photo',
    includeBase64: false,
    includeExtra: true,
  },
  multiple = false,
  placeholder = 'Select Photo',
  children,
}: ImagePickerProps) {
  const [resp, setResp] = useState<ImagePickerResponse>();
  const [progress, setProgress] = useState(0);
  const {setUploadProgress} = useGlobalStore();

  const [{}, getSignS3] = useMutation({
    url: 's3/sign',
  });

  function getImageData(file: Asset) {
    return {
      uri: file.uri,
      type: file.type,
      name: file.fileName,
    };
  }

  async function handleUpload(assets: Asset[]) {
    const uploadedImages: (Asset & {signedKey?: string})[] = [];
    setProgress(1);
    const uploadToS3 = (data: any, file: Asset) => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', data.signedRequestURL, true);
        xhr.upload.onprogress = function (event) {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setUploadProgress?.({
              [file.fileName as string]: percentComplete,
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
                size: fileSize(file.fileSize || 0),
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
        xhr.send(getImageData(file));
      });
    };
    await Promise.all(
      assets.map(async file => {
        const variables = {
          filename: formatFilename(file.fileName),
        };

        const {data} = await getSignS3(variables);

        if (data) {
          try {
            const uploadedFile = await uploadToS3(data, file);

            if (uploadedFile) {
              uploadedImages.push(uploadedFile as any);
            } else {
              Toast.show('Storage provider error! Can not upload photo.');
            }
          } catch (error) {
            Toast.show('Storage provider error! Can not upload photo.');
          }
        } else {
          Toast.show('Server side error! Can not upload photo.');
        }
      }),
    );
    setProgress(100);

    onChange?.(uploadedImages);
  }

  async function handleSelect() {
    launchImageLibrary(
      {
        ...options,
        selectionLimit: multiple ? 0 : 1,
      },
      async res => {
        if (res.didCancel) {
          return;
        }
        setResp(res);
        if (res && res.assets) {
          const selectedAssets = res.assets.map(asset => {
            return {
              ...asset,
              uuid: uuidv4(),
            };
          });
          onSelect?.(selectedAssets);
          await handleUpload(selectedAssets);
        }
      },
    );
  }

  const uri = resp && resp.assets && resp.assets.map(asset => asset.uri || '');

  return children ? (
    <>{children({onPick: handleSelect, selectedUri: uri, progress})}</>
  ) : (
    <TouchableOpacity
      className="px-5 py-3 rounded-5 bg-gray-F5F6FA min-h-[56px] justify-center"
      onPress={handleSelect}>
      <Text className="text-gray-92">{placeholder}</Text>
    </TouchableOpacity>
  );
}
