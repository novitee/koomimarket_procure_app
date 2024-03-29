import {Text, View} from 'react-native';
import React, {useState} from 'react';
import Button from 'components/Button';
import FormGroup from 'components/Form/FormGroup';
import Label from 'components/Form/Label';
import Input from 'components/Input';
import BottomSheet from 'components/BottomSheet';
import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (unitOfMeasureSlug: string) => void;
}
export default function AddingUOM({isOpen, onClose, onSuccess}: Props) {
  const [newUOM, setNewUOM] = useState('');

  const [{loading}, createUOM] = useMutation({
    url: 'uom-list',
  });

  async function handleSubmit() {
    const {data, success, error, message} = await createUOM({
      itemUom: {unit: newUOM},
    });
    if (success) {
      onSuccess(data?.itemUom?.unit);
      setNewUOM('');
      onClose();
    } else {
      Toast.show(error.message || message, Toast.LONG);
    }
  }

  return (
    <BottomSheet isOpen={isOpen} contentHeight={550}>
      <View className="pb-10 px-5 pt-5 flex-1">
        <View className="flex-1">
          <View className="border-b border-gray-300 pb-10">
            <Text className="text-primary font-semibold text-xl text-center">
              Add New UOM
            </Text>
          </View>
          <View className="flex-row justify-between mt-10">
            <FormGroup>
              <Label required>New UOM</Label>
              <Input defaultValue={newUOM} onChangeText={setNewUOM} />
            </FormGroup>
          </View>
        </View>

        <View className="flex-row">
          <Button variant="outline" onPress={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onPress={handleSubmit}
            className="flex-1 ml-2"
            loading={loading}>
            Save
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}
