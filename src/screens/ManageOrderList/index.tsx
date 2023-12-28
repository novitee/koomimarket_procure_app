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
import AddCategoryItemSheet from './AddCategoryItemSheet';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BackButton} from 'navigations/common';
import TrashIcon from 'assets/images/trash.svg';
import colors from 'configs/colors';
import RemoveItemSheet from './RemoveItemSheet';
import useQuery from 'libs/swr/useQuery';
import Loading from 'components/Loading';

const REMOVE_ITEMS = 'REMOVE_ITEMS';
const SAVE_CATEGORY = 'SAVE_CATEGORY';
const REMOVE_CATEGORY = 'REMOVE_CATEGORY';
const ADD_CATEGORY_ITEM = 'ADD_CATEGORY_ITEM';

function ProductItem({
  item,
  onEdit,
}: {
  item?: any;
  onEdit?: () => void;
  selected: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between p-4 border-b border-gray-400">
      <View className="flex-row items-center">
        <Text className="font-bold">{item.name}</Text>
      </View>
      <TouchableOpacity className="p-2" onPress={onEdit}>
        <EditIcon color={colors.dark} />
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
  const {supplierId} = route?.params || {};

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    mutate: refreshCategories,
  } = useQuery(['categories', {supplierId}]);
  const categories = categoryData?.records || [];
  const [values, dispatch] = useReducer(reducer, {
    selectedIds: [],
    showSheet: null,
    selectedEditItem: null,
    selectedEditCategory: null,
  });

  function reducer(state: any, action: any) {
    return {...state, ...action};
  }
  const {showSheet, selectedEditItem, selectedEditCategory} = values;

  const {
    data: productData,
    isLoading,
    mutate: refreshCartItems,
  } = useQueryCartItems({
    supplierId,
  });

  const products = productData?.records || [];

  const productSections = categories
    .map((category: any) => ({
      category: {name: category.name, id: category.id, slug: category.slug},
      data: products.filter(
        (product: any) => product?.category?._id === category.id,
      ),
    }))
    .filter((section: any) => {
      return !(
        section.category.slug === 'uncategorized' && section.data.length === 0
      );
    });

  const handleEdit = useCallback((item: any) => {
    dispatch({
      selectedEditItem: item,
    });
  }, []);

  const handleEditCategory = useCallback((item: any) => {
    dispatch({
      selectedEditCategory: item,
      showSheet: SAVE_CATEGORY,
    });
  }, []);

  const handleAddCategoryItem = useCallback((category: any) => {
    dispatch({
      selectedEditCategory: category,
      showSheet: ADD_CATEGORY_ITEM,
    });
  }, []);

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <ProductItem
          onEdit={() => handleEdit(item)}
          item={item}
          selected={values.selectedIds.includes(item.id)}
        />
      );
    },
    [handleEdit, values.selectedIds],
  );

  const _renderSectionHeader = useCallback(
    ({section}: {section: any}) => {
      const {
        category: {name},
      } = section || {};
      return (
        <View className="flex-row justify-between items-center bg-gray-200 px-2.5 py-3">
          <Text className="text-xl font-semibold">{name}</Text>
          {name !== 'Uncategorized' && (
            <TouchableOpacity
              onPress={() => handleEditCategory(section.category)}
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

  const _renderSectionFooter = useCallback(
    ({section}: {section: any}) => {
      if (section.data.length === 0) {
        return (
          <TouchableOpacity
            onPress={() => handleAddCategoryItem(section.category)}
            className="px-5"
            hitSlop={10}>
            <View className="flex-row justify-center items-center bg-white px-4 py-6 border-b border-gray-400">
              <Text className="font-normal text-gray-400">Add items here</Text>
            </View>
          </TouchableOpacity>
        );
      }
      return null;
    },
    [handleAddCategoryItem],
  );

  function closeSheet(refresh = false) {
    if (refresh) {
      refreshCategories();
      refreshCartItems();
    }
    dispatch({
      showSheet: null,
    });
  }

  function handleCloseEditItemSheet(refresh = false) {
    if (refresh) {
      refreshCartItems();
    }
    dispatch({
      selectedEditItem: null,
      selectedEditCategory: null,
    });
  }
  return (
    <>
      <Container className="px-0">
        <View>
          <ScrollView horizontal className="p-5">
            {categories.map((category: any, index: any) => {
              if (
                productSections.find(
                  (section: any) =>
                    section.category.id === category.id &&
                    section.data.length > 0,
                )
              ) {
                return (
                  <Button
                    key={index}
                    size="md"
                    fullWidth={false}
                    className="mr-4"
                    variant="outline">
                    {category?.name}
                  </Button>
                );
              } else {
                return null;
              }
            })}
            <Button
              size="md"
              fullWidth={false}
              variant="outline"
              onPress={() =>
                dispatch({
                  showSheet: SAVE_CATEGORY,
                  selectedEditCategory: null,
                })
              }
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
          keyExtractor={(item, index) => item?.id + index}
          renderItem={_renderItem}
          renderSectionHeader={_renderSectionHeader}
          renderSectionFooter={_renderSectionFooter}
        />
        {(isLoading || isCategoryLoading) && <Loading />}
      </Container>
      <CategorySheet
        isOpen={showSheet === SAVE_CATEGORY}
        selectedEditCategory={selectedEditCategory}
        onClose={closeSheet}
        handleRemoveCategory={() => dispatch({showSheet: REMOVE_CATEGORY})}
      />
      <EditItemSheet
        categories={categories}
        isOpen={!!selectedEditItem}
        selectedItem={selectedEditItem}
        onClose={handleCloseEditItemSheet}
        itemSlug={selectedEditItem?.slug}
        supplierId={supplierId}
        onDeleteItem={() => {
          const deletedItem = selectedEditItem;
          dispatch({
            selectedEditItem: null,
          });

          setTimeout(() => {
            dispatch({
              showSheet: REMOVE_ITEMS,
              selectedIds: [deletedItem?.id],
            });
          }, 300);
        }}
      />
      <RemoveCategorySheet
        isOpen={showSheet === REMOVE_CATEGORY}
        onCancel={(refresh?: boolean) => closeSheet(refresh)}
        selectedEditCategory={selectedEditCategory}
      />
      <RemoveItemSheet
        isOpen={showSheet === REMOVE_ITEMS}
        onCancel={(refresh?: boolean) => {
          dispatch({selectedIds: []});
          closeSheet(refresh);
          navigation.setOptions({
            // eslint-disable-next-line react/no-unstable-nested-components
            headerLeft: () => (
              <BackButton canGoBack goBack={navigation.goBack} />
            ),
          });
        }}
        selectedItemIds={values.selectedIds}
      />
      <AddCategoryItemSheet
        isOpen={showSheet === ADD_CATEGORY_ITEM}
        onClose={(refresh?: boolean) => closeSheet(refresh)}
        items={products.filter(
          (product: any) => product?.category?.slug === 'uncategorized',
        )}
        selectedEditCategory={selectedEditCategory}
      />
    </>
  );
}
