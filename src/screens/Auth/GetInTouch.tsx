import {ScrollView, View} from 'react-native';
import React, {useReducer, useState} from 'react';
import Container from 'components/Container';
import {SubTitle, Title} from 'components/Text';
import Label from 'components/Form/Label';
import FormGroup from 'components/Form/FormGroup';
import Input from 'components/Input';
import Button from 'components/Button';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import clsx from 'libs/clsx';
import {validateEmail} from 'utils/validate';

const updateSignUpProfileUrl: string = 'registrations/update-sign-up-profile';

export default function GetInTouchScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
  });
  const [{loading}, updateSignUpProfile] = useMutation({
    method: 'PATCH',
    url: updateSignUpProfileUrl,
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

  const {name, companyName, position, email, howYouHeard, errors} = values;

  function onChangeText(text: string, field: string) {
    dispatch({[field]: text, render: true});
  }

  function onChangeFields(fields: {[key: string]: string | boolean | object}) {
    dispatch({...fields, render: true});
  }

  function validateInputs(errors: {[key: string]: boolean}) {
    onChangeFields({errors});
    return Object.keys(errors).reduce((acc: boolean, key: string) => {
      if (errors['email'] && !validateEmail(email)) {
        Toast.show('Please enter a valid email address', Toast.LONG);
        return false;
      }
      if (errors[key]) {
        Toast.show('Please fill in all required fields', Toast.SHORT);
        return false;
      }
      return acc;
    }, true);
  }

  async function handleUpdateProfile() {
    const validFields = validateInputs({
      ...errors,
      name: !name,
      companyName: !companyName,
      email: !email || !validateEmail(email),
      howYouHeard: !howYouHeard,
    });

    if (!validFields) return;

    const {success, data, error, message} = await updateSignUpProfile({
      entityRegistration: {
        entityType: {
          code: 'SUPPLIER',
        },
        registrationInfo: {
          company: {
            name: companyName,
            email: email,
          },
        },
        user: {
          fullName: name,
          email: email,
          jobPosition: position,
          howYouHeard: howYouHeard,
        },
      },
    });
    if (success) {
      navigation.navigate('SupplierThankYou');
    } else {
      Toast.show(message, Toast.LONG);
    }
  }

  return (
    <Container className="px-0">
      <KeyboardAvoidingView>
        <ScrollView className="flex-1 px-5">
          <Title>Get in touch</Title>
          <SubTitle>
            Suppliers have much more complexed processes - so we would love to
            get to know you better. Leave your details via the form below and
            we’ll follow up as soon as we can.
          </SubTitle>

          <FormGroup>
            <Label required>Name</Label>
            <Input
              value={name}
              onChangeText={text => onChangeText(text, 'name')}
              placeholder="Tan Ah Gao"
            />
          </FormGroup>
          <FormGroup>
            <Label required>Company Name</Label>
            <Input
              value={companyName}
              onChangeText={text => onChangeText(text, 'companyName')}
              placeholder="The company you work for"
            />
          </FormGroup>
          <FormGroup>
            <Label>Position</Label>
            <Input
              value={position}
              onChangeText={text => onChangeText(text, 'position')}
              placeholder="The company you work for"
            />
          </FormGroup>
          <FormGroup>
            <Label required>Email</Label>
            <Input
              value={email}
              inputMode="email"
              onChangeText={text => onChangeText(text, 'email')}
              placeholder="tanahgao@business.com"
            />
          </FormGroup>
          <FormGroup>
            <Label required>How did you hear about Koomi?</Label>
            <Input
              value={howYouHeard}
              onChangeText={text => onChangeText(text, 'howYouHeard')}
              placeholder="I heard about it from a friend!"
            />
          </FormGroup>
        </ScrollView>
        <View className="pt-4 px-5">
          <Button
            onPress={handleUpdateProfile}
            loading={loading}
            className={clsx({
              'bg-gray-400 cursor-not-allowed': loading,
            })}>
            Submit
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
}
