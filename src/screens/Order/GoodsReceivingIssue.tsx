import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import React, {useReducer, useState} from 'react';
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
const reasonOptions = [
  {
    id: 1,
    name: 'Missing',
    value: 'MISSING',
  },
  {
    id: 2,
    name: 'Spoil',
    value: 'SPOIL',
  },
  {
    id: 3,
    name: 'Wrong Amount',
    value: 'WRONG_AMOUNT',
  },
  {
    id: 4,
    name: 'Other',
    value: 'OTHER',
  },
];
export default function GoodsReceivingIssue({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {lineItem, onUpdateIssue} = route.params || {};

  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    reason: null,
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

  function handleUpdateIssue() {
    const newItem = {
      ...lineItem,
      deliveryCheck: {
        status: 'TROUBLED',
        reason: values.reason?.value,
        comment: values.comment,
        requestTroubleQuantity: values.requestTroubleQuantity,
        photos: values.photos || [],
      },
    };

    onUpdateIssue(newItem);
    navigation.goBack();
  }

  function handleSelectPhoto(assets: any) {
    dispatch({photos: assets, render: true});
  }
  const {reason, requestTroubleQuantity, photos} = values;

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
            {reasonOptions.map((item: any) => (
              <TouchableOpacity
                onPress={() => dispatch({reason: item, render: true})}
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
            {reason?.id === 3 && (
              <FormGroup>
                <Label required>Enter the amount delivered </Label>
                <Input
                  placeholder="e.g. 1"
                  value={requestTroubleQuantity}
                  onChangeText={(text: string) =>
                    dispatch({requestTroubleQuantity: text, render: true})
                  }
                  inputType="amount"
                  decimalPlaces={2}
                />
              </FormGroup>
            )}
            {reason && (
              <FormGroup>
                <Label required>Leave a comment</Label>
                <Input
                  multiline={true}
                  numberOfLines={6}
                  placeholder={'e.g. Item not correct'}
                  textAlignVertical={'top'}
                  className="h-[100px]"
                  scrollEnabled={false}
                  onChangeText={text => dispatch({comment: text, render: true})}
                />
              </FormGroup>
            )}
            {reason && reason.id !== 1 && (
              <FormGroup>
                <Label required>Add photo</Label>
                <ImagePicker onChange={handleSelectPhoto}>
                  {({onPick, progress}) => (
                    <TouchableOpacity
                      onPress={onPick}
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
                      <Image
                        resizeMode="cover"
                        resizeMethod="scale"
                        className="w-40 h-40 overflow-hidden rounded-full"
                        key={image.uri}
                        source={{uri: image.uri}}
                      />
                    );
                  })}
                </View>
              </FormGroup>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Button disabled={!reason} onPress={handleUpdateIssue}>
        Confirm
      </Button>
    </Container>
  );
}
