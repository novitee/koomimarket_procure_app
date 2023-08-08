import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from 'react-native';
import React, {useCallback, useReducer, useState} from 'react';
import Container from 'components/Container';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import Button from 'components/Button';
import FormGroup from 'components/Form/FormGroup';
import Label from 'components/Form/Label';
import Input from 'components/Input';
import clsx from 'libs/clsx';
import AddIcon from 'assets/images/plus-circle.svg';
import colors from 'configs/colors';
import BottomSheet from 'components/BottomSheet';
import ImagePicker from 'components/ImagePicker';

const units = [
  'Piece(s)',
  'Kilo(s)',
  'Packet(s)',
  'Bottle(s)',
  'Carton(s)',
  'Other',
];

const DEFAULT_CATEGORIES = ['Meat', 'Vegetables'];

const SGD = () => (
  <View className="h-full items-center justify-center pl-3">
    <Text>SGD</Text>
  </View>
);

function OptionItem({
  onSelect,
  item,
  isSelected,
}: {
  onSelect?: (selected?: any) => void;
  item?: any;
  isSelected?: boolean;
}) {
  return (
    <TouchableOpacity
      className={clsx({
        'h-9 px-4 flex-row items-center rounded': true,
        'bg-primary': !!isSelected,
        'border border-gray-D1D5DB': !isSelected,
      })}
      onPress={onSelect}>
      <Text
        className={clsx({
          '': true,
          'text-white': !!isSelected,
          'text-gray-D1D5DB': !isSelected,
        })}>
        {item}
      </Text>
    </TouchableOpacity>
  );
}
export default function AddingProductFormScreen() {
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    openNewCategory: false,
    categories: DEFAULT_CATEGORIES,
    newCategory: '',
    price: '',
    images: [],
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
    productName,
    unit,
    productId,
    category,
    categories,
    openNewCategory,
    newCategory,
    price,
    images,
  } = values;

  const handleChange = useCallback((key: string, item: any) => {
    dispatch({[key]: item, render: true});
  }, []);

  function handleAddNewCategory() {
    dispatch({
      openNewCategory: false,
      categories: [...values.categories, values.newCategory],
      render: true,
    });
  }
  return (
    <>
      <Container className="px-0">
        <KeyboardAvoidingView>
          <ScrollView className="flex-1 px-5">
            <FormGroup>
              <Label required>Product Name</Label>
              <Input
                value={productName}
                onChangeText={(text: string) =>
                  handleChange('productName', text)
                }
                placeholder="e.g. Ah Gao’s Cafe"
              />
            </FormGroup>
            <FormGroup>
              <Label required>Unit</Label>
              <View style={styles.gap10} className="w-full flex-row flex-wrap ">
                {units.map((item, index) => (
                  <OptionItem
                    key={index}
                    isSelected={unit === item}
                    onSelect={() => handleChange('unit', item)}
                    item={item}
                  />
                ))}
              </View>
            </FormGroup>
            <FormGroup>
              <Label required>Product ID</Label>
              <Input
                value={productId}
                onChangeText={(text: string) => handleChange('productId', text)}
                placeholder="e.g. 12345"
              />
            </FormGroup>
            <FormGroup>
              <Label required>Price</Label>

              <Input
                StartComponent={SGD}
                value={price}
                onChangeText={(text: string) => handleChange('price', text)}
                placeholder="e.g. 12345"
                keyboardType="numeric"
              />
            </FormGroup>
            <FormGroup>
              <Label required>My Categories</Label>
              <View style={styles.gap10} className="w-full flex-row flex-wrap ">
                {categories.map((item: any, index: any) => (
                  <OptionItem
                    key={index}
                    isSelected={category === item}
                    onSelect={() => handleChange('category', item)}
                    item={item}
                  />
                ))}
                <TouchableOpacity
                  className={clsx({
                    'h-9 px-4 flex-row items-center rounded border border-gray-D1D5DB':
                      true,
                  })}
                  onPress={() =>
                    dispatch({openNewCategory: true, render: true})
                  }>
                  <AddIcon color={colors.gray.D1D5DB} />
                  <Text className={'text-gray-D1D5DB ml-2'}>New Category</Text>
                </TouchableOpacity>
              </View>
            </FormGroup>
            <FormGroup>
              <Label required>Image</Label>
              <ImagePicker
                onChange={(assets: any) => handleChange('images', assets)}>
                {({onPick}) => (
                  <TouchableOpacity
                    onPress={onPick}
                    className="border rounded border-gray-D1D5DB flex-row items-center justify-center py-3">
                    <AddIcon color={colors.gray.D1D5DB} />
                    <Text className={'text-gray-D1D5DB ml-2'}>
                      New Category
                    </Text>
                  </TouchableOpacity>
                )}
              </ImagePicker>
              <View className="flex-row w-full flex-wrap">
                {images.map((image: any) => {
                  return <Image key={image.uri} source={{uri: image.uri}} />;
                })}
              </View>
            </FormGroup>
          </ScrollView>
          <View className="px-5">
            <Button>Add Products</Button>
          </View>
        </KeyboardAvoidingView>
      </Container>
      <BottomSheet isOpen={!!openNewCategory} contentHeight={400}>
        <View className="pb-10 px-5 pt-5 flex-1">
          <View className="flex-1">
            <View className="border-b border-gray-300 pb-10">
              <Text className="text-primary font-semibold text-xl text-center">
                Add New Category
              </Text>
            </View>
            <View className="flex-row justify-between mt-10">
              <FormGroup>
                <Label required>New Category</Label>
                <Input
                  defaultValue={newCategory}
                  onChangeText={text =>
                    dispatch({
                      newCategory: text,
                      render: true,
                    })
                  }
                />
              </FormGroup>
            </View>
          </View>

          <View className="flex-row">
            <Button
              variant="outline"
              onPress={() =>
                dispatch({
                  selectedItem: {},
                  render: true,
                })
              }
              className="flex-1">
              Cancel
            </Button>
            <Button onPress={handleAddNewCategory} className="flex-1 ml-2">
              Save
            </Button>
          </View>
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  gap10: {
    gap: 10,
  },
});
