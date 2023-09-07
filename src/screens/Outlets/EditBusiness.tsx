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
import usePostalCode from 'hooks/usePostalCode';
import clsx from 'libs/clsx';
import FormGroup from 'components/Form/FormGroup';
import Label from 'components/Form/Label';

const StyledInput = styled(Input, ' my-2');

export default function EditBusinessScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const [editMode, setEditMode] = useState(false);
  const {user} = useMe();
  const {currentCompany} = user || {};
  const {loading: loadingPostal, handlePostalCodeChange} = usePostalCode();
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
  const {name, postal, billingAddress, unitNo, photo, errors = {}} = values;

  useEffect(() => {
    if (currentCompany) {
      dispatch({
        name: currentCompany?.name,
        postal: currentCompany?.postal,
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

  const handleChangePostalCode = useCallback(
    async (text: string) => {
      const address = await handlePostalCodeChange(text);
      if (address) {
        dispatch({
          billingAddress: address,
          postal: text,
          render: true,
        });
      }
    },
    [handlePostalCodeChange],
  );

  const validateInputs = useCallback((errors: {[key: string]: boolean}) => {
    dispatch({errors, render: true});
    return Object.keys(errors).reduce((acc: boolean, key: string) => {
      if (errors[key]) {
        Toast.show('Please fill in all required fields', Toast.SHORT);
        return false;
      }
      return acc;
    }, true);
  }, []);

  async function handleSave() {
    const validFields = validateInputs({
      ...errors,
      name: !name,
      postal: !postal,
    });
    if (!validFields) {
      return;
    }

    const {success, error} = await updateBusinessProfile({
      company: {
        photo: {...photo, filename: photo.fileName, url: photo.uri},
        name: name,
        unitNo: unitNo,
        billingAddress: billingAddress,
        postal: postal,
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
      <KeyboardAvoidingView>
        <ScrollView className="flex-1 px-5">
          <View className="items-center">
            <ImageUpload
              icon={
                photo ? (
                  <Image
                    resizeMode="cover"
                    resizeMethod="scale"
                    className="w-full h-full overflow-hidden rounded-full"
                    source={{uri: photo.url}}
                  />
                ) : (
                  <UserIcon color={colors.gray['71717A']} />
                )
              }
              onChange={image => {
                if (Array.isArray(image)) {
                  dispatch({photo: image[0], render: true});
                } else {
                  dispatch({photo: image, render: true});
                }
              }}
              editable={editMode}
            />
          </View>
          <FormGroup>
            <Label required>Business Name</Label>
            <StyledInput
              editable={editMode}
              onChangeText={text => dispatch({name: text, render: true})}
              defaultValue={name}
              placeholder="Full name"
              className={clsx({
                'border-red-500': errors.name,
              })}
            />
            <Label required>Billing Address</Label>
            <StyledInput
              editable={editMode}
              onChangeText={handleChangePostalCode}
              defaultValue={postal}
              placeholder="Postal Code"
              className={clsx({
                'border-red-500': errors.postal,
              })}
            />
            <StyledInput
              editable={false}
              defaultValue={billingAddress}
              placeholder="Billing Address"
            />
            <StyledInput
              editable={editMode}
              onChangeText={text => dispatch({unitNo: text, render: true})}
              defaultValue={unitNo}
              placeholder="Unit Number"
            />
          </FormGroup>
        </ScrollView>

        {editMode && (
          <View className="px-5">
            <Button loading={loading || loadingPostal} onPress={handleSave}>
              Save
            </Button>
          </View>
        )}
      </KeyboardAvoidingView>
    </Container>
  );
}
