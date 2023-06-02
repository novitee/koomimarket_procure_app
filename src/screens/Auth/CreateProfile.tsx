import {View, Text} from 'react-native';
import React, {useReducer, useState} from 'react';
import Container from 'components/Container';
import {Title} from 'components/Text';
import Label from 'components/Form/Label';
import FormGroup from 'components/Form/FormGroup';
import Input from 'components/Input';
import Button from 'components/Button';

export default function CreateProfile() {
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
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

  const {fullName, emailAddress} = values;

  function onChangeText(text: string, field: string) {
    dispatch({[field]: text, render: true});
  }
  return (
    <Container>
      <View className="flex-1">
        <Title>Let’s create your profile</Title>
        <Text className="font-light mt-2 mb-6">
          Your profile is how you’ll be recognised by others on Koomi.
        </Text>

        <FormGroup>
          <Label required>Full name</Label>
          <Input
            value={fullName}
            onChangeText={text => onChangeText(text, 'fullName')}
          />
        </FormGroup>
        <FormGroup>
          <Label required>Email Address</Label>
          <Input
            value={emailAddress}
            inputMode="email"
            onChangeText={text => onChangeText(text, 'emailAddress')}
          />
        </FormGroup>
      </View>

      <Button>Next</Button>
    </Container>
  );
}
