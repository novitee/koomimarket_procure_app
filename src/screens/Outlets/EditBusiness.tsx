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
import {Image, TouchableOpacity, View} from 'react-native';
import useMe from 'hooks/useMe';

import useMutation from 'libs/swr/useMutation';
import Toast from 'react-native-simple-toast';

import LocationIcon from 'assets/images/map-marker.svg';
import MailIcon from 'assets/images/mail.svg';
import OutletForm from './OutletForm';
import ImageUpload from 'components/ImageUpload';
import Avatar from 'components/Avatar';

export default function EditBusinessScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const [editMode, setEditMode] = useState(false);
  const {user} = useMe();
  const {currentCompany} = user || {};
  const [{loading}, updateBusinessProfile] = useMutation({
    url: 'me/business-profile',
    method: 'PATCH',
  });
  const [currentState, setCurrentState] = useState(0);
  const [values, dispatch] = useReducer(reducer, {});

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

  console.log(`currentCompany  :>>`, currentCompany);

  const {outletName, billingAddress, postalCode, unitNo, photo} = values;

  useEffect(() => {
    if (currentCompany) {
      dispatch({
        outletName: currentCompany?.name,
        postalCode: currentCompany?.postal,
        billingAddress: currentCompany?.billingAddress,
        unitNo: currentCompany?.unitNo,
        photo: currentCompany?.photo,
      });
    }
  }, [currentCompany]);
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

  async function handleSave(paramValues: any) {
    const {success, error} = await updateBusinessProfile({
      company: {
        photo: {...photo, filename: photo?.fileName, url: photo?.uri},
        name: paramValues?.outletName,
        unitNo: paramValues?.unitNo,
        billingAddress: paramValues?.billingAddress,
        postal: paramValues?.postalCode,
      },
    });

    if (!success) {
      Toast.show(error.message, Toast.LONG);
      return;
    }
    navigation.goBack();
  }

  return (
    <Container className="px-0">
      {!editMode && (
        <View className="mt-7 px-5">
          <View className="items-center  mb-8">
            <ImageUpload
              icon={
                photo?.url ? (
                  <Image
                    resizeMode="cover"
                    resizeMethod="scale"
                    className="w-full h-full overflow-hidden rounded-full"
                    source={{uri: photo.url}}
                  />
                ) : (
                  <Avatar name={outletName} size={162} />
                )
              }
              onChange={() => {}}
              editable={false}
            />
          </View>
          <Text className="font-bold">{outletName}</Text>

          <View className="flex-row mt-5 w-full">
            <View className="h-10 w-11 rounded-md bg-primary justify-center items-center">
              <MailIcon />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-sm font-semibold">Billing Address</Text>
              <Text className="text-sm">
                {[billingAddress, postalCode, unitNo].join(' ')}
              </Text>
            </View>
          </View>
          {/* <View className="flex-row">
                <View className="h-10 w-11 rounded-md bg-primary justify-center items-center">
                  <LocationIcon color="white" />
                </View>
                <View className="ml-4">
                  <Text>Billing Address</Text>
                  <Text>{[billingAddress, postal, unitNo].join(' ')}</Text>
                </View>
              </View> */}
        </View>
      )}
      {editMode && (
        <OutletForm
          editMode={editMode}
          initialValues={values}
          onSave={handleSave}
          loading={loading}
        />
      )}
    </Container>
  );
}
