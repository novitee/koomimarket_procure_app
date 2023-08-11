import React, {useState} from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import Text from './Text';
import axios, {AxiosRequestConfig} from 'axios';
import {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';
import useMutation from 'libs/swr/useMutation';
import {formatFilename} from 'utils/format';
import Toast from 'react-native-simple-toast';

interface ImagePickerProps extends Omit<TouchableOpacityProps, 'children'> {
  onChange?: (value: Asset | Asset[]) => void;
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

  const getBlob = async (fileUri: string) => {
    const resp = await fetch(fileUri);
    const imageBody = await resp.blob();
    return imageBody;
  };

  async function handleUpload(assets: Asset[]) {
    const uploadedImages: (Asset & {signedKey?: string})[] = [];
    await Promise.all(
      assets.map(async file => {
        const variables = {
          filename: formatFilename(file.fileName),
        };

        const {data} = await getSignS3(variables);

        if (data) {
          const axiosOptions: AxiosRequestConfig = {
            headers: {
              'Content-Type': file.type,
              'x-amz-acl': 'public-read',
            },
            onUploadProgress: progressEvent => {
              if (progressEvent.total) {
                setProgress(
                  Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total,
                  ),
                );
              }
            },
          };

          const imageBlob = await getBlob(file?.uri || '');
          try {
            const res = await axios.put(
              data.signedRequestURL,
              imageBlob,
              axiosOptions,
            );
            if (res) {
              uploadedImages.push({
                ...file,
                uri: data.url || '',
                signedKey: data.signedKey,
              });
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

    onChange?.(uploadedImages);
  }

  async function handleSelect() {
    launchImageLibrary(
      {
        ...options,
        selectionLimit: multiple ? 0 : 1,
      },
      res => {
        if (res.didCancel) {
          return;
        }
        setResp(res);
        if (res && res.assets) {
          handleUpload(res.assets);

          // if (multiple) {
          // } else {
          //   onChange?.(multiple ? res.assets : res.assets[0]);
          // }
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
