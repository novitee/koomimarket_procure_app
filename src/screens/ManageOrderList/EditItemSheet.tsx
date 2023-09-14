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
  onSave,
  selectedItem,
  categories,
  itemSlug,
  supplierId,
}: {
  isOpen?: boolean;
  selectedItem?: any;
  onSave?: (values: any) => void;
  onClose: () => void;
  categories?: any[];
  itemSlug: string;
  supplierId: string;
}) {
  const [item, setItem] = useState(selectedItem);
  const bottomSheetRef = useRef<any>(null);

  const [{loading: updateItemLoading}, updateItem] = useMutation({
    method: 'PATCH',
    url: `/api/v1/procure-storefront/update-item/${itemSlug}`,
  });

  useEffect(() => {
    if (!item && selectedItem) {
      setItem(selectedItem);
    }
  }, [item, selectedItem]);

  // async function handleSave() {
  //   // const handleSaveFunc = mode !== "Edit" ? createItem : updateItem
  //   //create new item
  //   if (isEmptyErrors(errors)) {
  //     const imagesInput = images.map((img) => {
  //       return {
  //         url: img.imageUrl,
  //         width: img.imageWidth,
  //         height: img.imageHeight,
  //         filename: img.filename,
  //         contentType: img.contentType,
  //         signedKey: img.signedKey,
  //       }
  //     })
  //     const params = {
  //       supplierId: supplierId,
  //       product: {
  //         sku: productId,
  //         name: productName,
  //         categorySlugs: category ? [category] : [],
  //         pricing: Number(unitPrice) || 0,
  //         uom: uom,
  //         photos: imagesInput,
  //       },
  //     }

  //     const {
  //       data: { data, success, error, message },
  //     } = await updateItem(params)
  //     if (success) {
  //       onClose()
  //     } else {
  //       Toast.show(error?.message || message, Toast.LONG)
  //     }
  //   }
  // }

  function handleSave() {
    onSave?.(item);
  }

  const categoriesOptions = (categories || []).map(cat => ({
    value: cat,
    label: cat,
  }));

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
          <Button variant="outline" onPress={onClose} className="flex-1">
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
