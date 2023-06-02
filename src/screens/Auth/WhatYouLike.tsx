import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Container from 'components/Container';
import OrderFoodIcon from 'assets/images/order-food.svg';
import TeamIcon from 'assets/images/team-building.svg';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Title} from 'components/Text';

const types = [
  {
    icon: <OrderFoodIcon />,
    toScreen: 'CreateBusiness',
    label: 'Create my business on Koomi',
    description: 'I want to get set up and start ordering.',
  },
  {
    icon: <TeamIcon />,
    toScreen: 'JoinMyTeam',
    label: 'Join my team',
    description: 'My team is already ordering on Koomi.',
  },
];

export default function WhatYouLikeScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const {navigate} = navigation;

  return (
    <Container className="justify-center">
      <Title>What would you like to do?</Title>
      <Text className="font-light mt-2">
        Create your business on Koomi or join an existing team that’s already
        set up.
      </Text>
      <View className="mt-6">
        {types.map(item => {
          return (
            <TouchableOpacity
              key={item.label}
              onPress={() => navigate(item.toScreen)}
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
