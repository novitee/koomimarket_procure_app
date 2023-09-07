import {Image, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from 'components/Text';
import HomeIcon from 'assets/images/home.svg';
import CameraIcon from 'assets/images/camera.svg';
import ImagePicker from 'components/ImagePicker';
import {Asset} from 'react-native-image-picker';

export default function ImageUpload({
  onChange,
  icon,
  editable = true,
}: {
  onChange?: ((value: Asset | Asset[]) => void) | undefined;
  icon?: React.ReactNode;
  editable?: boolean;
}) {
  return (
    <ImagePicker onChange={onChange}>
      {({onPick, selectedUri, progress}) => (
        <View className="w-[164px] h-[164px] rounded-full bg-gray-E0E0E4 items-center justify-center ">
          {selectedUri && editable ? (
            <Image
              resizeMode="cover"
              resizeMethod="scale"
              className="w-full h-full overflow-hidden rounded-full"
              source={{uri: selectedUri[0]}}
            />
          ) : icon ? (
            icon
          ) : (
            <HomeIcon />
          )}
          {!!progress && progress > 0 && progress < 100 && (
            <View className="absolute w-full h-full rounded-full overflow-hidden items-center justify-center">
              <Text className="text-white font-medium">{`Uploading ${progress}%`}</Text>
            </View>
          )}
          {editable && (
            <TouchableOpacity
              onPress={onPick}
              className="w-12 h-12 rounded-full items-center justify-center bg-primary absolute -bottom-2 right-3 z-20">
              <CameraIcon color="#ffffff" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </ImagePicker>
  );
}
