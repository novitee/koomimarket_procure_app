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
  handleRemoveCategory,
}: {
  isOpen?: boolean;
  selectedEditCategory?: any;
  onClose: (refresh?: boolean) => void;
  handleRemoveCategory: () => void;
}) {
  const [category, setCategory] = useState(selectedEditCategory);
  const bottomSheetRef = useRef<any>(null);
  const isEdit = !!selectedEditCategory;
  const [{loading}, createCategory] = useMutation({url: 'categories'});
  const [{loading: updateLoading}, updateCategory] = useMutation({
    url: `categories/${selectedEditCategory?.id}`,
    method: 'PATCH',
  });

  useEffect(() => {
    if (selectedEditCategory?.name !== category) {
      setCategory(selectedEditCategory?.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEditCategory]);

  async function handleSubmit() {
    const mutation = isEdit ? updateCategory : createCategory;
    const response = await mutation({category: {name: category}});
    const {data, success, error, message} = response;
    if (success) {
      setCategory(null);
      onClose(true);
    } else {
      Toast.show(error.message || message, Toast.LONG);
    }
  }

  function handleRemove() {
    bottomSheetRef.current.close();
    handleRemoveCategory();
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
