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
import useQuery from 'libs/swr/useQuery';
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

function useQueryCartItems({supplierId}: {supplierId: string}) {
  const url = supplierId ? 'get-cart-items' : undefined;
  const params = {
    first: 20,
    skip: 0,
    orderBy: {
      createdAt: 'desc',
    },
    filter: {supplierId},
    fields: 'id,name,slug',
  };
  return useQuery([url, params]);
}

export default function ManageOrderListScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const [currentState, setCurrentState] = useState(0);

  const {supplierId} = route?.params || {};

  const {data: categoryData, mutate: refreshCategories} = useQuery([
    'filter-categories',
    {supplierId},
  ]);
  const categories = categoryData?.records || [];

  const [values, dispatch] = useReducer(reducer, {
    render: false,
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
  const {showSheet, selectedEditItem, selectedEditCategory} = values;

  const {data: productData, isValidating: loadingProduct} = useQueryCartItems({
    supplierId,
  });

  const products = productData?.records || [];
  const productSections = categories.map((category: any) => ({
    category: {name: category.name, slug: category.slug},
    data: products.filter(
      (product: any) => product?.category?.slug === category.slug,
    ),
  }));

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
    ({
      section: {
        category: {name, slug},
      },
    }: {
      section: any;
    }) => {
      return (
        <View className="flex-row justify-between items-center bg-gray-200 px-2.5 py-3">
          <Text className="text-xl font-semibold">{name}</Text>
          {name !== 'Uncategorized' && (
            <TouchableOpacity
              onPress={() => handleEditCategory(slug)}
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

  function closeSheet(refresh = false) {
    if (refresh) {
      refreshCategories();
    }
    dispatch({showSheet: null, render: true});
  }

  return (
    <>
      <Container className="px-0">
        <View>
          <ScrollView horizontal className="p-5">
            {categories.map((category: any) => (
              <Button
                key={category?.id}
                size="md"
                fullWidth={false}
                className="mr-4"
                variant="outline">
                {category?.name}
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
        onClose={closeSheet}
      />
      <EditItemSheet
        categories={categories}
        isOpen={!!selectedEditItem}
        selectedItem={selectedEditItem}
        onClose={() =>
          dispatch({
            selectedEditItem: null,
            selectedEditCategory: '',
            render: true,
          })
        }
        itemSlug={selectedEditItem?.slug}
        supplierId={supplierId}
        // onSave={handleSaveEditItem}
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
