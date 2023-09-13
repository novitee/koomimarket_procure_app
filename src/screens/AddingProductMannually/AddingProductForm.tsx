import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
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
import Loading from 'components/Loading';
import useQuery from 'libs/swr/useQuery';
import useMutation from 'libs/swr/useMutation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AddingCategory from './AddingCategory';
const SGD = () => (
  <View className="h-full items-center justify-center pl-3">
    <Text>SGD</Text>
  </View>
);

function OptionItem({
  onSelect,
  name,
  isSelected,
}: {
  onSelect?: (selected?: any) => void;
  name?: string;
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
        {name}
      </Text>
    </TouchableOpacity>
  );
}
export default function AddingProductFormScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    openNewCategory: false,
    price: '',
    images: [],
  });

  const {data: cartItems, isLoading: isLoadingCartItems} = useQuery([
    `cart-items/${'chicken'}`,
    {
      include: 'categories(name,slug)',
    },
  ]);

  const {
    data: dataUOM,
    mutate: refreshUOMList,
    isLoading: isLoadingUOMList,
  } = useQuery('uom-list');
  refreshUOMList();
  const unitOfMeasures = dataUOM?.records || [];
  const {
    data: dataCategories,
    mutate: refreshCategoryList,
    isLoading: isLoadingCategories,
  } = useQuery('categories');
  const categories = dataCategories?.records || [];

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
    unitOfMeasure,
    productId,
    category,
    openNewCategory,
    price,
    images,
  } = values;

  const handleChange = useCallback((key: string, item: any) => {
    dispatch({[key]: item, render: true});
  }, []);

  function handleCloseAddingCategory() {
    dispatch({
      openNewCategory: false,
      render: true,
    });
  }
  function handleCreatedCategory(categorySlug: string) {
    refreshCategoryList();
    handleChange('category', categorySlug);
  }

  // async function handleSave() {
  //   const handleSaveFunc = mode !== "Edit" ? createItem : updateItem
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
  //       data: { data, success, error },
  //     } = await handleSaveFunc({
  //       ...params,
  //     })
  //     if (success) {
  //       router.push("/new-order/" + supplierId)
  //     } else {
  //       displayMessage({
  //         type: "error",
  //         title: "Notification",
  //         message: convertErrorMessage(error),
  //       })
  //     }
  //     return
  //   }
  // }

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
                placeholder="e.g. Chicken"
              />
            </FormGroup>
            <FormGroup>
              <Label required>Unit</Label>
              <View style={styles.gap10} className="w-full flex-row flex-wrap ">
                {unitOfMeasures.map((item: any, index: any) => (
                  <OptionItem
                    key={index}
                    isSelected={unitOfMeasure === item}
                    onSelect={() => handleChange('unit', item)}
                    name={item.unit}
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
                    isSelected={category === item?.slug}
                    onSelect={() => handleChange('category', item?.slug)}
                    name={item?.name}
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
                onChange={(assets: any) =>
                  handleChange('images', [...images, ...assets])
                }>
                {({onPick, progress = 0}) => (
                  <TouchableOpacity
                    onPress={onPick}
                    className="border rounded border-gray-D1D5DB flex-row items-center justify-center py-3">
                    {progress > 0 && progress < 100 ? (
                      <ActivityIndicator
                        size={'large'}
                        color={colors.primary.DEFAULT}
                      />
                    ) : (
                      <>
                        <AddIcon color={colors.gray.D1D5DB} />
                        <Text className={'text-gray-D1D5DB ml-2'}>
                          Upload Image
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </ImagePicker>
              <View className="flex-row w-full flex-wrap pt-3 gap-4">
                {images.map((image: any) => {
                  return (
                    <Image
                      key={image.uri}
                      source={{uri: image.uri}}
                      resizeMode="cover"
                      resizeMethod="scale"
                      className="w-32 h-32 rounded-lg"
                    />
                  );
                })}
              </View>
            </FormGroup>
          </ScrollView>
          <View className="px-5">
            <Button>Add Products</Button>
          </View>
        </KeyboardAvoidingView>
      </Container>
      <AddingCategory
        isOpen={!!openNewCategory}
        onClose={handleCloseAddingCategory}
        onSuccess={handleCreatedCategory}
      />
    </>
  );
}

const styles = StyleSheet.create({
  gap10: {
    gap: 10,
  },
});
