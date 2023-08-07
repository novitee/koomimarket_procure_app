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
import useNavigation from 'hooks/useNavigation';

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

export default function ManageOrderListScreen() {
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
    openAddCategorySheet: false,
    selectedEditItem: null,
    selectedEditCategory: false,
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
  const {
    openAddCategorySheet,
    selectedEditItem,
    selectedEditCategory,
    productSections,
  } = values;

  const handleEdit = useCallback((item: any) => {
    dispatch({
      selectedEditItem: item,
      render: true,
    });
  }, []);

  const handleEditCategory = useCallback((item: any) => {
    dispatch({
      selectedEditCategory: item,
      openAddCategorySheet: true,
      render: true,
    });
  }, []);

  const handleSelect = useCallback(
    (item: any) => {
      dispatch({
        selectedIds: toggleValueInArray(item.id, values.selectedIds),
        render: true,
      });
    },
    [values.selectedIds],
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

  function handleAddCategory(newCategory: string) {
    dispatch({
      productSections: [
        ...productSections,
        {
          category: newCategory,
          data: [],
        },
      ],
      openAddCategorySheet: false,
      render: true,
    });
  }

  function handleSaveEditItem(item: any) {
    dispatch({
      selectedEditItem: null,
      render: true,
    });
    console.log(`item :>>`, item);
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
              onPress={() =>
                dispatch({openAddCategorySheet: true, render: true})
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
          keyExtractor={(item, index) => item + index}
          renderItem={_renderItem}
          renderSectionHeader={_renderSectionHeader}
          renderSectionFooter={_renderSectionFooter}
        />
      </Container>
      <CategorySheet
        isOpen={openAddCategorySheet}
        selectedEditCategory={selectedEditCategory}
        onCancel={() => dispatch({openAddCategorySheet: false, render: true})}
        onSave={handleAddCategory}
      />
      <EditItemSheet
        categories={categories}
        isOpen={!!selectedEditItem}
        selectedItem={selectedEditItem}
        onCancel={() => dispatch({selectedEditItem: null, render: true})}
        onSave={handleSaveEditItem}
      />
    </>
  );
}
