import {View, Text} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import BottomSheet from 'components/ButtomSheet';
import Button from 'components/Button';
import Input from 'components/Input';
import Label from 'components/Form/Label';
import Select from 'components/Select';

export default function EditItemSheet({
  isOpen,
  onCancel,
  onSave,
  selectedItem,
  categories,
}: {
  isOpen?: boolean;
  selectedItem?: any;
  onSave?: (values: any) => void;
  onCancel?: () => void;
  categories?: any[];
}) {
  const [item, setItem] = useState(selectedItem);
  const bottomSheetRef = useRef<any>(null);

  function handleSave() {
    onSave?.(item);
  }
  useEffect(() => {
    if (!item && selectedItem) {
      setItem(selectedItem);
    }
  }, [item, selectedItem]);

  const categoriesOptions = (categories || []).map(cat => ({
    value: cat,
    label: cat,
  }));

  console.log(`item :>>`, item);

  return (
    <BottomSheet ref={bottomSheetRef} isOpen={isOpen} contentHeight={550}>
      <View className="pb-10 px-5 pt-5 flex-1">
        <View className="flex-1">
          <View className="border-b border-gray-300 pb-5">
            <Text className="text-primary font-semibold text-xl text-center">
              Edit Item
            </Text>
          </View>
          <View className="mt-5">
            <View>
              <Label required>Product Name</Label>
              <Input
                defaultValue={item?.name}
                onChangeText={text =>
                  setItem({
                    ...item,
                    name: text,
                  })
                }
              />
            </View>
            <View className="mt-4">
              <Label required>New Category</Label>

              <Select
                onChange={(newCat: any) => {
                  setItem({
                    ...item,
                    category: newCat.value,
                  });
                  if (bottomSheetRef.current) {
                    bottomSheetRef.current.open();
                  }
                }}
                onOpen={() => bottomSheetRef.current?.close()}
                onBack={() => bottomSheetRef.current?.open()}
                title={'Select Category'}
                value={{value: item?.category}}
                options={categoriesOptions}
              />
            </View>
          </View>
        </View>

        <View className="flex-row">
          <Button variant="outline" onPress={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onPress={handleSave} className="flex-1 ml-2">
            Save
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}
