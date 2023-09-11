import {
  View,
  Text,
  ScrollView,
  SectionList,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback, useReducer, useState} from 'react';
import Container from 'components/Container';
import Button from 'components/Button';
import CategorySheet from './CategorySheet';
import {PRODUCTS} from 'configs/data';
import EditIcon from 'assets/images/edit.svg';
import CheckBox from 'components/CheckBox';
import {toggleValueInArray} from 'utils/common';
import EditItemSheet from './EditItemSheet';
import RemoveCategorySheet from './RemoveCategorySheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BackButton} from 'navigations/common';
import TrashIcon from 'assets/images/trash.svg';
import colors from 'configs/colors';
import RemoveItemSheet from './RemoveItemSheet';
const REMOVE_ITEMS = 'REMOVE_ITEMS';
const SAVE_CATEGORY = 'SAVE_CATEGORY';
const REMOVE_CATEGORY = 'REMOVE_CATEGORY';

function ProductItem({
  item,
  onEdit,
  onSelect,
}: {
  item?: any;
  onEdit?: () => void;
  onSelect: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-400">
      <View className="flex-row items-center">
        <CheckBox onChange={onSelect} />
        <Text className="font-bold">{item.name}</Text>
      </View>
      <TouchableOpacity className="p-2" onPress={onEdit}>
        <EditIcon />
      </TouchableOpacity>
    </View>
  );
}

export default function ManageOrderListScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    productSections: [
      {
        category: 'Uncategorized',
        data: PRODUCTS,
      },
    ],
    selectedIds: [],
    showSheet: null,
    selectedEditItem: null,
    selectedEditCategory: '',
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
  const {showSheet, selectedEditItem, selectedEditCategory, productSections} =
    values;

  const handleEdit = useCallback((item: any) => {
    dispatch({
      selectedEditItem: item,
      render: true,
    });
  }, []);

  const handleEditCategory = useCallback((item: any) => {
    dispatch({
      selectedEditCategory: item,
      showSheet: SAVE_CATEGORY,
      render: true,
    });
  }, []);

  const handleSelect = useCallback(
    (item: any) => {
      const newSelectedIds = toggleValueInArray(item.id, values.selectedIds);
      navigation.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerLeft: () =>
          newSelectedIds.length > 0 ? (
            <TouchableOpacity
              className="items-center justify-center px-3"
              onPress={() => dispatch({showSheet: REMOVE_ITEMS, render: true})}>
              <TrashIcon color={colors.primary.DEFAULT} />
            </TouchableOpacity>
          ) : (
            <BackButton canGoBack goBack={navigation.goBack} />
          ),
      });

      dispatch({
        selectedIds: newSelectedIds,
        render: true,
      });
    },
    [navigation, values.selectedIds],
  );

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <ProductItem
          onEdit={() => handleEdit(item)}
          onSelect={() => handleSelect(item)}
          item={item}
        />
      );
    },
    [handleEdit, handleSelect],
  );

  const _renderSectionHeader = useCallback(
    ({section: {category}}: {section: any}) => {
      return (
        <View className="flex-row justify-between items-center bg-gray-200 px-2.5 py-3">
          <Text className="text-xl font-semibold">{category}</Text>
          {category !== 'Uncategorized' && (
            <TouchableOpacity
              onPress={() => handleEditCategory(category)}
              className="px-5"
              hitSlop={10}>
              <Text className="text-primary">Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    },
    [handleEditCategory],
  );

  const _renderSectionFooter = useCallback(({section}: {section: any}) => {
    if (section.data.length === 0) {
      return (
        <View className="flex-row justify-center items-center bg-white px-4 py-6 border-b border-gray-400">
          <Text className="font-normal text-gray-400">Add items here</Text>
        </View>
      );
    }
    return null;
  }, []);

  function handleSaveCategory(newCategory: string) {
    if (values.selectedEditCategory) {
      const index = values.productSections.findIndex(
        (item: any) => values.selectedEditCategory === item.category,
      );
      const clonedProductSections = [...values.productSections];
      if (index > -1) {
        clonedProductSections[index].category = newCategory;
      }
      dispatch({
        productSections: clonedProductSections,
        showSheet: null,
        selectedEditCategory: '',
        render: true,
      });
    } else {
      dispatch({
        productSections: [
          ...productSections,
          {
            category: newCategory,
            data: [],
          },
        ],
        showSheet: null,
        selectedEditCategory: '',
        render: true,
      });
    }
  }

  function handleSaveEditItem(item: any) {
    const clonedProductSections = [...values.productSections];
    const index = values.productSections.findIndex(
      (section: any) => section.category === item.category,
    );

    if (index !== -1) {
      clonedProductSections[index].data.push(item);
      clonedProductSections[0].data = clonedProductSections[0].data.filter(
        (p: any) => p.id !== item.id,
      );
    }
    dispatch({
      selectedEditItem: null,
      productSections: clonedProductSections,
      render: true,
    });
  }

  function handleRemoveCategory() {
    const index = values.productSections.findIndex(
      (section: any) => section.category === values.selectedEditCategory,
    );

    if (index !== -1) {
      const clonedProductSections = [...values.productSections];
      clonedProductSections[0].data = [
        ...clonedProductSections[0].data,
        ...clonedProductSections[index].data,
      ];
      clonedProductSections.splice(index, 1);
      dispatch({
        selectedEditCategory: '',
        productSections: clonedProductSections,
        showSheet: null,
        render: true,
      });
    }
  }

  function handleRemoveItems() {
    console.log(`values.selectedIds :>>`, values.selectedIds);
  }

  function closeSheet() {
    dispatch({showSheet: null, render: true});
  }

  const categories = productSections.map((i: any) => i.category);

  return (
    <>
      <Container className="px-0">
        <View>
          <ScrollView horizontal className="p-5">
            {categories.map((cat: string) => (
              <Button
                key={cat}
                size="md"
                fullWidth={false}
                className="mr-4"
                variant="outline">
                {cat}
              </Button>
            ))}
            <Button
              size="md"
              fullWidth={false}
              variant="outline"
              onPress={() => dispatch({showSheet: SAVE_CATEGORY, render: true})}
              className="mr-4 border-gray-400">
              <Text className="text-gray-400 font-semibold">
                Add New Category
              </Text>
            </Button>
          </ScrollView>
        </View>

        <SectionList
          className="flex-1"
          sections={productSections}
          keyExtractor={(item, index) => item + index}
          renderItem={_renderItem}
          renderSectionHeader={_renderSectionHeader}
          renderSectionFooter={_renderSectionFooter}
        />
      </Container>
      <CategorySheet
        isOpen={showSheet === SAVE_CATEGORY}
        selectedEditCategory={selectedEditCategory}
        onCancel={closeSheet}
        onSave={handleSaveCategory}
        onRemove={item => {
          dispatch({
            selectedEditCategory: item,
            showSheet: REMOVE_CATEGORY,
            render: true,
          });
        }}
      />
      <EditItemSheet
        categories={categories}
        isOpen={!!selectedEditItem}
        selectedItem={selectedEditItem}
        onCancel={() =>
          dispatch({
            selectedEditItem: null,
            selectedEditCategory: '',
            render: true,
          })
        }
        onSave={handleSaveEditItem}
      />
      <RemoveCategorySheet
        isOpen={showSheet === REMOVE_CATEGORY}
        onCancel={closeSheet}
        onConfirm={handleRemoveCategory}
      />
      <RemoveItemSheet
        isOpen={showSheet === REMOVE_ITEMS}
        onCancel={closeSheet}
        onConfirm={handleRemoveItems}
      />
    </>
  );
}
