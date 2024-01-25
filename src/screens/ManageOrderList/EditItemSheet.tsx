import {View, Text} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import Input from 'components/Input';
import Label from 'components/Form/Label';
import Select from 'components/Select';
import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
export default function EditItemSheet({
  isOpen,
  onClose,
  selectedItem,
  categories,
  itemSlug,
  supplierId,
  onDeleteItem,
}: {
  isOpen?: boolean;
  selectedItem?: any;
  onClose: (refresh?: boolean) => void;
  categories?: any[];
  itemSlug: string;
  supplierId: string;
  onDeleteItem?: () => void;
}) {
  const initialItem = {productName: '', category: ''};
  const [item, setItem] = useState(initialItem);
  const bottomSheetRef = useRef<any>(null);

  const [{loading: updateItemLoading}, updateItem] = useMutation({
    method: 'PATCH',
    url: `update-item/${itemSlug}`,
  });

  useEffect(() => {
    if (selectedItem) {
      setItem({
        productName: selectedItem?.name,
        category: selectedItem?.category?.slug,
      });
    }
  }, [selectedItem]);

  const {productName, category} = item || {};

  const canUpdate = (() => {
    return (
      productName &&
      category &&
      (productName !== selectedItem?.name ||
        category !== selectedItem?.category?.slug)
    );
  })();

  async function handleSave() {
    if (canUpdate) {
      const params = {
        supplierId: supplierId,
        product: {
          name: productName,
          categorySlugs: [category],
        },
      };

      const response = await updateItem(params);
      const {success, error, message} = response;
      if (success) {
        onClose(true);
      } else {
        Toast.show(error?.message || message, Toast.LONG);
      }
    }
  }
  const categoriesOptions = (categories || [])
    .map(cat => ({
      label: cat.name,
      value: cat.slug,
    }))
    .filter(cat => cat.value !== 'uncategorized');

  return (
    <BottomSheet
      ref={bottomSheetRef}
      isOpen={isOpen}
      contentHeight={550}
      onClose={onClose}>
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
                defaultValue={productName}
                onChangeText={text =>
                  setItem({
                    ...item,
                    productName: text,
                  })
                }
              />
            </View>
            <View className="mt-4">
              <Label required>New Category</Label>

              <Select
                onChange={(newCat: any) => {
                  setItem({...item, category: newCat.value});
                  if (bottomSheetRef.current) {
                    bottomSheetRef.current.open();
                  }
                }}
                onOpen={() => bottomSheetRef.current?.close()}
                onBack={() => {
                  setTimeout(() => {
                    bottomSheetRef.current?.open();
                  }, 50);
                }}
                title={'Select Category'}
                value={{value: category}}
                options={categoriesOptions}
              />
            </View>
          </View>
        </View>

        <View>
          <Button variant="outline" onPress={onDeleteItem}>
            Delete Item
          </Button>
          <View className="flex-row mt-6">
            <Button
              variant="outline"
              onPress={() => onClose()}
              className="flex-1">
              Cancel
            </Button>
            <Button
              loading={updateItemLoading}
              onPress={handleSave}
              disabled={!canUpdate}
              className="flex-1 ml-2">
              Save
            </Button>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}
