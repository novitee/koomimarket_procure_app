import {View, Text, FlatList, ScrollView} from 'react-native';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import BottomSheet from 'components/BottomSheet';
import Button from 'components/Button';
import useMutation from 'libs/swr/useMutation';
import CheckBox from 'components/CheckBox';

function ProductItem({
  item,
  onSelect,
  selected,
}: {
  item?: any;
  onSelect: () => void;
  selected: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-400">
      <View className="flex-row items-center">
        <CheckBox onChange={onSelect} defaultValue={selected} />
        <Text className="font-bold">{item.name}</Text>
      </View>
    </View>
  );
}

export default function AddCategoryItemSheet({
  isOpen,
  onClose,
  items,
  selectedEditCategory,
}: {
  isOpen?: boolean;
  onClose: (refresh?: boolean) => void;
  items?: any[];
  selectedEditCategory: any;
}) {
  const bottomSheetRef = useRef<any>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [{loading: updateItemLoading}, updateItem] = useMutation({
    method: 'PATCH',
    url: `update-item`,
  });

  const params = {
    product: {
      categorySlugs: [selectedEditCategory?.slug],
    },
  };
  const cantUpdate = selectedItems.length > 0;

  async function handleSave() {
    if (cantUpdate) {
      await Promise.all(
        selectedItems.map(async (item: any) => {
          const response = await updateItem(params, {
            overrides: {
              url: `update-item/${item?.slug}`,
            },
          });
        }),
      );
    }
    onClose(true);
  }

  const handleSelect = useCallback(
    (item: any) => {
      setSelectedItems(prev => {
        if (prev.includes(item)) {
          return prev.filter(i => i !== item);
        } else {
          return [...prev, item];
        }
      });
    },
    [setSelectedItems],
  );

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <ProductItem
          onSelect={() => handleSelect(item)}
          item={item}
          selected={selectedItems.includes(item)}
        />
      );
    },
    [handleSelect, selectedItems],
  );
  return (
    <BottomSheet ref={bottomSheetRef} isOpen={isOpen} contentHeight={550}>
      <View className="pb-10 px-5 pt-5 flex-1">
        <View className="flex-1">
          <View className="border-b border-gray-300 pb-5">
            <Text className="text-primary font-semibold text-xl text-center">
              Add Item
            </Text>
          </View>
          <View className="mt-5">
            <FlatList
              className="mt-3"
              keyExtractor={(item, index) => item?.id + index}
              renderItem={_renderItem}
              data={items}
              extraData={items}
              ListEmptyComponent={() => (
                <View className="flex-1 justify-center items-center">
                  <Text className="font-bold mt-4 text-center">
                    No items yet
                  </Text>
                </View>
              )}
            />
          </View>
        </View>

        <View className="flex-row">
          <Button
            variant="outline"
            onPress={() => onClose()}
            className="flex-1">
            Cancel
          </Button>
          <Button
            disabled={!cantUpdate}
            loading={updateItemLoading}
            onPress={handleSave}
            className="flex-1 ml-2">
            Save
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}
