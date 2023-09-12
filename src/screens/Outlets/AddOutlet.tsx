import {ScrollView, View, LogBox} from 'react-native';
import React, {useReducer, useState} from 'react';
import Container from 'components/Container';
import {SubTitle, Title} from 'components/Text';
import CheckBox from 'components/CheckBox';
import Button from 'components/Button';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import FormGroup from 'components/Form/FormGroup';
import Label from 'components/Form/Label';
import Input from 'components/Input';
import useMutation from 'libs/swr/useMutation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Toast from 'react-native-simple-toast';
import ImageUpload from 'components/ImageUpload';
import usePostalCode from 'hooks/usePostalCode';
import clsx from 'libs/clsx';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

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

  const {handlePostalCodeChange} = usePostalCode();

  function reducer(state: any, action: any) {
    const updatedValues = state;

    if (action.render) {
      setCurrentState(1 - currentState);
    }

    return {...updatedValues, ...action};
  }

  const {
    outletName,
    postalCode,
    billingAddress,
    unitNo,
    deliveryAddress,
    deliveryPostalCode,
    deliveryUnitNo,
    sameAsBillingAddress,
    photo,
    errors = {},
  } = values;

  function onChangeText(text: string, field: string) {
    dispatch({[field]: text, render: true});
  }
  function onChangeFields(fields: {[key: string]: string | boolean | object}) {
    dispatch({...fields, render: true});
  }

  function handleChangeUnitNo(text: string) {
    if (sameAsBillingAddress) {
      onChangeFields({unitNo: text, deliveryUnitNo: text});
    } else {
      onChangeFields({unitNo: text});
    }
  }

  async function handleChangePostalCode(text: string) {
    const address = await handlePostalCodeChange(text);
    let changeFields = {
      postalCode: text,
      billingAddress: address,
      errors: {
        ...errors,
        postalCode: !text,
        billingAddress: !address,
      },
    } as any;

    if (sameAsBillingAddress) {
      changeFields = {
        ...changeFields,
        deliveryPostalCode: text,
        deliveryAddress: address,
        errors: {
          ...errors,
          ...changeFields.errors,
          deliveryPostalCode: !text,
          deliveryAddress: !address,
        },
      };
    }
    onChangeFields(changeFields);
  }

  async function handleChangeDeliveryPostalCode(text: string) {
    const address = await handlePostalCodeChange(text);
    onChangeFields({
      deliveryPostalCode: text,
      deliveryAddress: address,
      errors: {
        ...errors,
        deliveryPostalCode: !text,
        deliveryAddress: !address,
      },
    });
  }

  function handleSetSameAsBillingAddress(value: boolean) {
    let changeFields = {
      sameAsBillingAddress: value,
    } as any;
    if (value) {
      changeFields = {
        ...changeFields,
        deliveryAddress: billingAddress,
        deliveryUnitNo: unitNo,
        deliveryPostalCode: postalCode,
      };
    }
    onChangeFields(changeFields);
  }

  function validateInputs(errors: {[key: string]: boolean}) {
    onChangeFields({errors});
    return Object.keys(errors).reduce((acc: boolean, key: string) => {
      if (errors[key]) {
        Toast.show('Please fill in all required fields', Toast.SHORT);
        return false;
      }
      return acc;
    }, true);
  }

  function handleChangePhoto(photo: any) {
    if (!photo || !Array.isArray(photo)) return;
    const {uri, signedKey} = photo[0] || {};
    onChangeFields({photo: {url: uri, signedKey}});
  }

  async function handleAddOutlet() {
    const validFields = validateInputs({
      ...errors,
      outletName: !outletName,
      postalCode: !postalCode,
      billingAddress: !billingAddress,
      deliveryPostalCode: !deliveryPostalCode,
      deliveryAddress: !deliveryAddress,
    });

    if (!validFields) return;

    const params = {
      name: outletName,
      postal: postalCode,
      billingPostal: postalCode,
      billingAddress: billingAddress,
      deliveryAddress: deliveryAddress,
      deliveryPostal: deliveryPostalCode,
      isSameBillingAddress: sameAsBillingAddress,
      unitNo: unitNo,
      deliveryUnitNo: deliveryUnitNo,
      photo: photo,
      mobileCode: 'none',
      mobileNumber: 'none',
    };

    const response = await addOutlet(params);
    const {success, message, errors} = response || {};
    if (success) {
      refreshOutlet?.();
      navigation.goBack();
    } else {
      Toast.show(message || errors?.name, Toast.LONG);
    }
  }

  return (
    <Container className="px-0">
      <KeyboardAvoidingView>
        <ScrollView className="flex-1 px-5">
          <Title>Add Outlets</Title>
          <SubTitle>This is what suppliers will see your outlet as.</SubTitle>

          <View className="items-center mb-8">
            <ImageUpload onChange={handleChangePhoto} />
          </View>
          <FormGroup>
            <Label required>Outlet Name</Label>
            <Input
              value={outletName}
              onChangeText={text =>
                onChangeFields({
                  outletName: text,
                  errors: {...errors, outletName: !text},
                })
              }
              className={clsx({
                'border-red-500': errors.outletName,
              })}
              placeholder="e.g. Ah Gao’s Cafe"
            />
          </FormGroup>
          <FormGroup>
            <Label required>Business Address</Label>
            <Input
              value={postalCode}
              onChangeText={handleChangePostalCode}
              placeholder="e.g. 645678"
              className={clsx({
                'mb-4': true,
                'border-red-500': errors.postalCode,
              })}
              keyboardType="numeric"
            />
            <Input
              value={billingAddress}
              placeholder="Billing Address"
              className={clsx({
                'mb-4': true,
                'border-red-500': errors.billingAddress,
              })}
              editable={false}
            />
            <Input
              value={unitNo}
              onChangeText={handleChangeUnitNo}
              placeholder="Unit Number"
            />
          </FormGroup>
          <FormGroup>
            <Label required>Delivery Address</Label>
            <CheckBox
              label="Same as billing address"
              containerClassName="my-4"
              defaultValue={sameAsBillingAddress}
              onChange={handleSetSameAsBillingAddress}
            />
            <Input
              value={deliveryPostalCode}
              onChangeText={text => handleChangeDeliveryPostalCode(text)}
              placeholder="e.g. 645678"
              className={clsx({
                'mb-4': true,
                'border-red-500': errors.deliveryPostalCode,
              })}
              keyboardType="numeric"
              editable={!sameAsBillingAddress}
            />
            <Input
              value={deliveryAddress}
              placeholder="Delivery Address"
              className={clsx({
                'mb-4': true,
                'border-red-500': errors.deliveryAddress,
              })}
              editable={false}
            />
            <Input
              value={deliveryUnitNo}
              onChangeText={text => onChangeText(text, 'deliveryUnitNo')}
              placeholder="Unit Number"
              editable={!sameAsBillingAddress}
            />
          </FormGroup>
        </ScrollView>
        <View className=" pt-4 px-5">
          <Button
            loading={loading}
            onPress={handleAddOutlet}
            className={clsx({
              'bg-gray-400 cursor-not-allowed': loading,
            })}>
            Create Outlet
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}
