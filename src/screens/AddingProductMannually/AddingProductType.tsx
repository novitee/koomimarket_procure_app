import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Container from 'components/Container';
import Camera from 'assets/images/big-camera.svg';
import Pencil from 'assets/images/big-pen.svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

// const options = [];
export default function AddingProductTypeScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  return (
    <Container>
      <Text>Choose a way to add products to your order list:</Text>
      <View className="justify-center flex-1">
        <TouchableOpacity
          onPress={() => navigation.navigate('UploadInvoice')}
          className="border-[3px] border-gray-D1D5DB rounded-xl flex-row items-center min-h-[160px] px-5">
          <View className="mr-5">
            <Camera />
          </View>
          <View className="flex-1">
            <Text className="font-bold mb-4">
              Upload a past invoice or stock- take sheet
            </Text>
            <Text className="font-medium">
              We’ll add your products for you in less than 24 hours.
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddProductsManuallyForm')}
          className="border-[3px] border-gray-D1D5DB rounded-xl flex-row items-center mt-4 min-h-[160px] px-5">
          <View className="mr-5">
            <Pencil />
          </View>
          <View className="flex-1">
            <Text className="font-bold mb-4">Manually add products</Text>
            <Text className="font-medium">
              Add product by typing in its name and unit.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Container>
  );
}
