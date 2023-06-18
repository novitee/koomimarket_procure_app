import {Image, ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useReducer, useState} from 'react';
import Container from 'components/Container';
import Text, {SubTitle, Title} from 'components/Text';

import {LogBox} from 'react-native';
import Button from 'components/Button';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import FormGroup from 'components/Form/FormGroup';
import Label from 'components/Form/Label';
import Input from 'components/Input';
import HomeIcon from 'assets/images/home.svg';
import CameraIcon from 'assets/images/camera.svg';
import ImagePicker from 'components/ImagePicker';
import useMutation from 'libs/swr/useMutation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Toast from 'react-native-simple-toast';
import {styled} from 'nativewind';
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const ErrorText = styled(Text, 'text-error mt-3');

export default function AddOutletScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {params} = route || {};
  const {refreshOutlet} = params || {};
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
  });

  const [{loading, error}, addOutlet] = useMutation({
    url: 'me/outlets/add',
  });

  function reducer(state: any, action: any) {
    const updatedValues = state;

    if ('outletName' in action) {
      updatedValues.outletName = action.outletName;
    }

    if ('deliveryAddress' in action) {
      updatedValues.deliveryAddress = action.deliveryAddress;
    }

    if (action.render) {
      setCurrentState(1 - currentState);
    }

    return updatedValues;
  }

  const {outletName, deliveryAddress} = values;
  function onChangeText(text: string, field: string) {
    dispatch({[field]: text, render: true});
  }

  function handleSelectImage(value) {
    console.log(`value :>>`, value);
  }

  async function handleAddOutlet() {
    const {success, message} = await addOutlet({
      name: values.outletName,
      deliveryAddress: values.deliveryAddress,
      billingPostal: '787878',
      billingAddress: 'HTLE SSSSSS',
      billingUnitNo: '1112',
      postal: '757575',
      unitNo: '8893',
      mobileCode: '65',
      mobileNumber: '12345678',
      isSameBillingAddress: false,
    });

    if (success) {
      refreshOutlet?.();
      navigation.goBack();
    } else {
      Toast.show(message, Toast.LONG);
    }
  }

  const {errors} = error || {};

  return (
    <Container>
      <KeyboardAvoidingView>
        <ScrollView className="flex-1">
          <Title>Add Outlets</Title>
          <SubTitle>This is what suppliers will see your outlet as.</SubTitle>

          <View className="items-center mb-8">
            <ImagePicker onChange={handleSelectImage}>
              {({onPick, selectedUri, progress}) => (
                <View className="w-[164px] h-[164px] rounded-full bg-gray-E0E0E4 items-center justify-center ">
                  {selectedUri ? (
                    <Image
                      resizeMode="cover"
                      resizeMethod="scale"
                      className="w-full h-full overflow-hidden rounded-full"
                      source={{uri: selectedUri[0]}}
                    />
                  ) : (
                    <HomeIcon />
                  )}
                  {!!progress && progress > 0 && progress < 100 && (
                    <View className="absolute w-full h-full rounded-full overflow-hidden items-center justify-center">
                      <Text className="text-white font-medium">{`Uploading ${progress}%`}</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={onPick}
                    className="w-12 h-12 rounded-full items-center justify-center bg-primary absolute -bottom-2 right-3 z-20">
                    <CameraIcon color="#ffffff" />
                  </TouchableOpacity>
                </View>
              )}
            </ImagePicker>
          </View>
          <FormGroup>
            <Label required>Outlet Name</Label>
            <Input
              value={outletName}
              onChangeText={text => onChangeText(text, 'fullName')}
              placeholder="e.g. Ah Gao’s Cafe"
            />
          </FormGroup>
          <FormGroup>
            <Label required>Delivery Address</Label>
            <Input
              value={deliveryAddress}
              onChangeText={text => onChangeText(text, 'deliveryAddress')}
              placeholder="e.g. 13 Istana Road #01-10"
            />
            {errors?.deliveryAddress && (
              <ErrorText>Delivery Address {errors?.deliveryAddress}</ErrorText>
            )}
          </FormGroup>
        </ScrollView>
      </KeyboardAvoidingView>
      <Button loading={loading} onPress={handleAddOutlet}>
        Create Outlet
      </Button>
    </Container>
  );
}
