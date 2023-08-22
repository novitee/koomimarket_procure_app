import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import React, {useLayoutEffect, useReducer, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Container from 'components/Container';
import Button from 'components/Button';
import Label from 'components/Form/Label';
import {SUPPORT_EMAIL} from 'configs/index';
import Text from 'components/Text';
import Input from 'components/Input';
import FormGroup from 'components/Form/FormGroup';
import DocIcon from 'assets/images/clipboard-list.svg';
import PlusIcon from 'assets/images/plus-circle.svg';
import ImagePicker from 'components/ImagePicker';
import colors from 'configs/colors';
import useMutation, {MutationProps} from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';

type ManualOrderOptions = {
  method: string;
  comment?: string;
  photos?: any[];
};

const titles: Record<string, string> = {
  photo: 'Send a Photo',
  email: 'Send an Email',
};
const buttonText: Record<string, string> = {
  photo: 'Done',
  email: 'I have sent the email',
};

export default function SendInfo({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {params} = route || {};
  const {type, supplierId} = params || {};

  const [{loading}, newManualOrder] = useMutation({
    url: `suppliers/${supplierId}/add-manual-order`,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: titles[type],
    });
  }, [navigation, type]);

  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    photos: [],
    comment: '',
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

  const {photos, comment} = values;

  async function handleSubmit() {
    let opts = {method: 'SEND_EMAIL'} as ManualOrderOptions;
    if (type === 'photo') {
      opts = {
        method: 'SEND_PHOTO',
        photos: photos.map((photo: any) => ({
          ...photo,
          filename: photo.fileName,
          url: photo.uri,
        })),
        comment,
      };
    }
    const {data, success, error} = await newManualOrder(opts);
    if (!success) {
      Toast.show(error?.message);
      return false;
    }

    return true;
  }

  async function onDone() {
    const success = await handleSubmit();
    if (success) {
      navigation.navigate('CompleteAdding');
    }
  }

  function handleSelectPhoto(assets: any) {
    dispatch({photos: assets, render: true});
  }

  return (
    <Container>
      <View className="flex-1 pt-5">
        {type === 'email' && (
          <View className="">
            <Label>
              Attach any digital invoices / delivery receipts and send to this
              email:
            </Label>
            <View className="flex-row h-[60px] mt-7">
              <Input
                defaultValue={SUPPORT_EMAIL}
                editable={false}
                className="rounded-l-lg rounded-r-none h-full flex-1"
                inputClassName="text-primary font-semibold"
              />
              <Button className="w-20 h-full rounded-l-none rounded-r-lg border-primary">
                Copy
              </Button>
            </View>
          </View>
        )}
        {type === 'photo' && (
          <View>
            <FormGroup>
              <Label>Upload Photo</Label>

              <ImagePicker onChange={handleSelectPhoto}>
                {({onPick, progress}) => (
                  <TouchableOpacity
                    onPress={onPick}
                    className="w-full h-[130px] rounded-2xl border border-dashed border-gray-71717A bg-white items-center justify-center ">
                    {!!progress && progress > 0 && progress < 100 ? (
                      <ActivityIndicator size={'large'} />
                    ) : (
                      <>
                        <PlusIcon color={colors.gray.D1D5DB} />
                        <Text className="text-gray-D4D4D8 font-semibold mt-2 text-sm">
                          Upload Photo
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </ImagePicker>

              <View className="mt-3">
                {photos.map((photo: any, index: number) => (
                  <View key={index} className="flex-row items-center">
                    <DocIcon color={colors.primary.DEFAULT} />
                    <Text className="text-primary font-medium ml-2 text-sm">
                      {photo.fileName}
                    </Text>
                  </View>
                ))}
              </View>
            </FormGroup>
            <FormGroup>
              <Label>Comment</Label>
              <Input
                placeholder="Enter your message"
                onChangeText={text => dispatch({comment: text})}
              />
            </FormGroup>
          </View>
        )}
      </View>
      <Button onPress={onDone}>{buttonText[type]}</Button>
    </Container>
  );
}
