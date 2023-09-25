import {ScrollView, View, LogBox, Image} from 'react-native';
import React, {useReducer, useState} from 'react';
import {SubTitle} from 'components/Text';
import Button from 'components/Button';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import FormGroup from 'components/Form/FormGroup';
import Label from 'components/Form/Label';
import Input from 'components/Input';
import Toast from 'react-native-simple-toast';
import ImageUpload from 'components/ImageUpload';
import usePostalCode from 'hooks/usePostalCode';
import clsx from 'libs/clsx';
import Avatar from 'components/Avatar';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function BusinessForm({
  onSave,
  loading,
  editMode,
  initialValues,
}: {
  onSave?: (params: any) => void;
  loading?: boolean;
  editMode?: boolean;
  initialValues: any;
}) {
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    companyName: initialValues.companyName,
    billingAddress: initialValues.billingAddress,
    billingPostal: initialValues.postalCode,
    unitNo: initialValues.unitNo,
    photo: initialValues.photo,
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
    companyName,
    billingPostal,
    billingAddress,
    unitNo,
    photo,
    errors = {},
  } = values;

  function onChangeFields(fields: {[key: string]: string | boolean | object}) {
    dispatch({...fields, render: true});
  }

  function handleChangeUnitNo(text: string) {
    onChangeFields({unitNo: text});
  }

  async function handleChangePostalCode(text: string) {
    const address = await handlePostalCodeChange(text);
    let changeFields = {
      billingPostal: text,
      billingAddress: address,
      errors: {
        ...errors,
        billingPostal: !text,
        billingAddress: !address,
      },
    } as any;

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

  async function handleSubmit() {
    const validFields = validateInputs({
      ...values.errors,
      companyName: !companyName,
      billingPostal: !billingPostal,
      billingAddress: !billingAddress,
    });

    if (!validFields) {
      return;
    }

    const params = {
      name: companyName,
      postal: billingPostal,
      billingPostal: billingPostal,
      billingAddress: billingAddress,
      unitNo: unitNo,
      photo: photo,
      mobileCode: 'none',
      mobileNumber: 'none',
    };

    onSave?.(params);
  }

  return (
    <KeyboardAvoidingView>
      <ScrollView className="flex-1 px-5">
        {!editMode && (
          <SubTitle>This is what suppliers will see your outlet as.</SubTitle>
        )}
        <View className="items-center  mb-8">
          <ImageUpload
            icon={
              editMode ? (
                photo?.url ? (
                  <Image
                    resizeMode="cover"
                    resizeMethod="scale"
                    className="w-full h-full overflow-hidden rounded-full"
                    source={{uri: photo.url}}
                  />
                ) : (
                  <Avatar name={companyName} size={162} />
                )
              ) : null
            }
            onChange={handleChangePhoto}
            editable={editMode}
          />
        </View>
        <FormGroup>
          <Label required>Business Name</Label>
          <Input
            value={companyName}
            onChangeText={text =>
              onChangeFields({
                companyName: text,
                errors: {...errors, companyName: !text},
              })
            }
            className={clsx({
              'border-red-500': errors.companyName,
            })}
            placeholder="e.g. Ah Gao’s Cafe"
          />
        </FormGroup>
        <FormGroup>
          <Label required>Business Address</Label>
          <Input
            value={billingPostal}
            onChangeText={handleChangePostalCode}
            placeholder="e.g. 645678"
            className={clsx({
              'mb-4': true,
              'border-red-500': errors.billingPostal,
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
      </ScrollView>
      <View className=" pt-4 px-5">
        <Button loading={loading} onPress={handleSubmit}>
          {editMode ? 'Update Business' : 'Create Business'}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
