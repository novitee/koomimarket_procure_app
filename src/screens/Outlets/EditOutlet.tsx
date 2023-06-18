import React, {useCallback, useLayoutEffect, useState} from 'react';
import Container from 'components/Container';
import Text from 'components/Text';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import ImageUpload from 'components/ImageUpload';
import UserIcon from 'assets/images/user.svg';
import colors from 'configs/colors';
import useMe from 'hooks/useMe';
import Input from 'components/Input';
import {styled} from 'nativewind';
import Button from 'components/Button';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';

const StyledInput = styled(Input, 'border-0 h-[60px] px-4');

export default function EditOutletScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const [editMode, setEditMode] = useState(false);
  const {user} = useMe();
  const {fullName, email, mobileNumber} = user?.me || {};

  const headerRight = useCallback(() => {
    return (
      <TouchableOpacity onPress={() => setEditMode(!editMode)} hitSlop={5}>
        <Text className="text-primary text-lg font-medium">
          {editMode ? 'Cancel' : 'Edit'}
        </Text>
      </TouchableOpacity>
    );
  }, [editMode]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: headerRight,
    });
  }, [headerRight, navigation]);

  function handleSave() {}

  return (
    <Container className="px-0">
      <KeyboardAvoidingView>
        <ScrollView className="flex-1">
          <View className="items-center">
            <ImageUpload
              icon={<UserIcon color={colors.gray['71717A']} />}
              onChange={() => {}}
            />
          </View>
          <View className="mt-7 divide-y border-y border-gray-D1D5DB">
            <StyledInput
              editable={editMode}
              defaultValue={fullName}
              placeholder="Full name"
            />
            <StyledInput
              editable={editMode}
              defaultValue={email}
              placeholder="Email"
            />
            <StyledInput
              editable={editMode}
              defaultValue={mobileNumber}
              placeholder="Mobile Number"
            />
          </View>
        </ScrollView>

        {editMode && (
          <View className="px-4">
            <Button onPress={handleSave}>Save</Button>
          </View>
        )}
      </KeyboardAvoidingView>
    </Container>
  );
}
