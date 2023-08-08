import React, {useReducer, useState} from 'react';
import Container from 'components/Container';
import Text from 'components/Text';
import Label from 'components/Form/Label';
import {ScrollView, View} from 'react-native';
import Button from 'components/Button';
import FormGroup from 'components/Form/FormGroup';
import Input from 'components/Input';
import DateInput from 'components/DateInput';
import dayjs from 'dayjs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const dummyData = [
  {id: 1, name: 'Carrot', price: 0.99, unit: 'KG', quantity: 1},
  {id: 2, name: 'Tomato', price: 1.49, unit: 'KG', quantity: 1},
  {id: 3, name: 'Broccoli', price: 1.99, unit: 'KG', quantity: 2},
  {id: 4, name: 'Spinach', price: 0.89, unit: 'KG', quantity: 2},
];
export default function FinalizeOrderScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const supplierName = 'Vegetable Farm';

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

  const {requestedDeliveryDate, comment} = values;

  function handleOrder() {
    navigation.navigate('DoneOrder', {
      requestedDeliveryDate,
      productsOrdered: dummyData.length,
    });
  }

  return (
    <Container>
      <Text className="text-30 font-bold text-primary">
        Purchase Order With
      </Text>
      <View className="bg-primary p-2.5 mt-3">
        <Text className="text-white text-30 font-bold">{supplierName}</Text>
      </View>
      <View className="h-10  mt-2">
        {requestedDeliveryDate && (
          <Text className="text-30 font-bold uppercase">
            <Text className="text-primary lowercase text-30 font-bold">
              for
            </Text>{' '}
            {dayjs(requestedDeliveryDate).format('dddd')}
          </Text>
        )}
      </View>

      <ScrollView
        className="flex-1 mt-2"
        contentContainerStyle={{paddingBottom: 40}}>
        <FormGroup>
          <Label required>Requested Delivery Date</Label>
          <DateInput
            onChange={date =>
              dispatch({requestedDeliveryDate: date, render: true})
            }
          />
        </FormGroup>
        <FormGroup>
          <Label required>Comment</Label>
          <Input
            multiline={true}
            numberOfLines={10}
            placeholder={'e.g. Call me when reach'}
            textAlignVertical={'top'}
            className="h-[100px]"
            scrollEnabled={false}
            onChangeText={text => dispatch({comment: text, render: true})}
          />
        </FormGroup>

        <Text className="text-20 text-primary font-bold mt-5">
          Order Summary
        </Text>
        {dummyData.map((item: any, index: number) => (
          <View
            className="flex-row items-center py-6 border-b border-gray-400"
            key={index}>
            <Text className="text-30 font-bold w-16 text-center">
              {item.quantity}
            </Text>
            <View className="flex-1">
              <Text className="font-bold">{item.name}</Text>
              <Text className="font-light mt-2">{item.unit}</Text>
            </View>
          </View>
        ))}
        <Text className="mt-6 font-bold">Estimated Order Total:</Text>
        <Text className="text-sm font-light mt-2">
          All prices to all products to see the estimated order total
        </Text>
      </ScrollView>

      <Button
        onPress={handleOrder}
        disabled={!requestedDeliveryDate || !comment}>
        Tap to Order
      </Button>
    </Container>
  );
}
