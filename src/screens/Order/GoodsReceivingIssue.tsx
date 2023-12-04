import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useReducer} from 'react';
import Container from 'components/Container';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import clsx from 'libs/clsx';
import Button from 'components/Button';
import FormGroup from 'components/Form/FormGroup';
import Label from 'components/Form/Label';
import Input from 'components/Input';
import ImagePicker from 'components/ImagePicker';
import PlusIcon from 'assets/images/plus-circle.svg';
import colors from 'configs/colors';
import {useModal} from 'libs/modal';
import CloseCircleIcon from 'assets/images/check_no_active.svg';
import {REASON_OPTIONS} from 'utils/constants';
import Toast from 'react-native-simple-toast';
export default function GoodsReceivingIssue({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {lineItem, onUpdateIssue} = route.params || {};
  const {deliveryCheck} = lineItem || {};
  const {showModal, closeModal} = useModal();
  const [values, dispatch] = useReducer(reducer, {
    reason: REASON_OPTIONS.find(
      (opt: any) => opt?.value === deliveryCheck.reason,
    ),
    showedNotice: false,
    comment: deliveryCheck?.comment,
    photos: deliveryCheck?.photos || [],
    requestTroubleQuantity: deliveryCheck?.requestTroubleQuantity,
    errors: {},
  });

  function reducer(state: any, action: any) {
    return {...state, ...action};
  }

  const checkIncludePhoto = () => {
    if (photos.length === 0) {
      showModal({
        title: '',
        message:
          "Please ensure you include photo(s) of the received item when telling us an issue. Without visual evidence of the product, we won't be able to proceed with your report.",
        onConfirm: () => {
          closeModal();
          handleUpdateIssue(false);
        },
        modifiers: {
          confirmTitle: 'Got it',
        },
      });
    }
  };

  function handleUpdateIssue(checkPhoto: boolean = true) {
    if (
      (['WRONG_AMOUNT', 'POOR_QUALITY'].includes(reason?.value) &&
        !requestTroubleQuantity) ||
      (['OTHER'].includes(reason?.value) && !comment)
    ) {
      dispatch({errors: {requestTroubleQuantity: true}});
      Toast.show('Please enter all required fields', Toast.LONG);
      return;
    }

    if (checkPhoto) {
      checkIncludePhoto();
      return;
    }

    const newItem = {
      ...lineItem,
      deliveryCheck: {
        status: 'TROUBLED',
        reason: values.reason?.value,
        comment: values.comment,
        requestTroubleQuantity: values.requestTroubleQuantity,
        photos: values.photos.map((photo: any) => ({
          ...photo,
          filename: photo?.fileName,
          url: photo?.uri,
        })),
      },
    };

    onUpdateIssue(newItem);
    navigation.goBack();
  }

  function handleSelectPhoto(assets: any) {
    dispatch({photos: assets});
  }

  function removeImage(uri: string) {
    dispatch({
      photos: photos.filter((i: any) => i.uri !== uri),
    });
  }
  function handlePickImage(onPick: (() => void) | undefined) {
    if (values.showedNotice) {
      onPick?.();
    } else {
      dispatch({showedNotice: true});
      showModal({
        title: '',
        message:
          "Please ensure you include photo(s) of the received item when telling us an issue. Without visual evidence of the product, we won't be able to proceed with your report.",
        onConfirm: () => {
          closeModal();
          onPick?.();
        },
        modifiers: {
          confirmTitle: 'Got it',
        },
      });
    }
  }
  const {reason, requestTroubleQuantity, photos, comment, errors} = values;

  function handleChangeRequestTroubleQuantity(text: string) {
    let error = '';
    if (
      typeof parseFloat(text) === 'number' &&
      parseFloat(text) > lineItem.qty
    ) {
      error = `Must be less than ${lineItem.qty}`;
    }
    dispatch({
      requestTroubleQuantity: text,
      errors: {
        requestTroubleQuantity: error ? error : !text,
      },
    });
  }

  return (
    <Container>
      <View className="flex-row items-center py-6  bg-gray-EEF3FD">
        <Text className="text-30 font-bold w-16 text-center">
          {lineItem.qty}
        </Text>
        <View className="flex-1">
          <Text className="font-bold">{lineItem.name}</Text>
          <Text className="font-light mt-2">{lineItem.uom}</Text>
        </View>
      </View>
      <KeyboardAvoidingView>
        <ScrollView className="flex-1 mt-5">
          <View className="border border-gray-D1D5DB divide-y divide-gray-D1D5DB">
            {REASON_OPTIONS.map((item: any) => (
              <TouchableOpacity
                onPress={() => dispatch({reason: item})}
                key={item.id}
                className="flex-row items-center justify-between px-3 py-6">
                <Text>{item.name}</Text>
                <View
                  className={clsx({
                    'w-6 h-6 rounded-full items-center justify-center': true,
                    'bg-primary': item.id === reason?.id,
                    'border border-gray-D1D5DB': item.id !== reason?.id,
                  })}>
                  <View className="w-2.5 h-2.5 rounded-full bg-white" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View className="mt-5">
            {(reason?.id === 2 || reason?.id === 3) && (
              <FormGroup>
                <Label required>
                  {reason?.id === 2
                    ? 'Enter no. of items with wrong quantity'
                    : 'Enter no. of poor quality items'}
                </Label>
                <Input
                  placeholder="e.g. 0.8kg"
                  value={requestTroubleQuantity}
                  onChangeText={handleChangeRequestTroubleQuantity}
                  inputType="amount"
                  decimalPlaces={2}
                  keyboardType="numeric"
                  error={errors.requestTroubleQuantity}
                  // eslint-disable-next-line react/no-unstable-nested-components
                  EndComponent={() => (
                    <View className="flex-row items-center px-2 bg-gray-EEF3FD ">
                      <Text className="text-gray-500 font-semibold">
                        {lineItem?.uom}
                      </Text>
                    </View>
                  )}
                />
                {typeof errors.requestTroubleQuantity === 'string' && (
                  <Text className="text-error mt-2">
                    {errors.requestTroubleQuantity}
                  </Text>
                )}
              </FormGroup>
            )}

            {reason && (
              <FormGroup>
                <Label required={reason.value === 'OTHER'}>
                  Leave a comment
                </Label>
                <Input
                  multiline={true}
                  numberOfLines={6}
                  placeholder={'e.g. xx items are spoil'}
                  textAlignVertical={'top'}
                  className="h-[100px]"
                  scrollEnabled={false}
                  onChangeText={text =>
                    dispatch({
                      comment: text,
                      errors: {
                        comment: !text,
                      },
                    })
                  }
                  value={comment}
                  error={errors.comment && reason.value === 'OTHER'}
                />
              </FormGroup>
            )}
            {reason && reason.id !== 1 && (
              <FormGroup>
                <Label>Add photo</Label>
                <ImagePicker onChange={handleSelectPhoto}>
                  {({onPick, progress}) => (
                    <TouchableOpacity
                      onPress={() => handlePickImage(onPick)}
                      className="w-full h-[50px] bg-white flex-row relative border border-gray-300 rounded items-center justify-center ">
                      {!!progress && progress > 0 && progress < 100 ? (
                        <ActivityIndicator size={'large'} />
                      ) : (
                        <>
                          <PlusIcon color={colors.gray.D1D5DB} />
                          <Text className="text-gray-D1D5DB font-semibold ml-2 text-sm">
                            Upload Photo
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </ImagePicker>
                <View className="flex-row w-full flex-wrap mt-5">
                  {(photos || []).map((image: any) => {
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
              </FormGroup>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Button
        disabled={!reason || errors.requestTroubleQuantity}
        onPress={() => handleUpdateIssue()}>
        Confirm
      </Button>
    </Container>
  );
}
