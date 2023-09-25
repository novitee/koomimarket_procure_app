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
import useQuery from 'libs/swr/useQuery';
import Toast from 'react-native-simple-toast';
import MailIcon from 'assets/images/mail.svg';
import BusinessForm from './BusinessForm';
import ImageUpload from 'components/ImageUpload';
import Avatar from 'components/Avatar';
import OutletBusinessList from 'components/OutletBusinessList';
const Divider = () => <View className="h-[1px] w-full bg-gray-D1D5DB my-2" />;

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
  const {data: outletsData} = useQuery('me/outlets');
  const {records: outlets} = outletsData || {};
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

  const {companyName, billingAddress, postalCode, unitNo, photo} = values;

  useEffect(() => {
    if (currentCompany) {
      dispatch({
        companyName: currentCompany?.name,
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
      headerTitle: editMode ? 'Edit Business' : 'My Business',
    });
  }, [headerRight, navigation]);

  async function handleSave(params: any) {
    const {success, error} = await updateBusinessProfile({
      company: params,
    });

    if (!success) {
      Toast.show(error.message, Toast.LONG);
      return;
    }
    setEditMode(false);
  }
  return (
    <Container className="px-0">
      {!editMode && (
        <View className="mt-7">
          <View className="px-5">
            <View className="items-center mb-8">
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
                    <Avatar name={companyName} size={162} />
                  )
                }
                onChange={() => {}}
                editable={false}
              />
            </View>
            <Text className="font-bold">{companyName}</Text>

            <View className="flex-row mt-5 w-full mb-6">
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
          </View>
          <View className="px-5">
            <Divider />
            <Text className="font-bold">Outlet Name</Text>
          </View>

          <OutletBusinessList
            outlets={outlets || []}
            onSelect={item => {
              navigation.navigate('EditOutlet', {outlet: item});
            }}
          />
        </View>
      )}
      {editMode && (
        <BusinessForm
          editMode={editMode}
          initialValues={values}
          onSave={handleSave}
          loading={loading}
        />
      )}
    </Container>
  );
}
