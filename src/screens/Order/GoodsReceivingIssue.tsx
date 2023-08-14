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

const issueOptions = [
  {
    id: 1,
    name: 'Missing',
  },
  {
    id: 2,
    name: 'Spoil',
  },
  {
    id: 3,
    name: 'Wrong Amount',
  },
  {
    id: 4,
    name: 'Other',
  },
];
export default function GoodsReceivingIssue({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {product, onUpdateIssue} = route.params || {};

  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    issue: null,
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
      ...product,
      issue: values.issue,
      comment: values.comment,
      amountDelivered: values.amountDelivered,
      photos: values.photos,
    };

    onUpdateIssue(newItem);
    navigation.goBack();
  }

  function handleSelectPhoto(assets: any) {
    dispatch({photos: assets, render: true});
  }
  const {issue, amountDelivered, photos} = values;

  return (
    <Container>
      <View className="flex-row items-center py-6  bg-gray-EEF3FD">
        <Text className="text-30 font-bold w-16 text-center">
          {product.quantity}
        </Text>
        <View className="flex-1">
          <Text className="font-bold">{product.name}</Text>
          <Text className="font-light mt-2">{product.unit}</Text>
        </View>
      </View>
      <KeyboardAvoidingView>
        <ScrollView className="flex-1 mt-5">
          <View className="border border-gray-D1D5DB divide-y divide-gray-D1D5DB">
            {issueOptions.map((item: any) => (
              <TouchableOpacity
                onPress={() => dispatch({issue: item, render: true})}
                key={item.id}
                className="flex-row items-center justify-between px-3 py-6">
                <Text>{item.name}</Text>
                <View
                  className={clsx({
                    'w-6 h-6 rounded-full items-center justify-center': true,
                    'bg-primary': item.id === issue?.id,
                    'border border-gray-D1D5DB': item.id !== issue?.id,
                  })}>
                  <View className="w-2.5 h-2.5 rounded-full bg-white" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View className="mt-5">
            {issue?.id === 3 && (
              <FormGroup>
                <Label required>Enter the amount delivered </Label>
                <Input
                  value={amountDelivered}
                  onChangeText={(text: string) =>
                    dispatch({amountDelivered: text, render: true})
                  }
                />
              </FormGroup>
            )}
            {issue && (
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
            {issue && issue.id !== 1 && (
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
      <Button disabled={!issue} onPress={handleUpdateIssue}>
        Confirm
      </Button>
    </Container>
  );
}
