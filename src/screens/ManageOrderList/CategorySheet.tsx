import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import Input from 'components/Input';
import Label from 'components/Form/Label';

export default function CategorySheet({
  isOpen,
  selectedEditCategory,
  onCancel,
  onRemove,
  onSave,
}: {
  isOpen?: boolean;
  selectedEditCategory?: any;
  onSave?: (values: any) => void;
  onRemove?: (category: string) => void;
  onCancel?: () => void;
}) {
  const [category, setCategory] = useState(selectedEditCategory);
  const bottomSheetRef = useRef<any>(null);
  const isEdit = !!selectedEditCategory;

  useEffect(() => {
    if (selectedEditCategory && selectedEditCategory !== category) {
      setCategory(selectedEditCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEditCategory]);

  function handleSave() {
    onSave?.(category);
    setCategory('');
  }

  function handleRemove() {
    bottomSheetRef.current.close();
    onRemove?.(selectedEditCategory);
  }
  return (
    <BottomSheet ref={bottomSheetRef} isOpen={isOpen} contentHeight={550}>
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
          {isEdit && (
            <View className="py-4 border-y border-gray-D1D5DB mt-4">
              <TouchableOpacity
                onPress={handleRemove}
                className="w-full flex-row justify-center">
                <Text className="text-primary">Remove Category</Text>
              </TouchableOpacity>
            </View>
          )}
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
