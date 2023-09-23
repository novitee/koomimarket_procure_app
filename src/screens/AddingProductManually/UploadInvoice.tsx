import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useReducer, useState} from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import AddIcon from 'assets/images/plus.svg';
import colors from 'configs/colors';
import ImagePicker from 'components/ImagePicker';
import useMutation from 'libs/swr/useMutation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import CloseCircleIcon from 'assets/images/check_no_active.svg';

export default function UploadInvoiceScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    images: [],
  });

  function reducer(state: any, action: any) {
    const updatedValues = state;

    if (action.render) {
      setCurrentState(1 - currentState);
    }

    return {
      ...updatedValues,
      ...action,
    };
  }

  const {images} = values;

  const [{loading}, uploadInvoice] = useMutation({
    url: 'upload-invoice',
  });

  function handleSend() {
    const {data, success, error} = uploadInvoice({
      images,
    });
    navigation.navigate('CompleteUploadInvoice');
    // if (success) {
    //   navigation.navigate('CompleteUploadInvoice');
    // } else {
    //   Toast.show(error.message);
    // }
  }

  function removeImage(uri: string) {
    dispatch({
      images: images.filter((i: any) => i.uri !== uri),
      render: true,
    });
  }

  return (
    <Container>
      <View className="flex-1">
        <ImagePicker
          onChange={(assets: any) => dispatch({images: assets, render: true})}>
          {({onPick, progress = 0}) => (
            <TouchableOpacity
              onPress={onPick}
              className="border border-primary border-dashed rounded items-center justify-center py-10">
              {progress > 0 && progress < 100 ? (
                <ActivityIndicator
                  size={'large'}
                  color={colors.primary.DEFAULT}
                />
              ) : (
                <>
                  <View className="w-8 h-8 items-center justify-center rounded-full border-[3px] border-primary">
                    <AddIcon color={colors.primary.DEFAULT} strokeWidth="3" />
                  </View>
                  <Text className="text-primary mt-7">
                    Add invoice or stock-take sheet
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </ImagePicker>

        <View className="flex-row w-full flex-wrap pt-5 gap-4">
          {images.map((image: any) => {
            return (
              <View key={image.uri}>
                <Image
                  source={{uri: image.uri}}
                  resizeMode="cover"
                  resizeMethod="scale"
                  className="w-40 h-40 bg-slate-300 rounded-lg"
                />
                <TouchableOpacity
                  className="absolute -right-2 -top-2 z-50 bg-white rounded-full"
                  onPress={() => removeImage(image.uri)}>
                  <CloseCircleIcon width={24} height={24} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      <Button
        loading={loading}
        onPress={handleSend}
        disabled={images.length === 0}>
        Send
      </Button>
    </Container>
  );
}
