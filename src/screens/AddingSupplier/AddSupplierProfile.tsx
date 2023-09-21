import {View, Text, TouchableOpacity, Linking} from 'react-native';
import React, {useEffect} from 'react';
import Container from 'components/Container';
import OrderFoodIcon from 'assets/images/order-food.svg';
import TeamBuildingIcon from 'assets/images/team-building.svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SUPPLIER_DASHBOARD_URL} from 'configs/index';
import {SubTitle, Title} from 'components/Text';

const types = [
  {
    icon: <OrderFoodIcon />,
    code: 'my_own',
    label: 'I have my own supplier',
    description: 'I want to set up my own supplier listing.',
  },
  {
    icon: <TeamBuildingIcon />,
    code: 'explore',
    label: 'Explore Koomi suppliers',
    description:
      'I do not have any existing supplier and want to explore Koomi suppliers.',
  },
];

export default function AddSupplierProfileScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const {navigate} = navigation;

  function navigateTo(code: string) {
    if (code === 'my_own') {
      navigate('AddSupplierName');
    } else if (code === 'explore') {
      navigate('SupplierList');
    }
  }

  return (
    <Container>
      <Title>Add Supplier Profile</Title>
      <SubTitle>
        Create the supplier profile before start ordering. The setup only take 2
        minutes. Setup only once, and reorder make easy.
      </SubTitle>
      <View className="mt-6">
        {types.map(item => {
          return (
            <TouchableOpacity
              key={item.label}
              onPress={() => navigateTo(item.code)}
              className="border-[4px] border-gray-D1D5DB rounded-xl mt-8 p-5">
              <View className="flex-row justify-center items-center">
                {item.icon}
                <View className="flex-1 ml-4">
                  <Text className="font-bold">{item.label}</Text>
                  <Text className="font-medium text-gray-900 mt-2">
                    {item.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Container>
  );
}
