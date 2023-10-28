import {ActivityIndicator, TouchableOpacity, View, Image} from 'react-native';
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
import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
import ProgressBar from 'components/ProgressBar';
import Clipboard from '@react-native-clipboard/clipboard';
import clsx from 'libs/clsx';
import CloseCircleIcon from 'assets/images/check_no_active.svg';

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

  // const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    photos: [],
    comment: '',
    copied: false,
    errors: '',
  });

  function reducer(state: any, action: any) {
    return {
      ...state,
      ...action,
    };
  }

  const {photos, comment, errors} = values;

  async function handleSubmit() {
    let opts = {method: 'SEND_EMAIL'} as ManualOrderOptions;
    if (type === 'photo') {
      if (!photos?.length || !comment) {
        Toast.show('Please enter all required fields', Toast.LONG);
        return false;
      }
      opts = {
        method: 'SEND_PHOTO',
        photos: photos.map((photo: any) => ({
          ...photo,
          filename: photo?.fileName,
          url: photo?.uri,
        })),
        comment,
      };
    }
    const response = await newManualOrder(opts);
    const {data, success, error} = response || {};
    console.log('response :>> ', response);
    if (!success) {
      Toast.show(error?.message, Toast.LONG);
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
    dispatch({
      photos: assets.map((asset: any) => ({
        ...asset,
        filename: asset?.fileName,
        url: asset?.uri,
      })),
      errors: {
        photos: !(assets?.length > 0),
      },
    });
  }
  function removeImage(uri: string) {
    dispatch({
      photos: photos.filter((i: any) => i.url !== uri),
      render: true,
    });
  }

  return (
    <>
      <ProgressBar total={5} step={5} tag="AddSupplierManually" />

      <Container>
        <View className="flex-1 pt-5">
          {type === 'email' && (
            <View className="">
              <Label required>
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
                <Button
                  onPress={() => {
                    Clipboard.setString(SUPPORT_EMAIL);
                    dispatch({copied: true, render: true});
                  }}
                  className="w-20 h-full px-0 rounded-l-none rounded-r-lg border-primary">
                  {values.copied ? 'Copied!' : 'Copy'}
                </Button>
              </View>
            </View>
          )}
          {type === 'photo' && (
            <View>
              <FormGroup>
                <Label required>Upload Photo</Label>

                <ImagePicker onChange={handleSelectPhoto}>
                  {({onPick, progress}) => (
                    <TouchableOpacity
                      onPress={onPick}
                      className={clsx({
                        'w-full h-[130px] rounded-2xl border border-dashed bg-white items-center justify-center border-gray-71717A':
                          true,
                      })}>
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

                <View className="flex-row w-full flex-wrap pt-3 gap-4">
                  {photos.map((photo: any, index: number) => (
                    <View key={index} className="">
                      <Image
                        source={{uri: photo?.url}}
                        resizeMode="cover"
                        resizeMethod="scale"
                        className="w-32 h-32 rounded-lg bg-slate-200"
                      />
                      <TouchableOpacity
                        className="absolute -right-2 -top-2 z-50 bg-white rounded-full"
                        onPress={() => removeImage(photo?.url)}>
                        <CloseCircleIcon width={24} height={24} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </FormGroup>
              <FormGroup>
                <Label required>Comment</Label>
                <Input
                  placeholder="Enter your message"
                  onChangeText={text =>
                    dispatch({
                      comment: text,
                      errors: {
                        comment: !text,
                      },
                    })
                  }
                  error={errors?.comment}
                />
              </FormGroup>
            </View>
          )}
        </View>
        <Button onPress={onDone}>{buttonText[type]}</Button>
      </Container>
    </>
  );
}
