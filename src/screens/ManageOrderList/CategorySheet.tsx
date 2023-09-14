import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import Input from 'components/Input';
import Label from 'components/Form/Label';
import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
export default function CategorySheet({
  isOpen,
  selectedEditCategory,
  onClose,
}: {
  isOpen?: boolean;
  selectedEditCategory?: any;
  onClose: (refresh?: boolean) => void;
}) {
  const [category, setCategory] = useState(selectedEditCategory);
  const bottomSheetRef = useRef<any>(null);
  const isEdit = !!selectedEditCategory;

  const [{loading}, createCategory] = useMutation({url: 'categories'});
  const [{loading: removeLoading}, removeCategory] = useMutation({
    url: 'categories',
    method: 'DELETE',
  });

  async function handleSubmit() {
    const {data, success, error, message} = await createCategory({
      category: {name: category},
    });
    if (success) {
      setCategory('');
      onClose(true);
    } else {
      Toast.show(error.message || message, Toast.LONG);
    }
  }

  useEffect(() => {
    if (selectedEditCategory && selectedEditCategory !== category) {
      setCategory(selectedEditCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEditCategory]);

  function handleRemove() {
    bottomSheetRef.current.close();
    const {data, success, error, message} = removeCategory({
      category: {name: selectedEditCategory},
    });
    if (success) {
      onClose(true);
    } else {
      Toast.show(error.message || message, Toast.LONG);
    }
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
          <Button
            variant="outline"
            onPress={() => onClose()}
            className="flex-1">
            Cancel
          </Button>
          <Button
            disabled={!category}
            onPress={handleSubmit}
            className="flex-1 ml-2">
            Save
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}
