import {View, Text} from 'react-native';
import React, {useReducer, useState} from 'react';
import Container from 'components/Container';
import {Title} from 'components/Text';
import Label from 'components/Form/Label';
import FormGroup from 'components/Form/FormGroup';
import Input from 'components/Input';
import Button from 'components/Button';

export default function JoinMyTeamScreen() {
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

  const {businessName, deliveryAddress} = values;

  function onChangeText(text: string, field: string) {
    dispatch({[field]: text, render: true});
  }
  return (
    <Container>
      <View className="flex-1">
        <Title>Where do you work?</Title>
        <Text className="font-light mt-2 mb-6">
          This information will help us connect you with your team.
        </Text>

        <FormGroup>
          <Label required>Business Name</Label>
          <Input
            value={businessName}
            onChangeText={text => onChangeText(text, 'businessName')}
            placeholder="e.g. Ah Gao’s Cafe"
          />
        </FormGroup>
        <FormGroup>
          <Label required>Delivery Address</Label>
          <Input
            value={deliveryAddress}
            inputMode="email"
            onChangeText={text => onChangeText(text, 'deliveryAddress')}
            placeholder="e.g. 13 Istana Road #01-10"
          />
        </FormGroup>
      </View>

      <Button>Join Team</Button>
    </Container>
  );
}
