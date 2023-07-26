import {View, Text, TouchableOpacity} from 'react-native';
import React, {useReducer, useState} from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import AddIcon from 'assets/images/plus.svg';
import colors from 'configs/colors';

export default function UploadInvoiceScreen() {
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    files: [],
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

  const {files} = values;
  return (
    <Container>
      <View className="flex-1">
        <TouchableOpacity className="border border-primary border-dashed rounded items-center justify-center py-10">
          <View className="w-8 h-8 items-center justify-center rounded-full border-[3px] border-primary">
            <AddIcon color={colors.primary.DEFAULT} strokeWidth="3" />
          </View>
          <Text className="text-primary mt-7">
            Add invoice or stock-take sheet
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="font-bold text-primary text-center mb-3">
        after send invoice, admin will receive email
      </Text>
      <Button>Send</Button>
    </Container>
  );
}
