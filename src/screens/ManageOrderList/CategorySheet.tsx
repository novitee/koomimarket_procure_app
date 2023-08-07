import {View, Text} from 'react-native';
import React, {useState} from 'react';
import BottomSheet from 'components/ButtomSheet';
import Button from 'components/Button';
import Input from 'components/Input';
import Label from 'components/Form/Label';

export default function CategorySheet({
  isOpen,
  selectedEditCategory,
  onCancel,
  onSave,
}: {
  isOpen?: boolean;
  selectedEditCategory?: any;
  onSave?: (values: any) => void;
  onCancel?: () => void;
}) {
  const [category, setCategory] = useState(selectedEditCategory || '');

  const isEdit = !!selectedEditCategory;

  function handleSave() {
    onSave?.(category);
    setCategory('');
  }
  return (
    <BottomSheet isOpen={isOpen} contentHeight={550}>
      <View className="pb-10 px-5 pt-5 flex-1">
        <View className="flex-1">
          <View className="border-b border-gray-300 pb-5">
            <Text className="text-primary font-semibold text-xl text-center">
              {`${isEdit ? 'Edit Category' : 'Add New Category'}`}
            </Text>
          </View>
          <View className="flex-row justify-between mt-5">
            <View className="flex-1">
              <Label required> Category Name</Label>
              <Input
                defaultValue={category}
                onChangeText={text => setCategory(text)}
              />
            </View>
          </View>
        </View>

        <View className="flex-row">
          <Button variant="outline" onPress={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button
            disabled={!category}
            onPress={handleSave}
            className="flex-1 ml-2">
            Save
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}
