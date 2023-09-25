import {LogBox} from 'react-native';
import React from 'react';
import Container from 'components/Container';

import useMutation from 'libs/swr/useMutation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Toast from 'react-native-simple-toast';

import OutletForm from './OutletForm';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function EditOutletScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {params} = route || {};
  const {outlet} = params || {};
  const [{loading}, updateOutlet] = useMutation({
    url: `me/outlets/${outlet?.id}`,
    method: 'PATCH',
  });

  async function handleEditOutlet(paramValues: any) {
    const response = await updateOutlet(paramValues);
    const {success, message, errors} = response || {};
    if (success) {
      navigation.goBack();
    } else {
      Toast.show(message || errors?.name, Toast.LONG);
    }
  }

  return (
    <Container className="px-0">
      <OutletForm
        onSave={handleEditOutlet}
        loading={loading}
        initialValues={outlet}
        editMode={true}
      />
    </Container>
  );
}
