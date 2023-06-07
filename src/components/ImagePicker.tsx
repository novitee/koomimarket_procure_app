import React, {useState} from 'react';
import {Platform, TouchableOpacity, TouchableOpacityProps} from 'react-native';
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

  const [{loading, error}, getSignS3] = useMutation({
    url: 's3/sign',
  });

  console.log(`loading :>>`, loading);
  console.log(`error111 :>>`, error);
  function getImageData(file: Asset) {
    return {
      uri:
        Platform.OS === 'android'
          ? file.uri
          : (file.uri || '').replace('file://', ''),
      type: file.type,
      name: file.fileName,
    };
  }

  async function handleUpload(assets: Asset[]) {
    const uploadedImages: Asset[] = [];
    await Promise.all(
      assets.map(async file => {
        const variables = {
          filename: formatFilename(file.fileName, '', 'images'),
          filetype: file.type,
        };

        const {data} = await getSignS3({variables});
        console.log(`data :>>`, data);

        const signed = data?.signS3;

        if (signed) {
          const axiosOptions: AxiosRequestConfig = {
            headers: {'content-type': file.type},
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
          try {
            const res = await axios.put(
              signed.signedRequestURL,
              file,
              axiosOptions,
            );

            if (res) {
              uploadedImages.push({
                ...file,
                uri: signed.url,
              });
            } else {
              Toast.show('Storage provider error! Can not upload photo.');
            }
          } catch (error) {
            console.log(`error :>>`, error);
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
