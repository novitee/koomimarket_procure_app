import {
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useReducer} from 'react';
import Container from 'components/Container';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import Button from 'components/Button';
import FormGroup from 'components/Form/FormGroup';
import Label from 'components/Form/Label';
import Input from 'components/Input';
import clsx from 'libs/clsx';
import AddIcon from 'assets/images/plus-circle.svg';
import colors from 'configs/colors';
import ImagePicker from 'components/ImagePicker';
import useQuery from 'libs/swr/useQuery';
import useMutation from 'libs/swr/useMutation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AddingCategory from './AddingCategory';
import AddingUOM from './AddingUOM';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import CloseCircleIcon from 'assets/images/check_no_active.svg';

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
  const [values, dispatch] = useReducer(reducer, {
    render: false,
    openNewCategory: false,
    openNewUOM: false,
    price: 0,
    images: [],
  });
  const {supplierId} = route.params || {};

  const {data: dataUOM, mutate: refreshUOMList} = useQuery('uom-list');
  const {data: dataCategories, mutate: refreshCategoryList} =
    useQuery('categories');
  const unitOfMeasures = dataUOM?.records || [];
  const categories = dataCategories?.records || [];

  const [{loading: creating}, createProduct] = useMutation({
    url: 'create-item-manually',
  });

  const isFocused = useIsFocused();
  useFocusEffect(
    React.useCallback(() => {
      if (isFocused) {
        refreshUOMList();
        refreshCategoryList();
      }
    }, [isFocused]),
  );

  function reducer(state: any, action: any) {
    let updatedValues = state;

    updatedValues = {
      ...updatedValues,
      ...action,
    };

    updatedValues.errors = {
      ...updatedValues.errors,
      price: !updatedValues.price,
      productName: !updatedValues.productName,
    };

    return updatedValues;
  }
  const {
    productName,
    unitOfMeasure,
    productId,
    category,
    openNewCategory,
    openNewUOM,
    price,
    images,
    errors = {},
  } = values;

  const handleChange = useCallback((key: string, item: any) => {
    dispatch({[key]: item});
  }, []);

  const handleToggleAddingCategory = useCallback((openNewCategory: boolean) => {
    dispatch({openNewCategory});
  }, []);

  const handleToggleAddingUOM = useCallback((openNewUOM: boolean) => {
    dispatch({openNewUOM});
  }, []);

  const handleCreatedCategory = useCallback(
    (categorySlug: string) => {
      refreshCategoryList();
      handleChange('category', categorySlug);
    },
    [handleChange, refreshCategoryList],
  );

  const handleCreatedUOM = useCallback(
    (unitOfMeasure: string) => {
      refreshUOMList();
      handleChange('unitOfMeasure', unitOfMeasure);
    },
    [handleChange, refreshUOMList],
  );
  async function handleSave() {
    if (!productName || !unitOfMeasure || !price || !category) {
      Toast.show('Please fill in all required fields', Toast.LONG);
      return;
    }

    const imagesInput = images.map((img: any) => ({
      ...img,
      url: img.uri,
      filename: img.fileName,
      contentType: img.type,
    }));

    const params = {
      supplierId: supplierId,
      product: {
        sku: productId,
        name: productName,
        categorySlugs: [category].filter(Boolean),
        pricing: price,
        uom: unitOfMeasure,
        photos: imagesInput,
      },
    };
    const response = await createProduct(params);
    const {data, success, error} = response;

    if (success) {
      navigation.navigate('NewOrder', {
        supplierId,
      });
    } else {
      Toast.show(error.message, Toast.LONG);
    }
  }

  function removeImage(uri: string) {
    dispatch({
      images: images.filter((i: any) => i.uri !== uri),
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
                autoCapitalize="words"
                value={productName}
                onChangeText={(text: string) =>
                  handleChange('productName', text)
                }
                placeholder="e.g. Chicken"
                className={clsx({
                  'border-red-500': errors.productName,
                })}
              />
            </FormGroup>
            <FormGroup>
              <Label required>Unit</Label>
              <View style={styles.gap10} className="w-full flex-row flex-wrap ">
                {unitOfMeasures.map((item: any, index: any) => (
                  <OptionItem
                    key={index}
                    isSelected={unitOfMeasure === item?.unit}
                    onSelect={() => handleChange('unitOfMeasure', item?.unit)}
                    name={item.unit}
                  />
                ))}
                <TouchableOpacity
                  className={clsx({
                    'h-9 px-4 flex-row items-center rounded border border-gray-D1D5DB':
                      true,
                  })}
                  onPress={() => handleToggleAddingUOM(true)}>
                  <AddIcon color={colors.gray.D1D5DB} />
                  <Text className={'text-gray-D1D5DB ml-2'}>New UOM</Text>
                </TouchableOpacity>
              </View>
            </FormGroup>
            <FormGroup>
              <Label>Product ID</Label>
              <Input
                value={productId}
                onChangeText={(text: string) => handleChange('productId', text)}
                placeholder="e.g. 12345"
              />
            </FormGroup>
            <FormGroup>
              <Label>Price</Label>

              <Input
                StartComponent={SGD}
                value={price?.toString()}
                onChangeText={(text: string) => handleChange('price', text)}
                placeholder="e.g. 12345"
                keyboardType="numeric"
                className={clsx({
                  'border-red-500': errors.price,
                })}
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
                  onPress={() => handleToggleAddingCategory(true)}>
                  <AddIcon color={colors.gray.D1D5DB} />
                  <Text className={'text-gray-D1D5DB ml-2'}>New Category</Text>
                </TouchableOpacity>
              </View>
            </FormGroup>
            <FormGroup>
              <Label>Image</Label>
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
                    <View key={image.uri}>
                      <Image
                        source={{uri: image.uri}}
                        resizeMode="cover"
                        resizeMethod="scale"
                        className="w-32 h-32 rounded-lg bg-slate-200"
                      />
                      <TouchableOpacity
                        className="absolute -right-2 -top-2 z-50 bg-white rounded-full"
                        onPress={() => removeImage(image.uri)}>
                        <CloseCircleIcon width={24} height={24} />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </FormGroup>
          </ScrollView>
          <View className="px-5">
            <Button loading={creating} onPress={handleSave}>
              Add Products
            </Button>
          </View>
        </KeyboardAvoidingView>
      </Container>
      <AddingCategory
        isOpen={!!openNewCategory}
        onClose={() => handleToggleAddingCategory(false)}
        onSuccess={handleCreatedCategory}
      />
      <AddingUOM
        isOpen={!!openNewUOM}
        onClose={() => handleToggleAddingUOM(false)}
        onSuccess={handleCreatedUOM}
      />
    </>
  );
}

const styles = StyleSheet.create({
  gap10: {
    gap: 10,
  },
});
