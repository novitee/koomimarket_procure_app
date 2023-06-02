import {Text, ScrollView} from 'react-native';
import React, {useReducer, useState} from 'react';
import Container from 'components/Container';
import {Title} from 'components/Text';
import Label from 'components/Form/Label';
import FormGroup from 'components/Form/FormGroup';
import Input from 'components/Input';
import Button from 'components/Button';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';

export default function GetInTouchScreen() {
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

  const {name, companyName, position, email, howYouHear} = values;

  function onChangeText(text: string, field: string) {
    dispatch({[field]: text, render: true});
  }

  function handleSubmit() {
    console.log(`values :>>`, values);
  }
  return (
    <Container>
      <KeyboardAvoidingView>
        <ScrollView className="flex-1">
          <Title>Get in touch</Title>
          <Text className="font-light mt-2 mb-6">
            Suppliers have much more complexed processes - so we would love to
            get to know you better. Leave your details via the form below and
            we’ll follow up as soon as we can.
          </Text>

          <FormGroup>
            <Label required>Name</Label>
            <Input
              value={name}
              onChangeText={text => onChangeText(text, 'fullName')}
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
              value={howYouHear}
              onChangeText={text => onChangeText(text, 'howYouHear')}
              placeholder="I heard about it from a friend!"
            />
          </FormGroup>
        </ScrollView>
      </KeyboardAvoidingView>

      <Button onPress={handleSubmit}>Submit</Button>
    </Container>
  );
}
