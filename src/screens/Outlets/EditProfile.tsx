import React, {
  useCallback,
  useLayoutEffect,
  useState,
  useReducer,
  useEffect,
} from 'react';
import Container from 'components/Container';
import Text from 'components/Text';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScrollView, TouchableOpacity, View, Image} from 'react-native';
import ImageUpload from 'components/ImageUpload';
import UserIcon from 'assets/images/user.svg';
import colors from 'configs/colors';
import useMe from 'hooks/useMe';
import Input from 'components/Input';
import {styled} from 'nativewind';
import Button from 'components/Button';
import KeyboardAvoidingView from 'components/KeyboardAvoidingView';
import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import PhonePicker from 'components/ui/PhonePicker';

const StyledInput = styled(Input, 'mx-4 my-2 rounded-lg');

export default function EditProfileScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const [currentState, setCurrentState] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const {user, refresh} = useMe();
  const {me} = user || {};
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      if (isFocused) {
        refresh();
      }
    }, [isFocused]),
  );

  const [values, dispatch] = useReducer(reducer, {
    render: false,
    fullName: '',
    email: '',
    avatar: '',
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

  const {fullName, email, avatar, mobileCode, mobileNumber} = values;

  const resetToDefault = useCallback(() => {
    dispatch({
      fullName: me?.fullName,
      email: me?.email,
      avatar: me?.avatar,
      mobileCode: me?.mobileCode,
      mobileNumber: me?.mobileNumber,
      render: true,
    });
  }, [me]);

  useEffect(() => {
    if (me) {
      resetToDefault();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);

  const headerRight = useCallback(() => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (editMode) {
            resetToDefault();
          }
          setEditMode(!editMode);
        }}
        hitSlop={5}>
        <Text className="text-primary text-lg font-medium">
          {editMode ? 'Cancel' : 'Edit'}
        </Text>
      </TouchableOpacity>
    );
  }, [editMode, resetToDefault]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: headerRight,
      headerTitle: editMode ? 'Edit Profile' : 'My Profile',
    });
  }, [headerRight, navigation]);

  const [{}, updateProfile] = useMutation({
    url: 'me/profile',
    method: 'PATCH',
  });

  const handleSave = useCallback(async () => {
    const {success, error} = await updateProfile({
      profile: {
        fullName: fullName,
        email: email,
        avatar: {...avatar, filename: avatar?.fileName, url: avatar?.uri},
      },
    });

    if (!success) {
      Toast.show(error?.message, Toast.LONG);
      return;
    }
    navigation.goBack();
  }, [fullName, email, avatar]);

  return (
    <Container className="px-0">
      <KeyboardAvoidingView>
        <ScrollView className="flex-1">
          <View className="items-center">
            <ImageUpload
              icon={
                avatar ? (
                  <Image
                    resizeMode="cover"
                    resizeMethod="scale"
                    className="w-full h-full overflow-hidden rounded-full"
                    source={{uri: avatar.url}}
                  />
                ) : (
                  <UserIcon color={colors.gray['71717A']} />
                )
              }
              onChange={image => {
                if (Array.isArray(image)) {
                  dispatch({avatar: image[0], render: true});
                } else {
                  dispatch({avatar: image, render: true});
                }
              }}
              editable={editMode}
            />
          </View>
          <View className="mt-7">
            <StyledInput
              editable={editMode}
              defaultValue={fullName}
              placeholder="Full name"
              onChangeText={text => dispatch({fullName: text, render: true})}
            />
            <StyledInput
              editable={editMode}
              defaultValue={email}
              placeholder="Email"
              onChangeText={text => dispatch({email: text, render: true})}
            />
            <View className="mx-4 my-2 ">
              <PhonePicker
                code={mobileCode}
                number={mobileNumber}
                onChange={() => {}}
                editable={false}
              />
            </View>
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
