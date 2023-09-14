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

export default function AddOutletScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {params} = route || {};
  const {refreshOutlet} = params || {};

  const [{loading}, addOutlet] = useMutation({
    url: 'me/outlets/add',
  });

  async function handleAddOutlet(paramValues: any) {
    const response = await addOutlet(paramValues);
    const {success, message, errors} = response || {};
    if (success) {
      refreshOutlet?.();
      navigation.goBack();
    } else {
      Toast.show(message || errors?.name, Toast.LONG);
    }
  }

  return (
    <Container className="px-0">
      <OutletForm
        initialValues={{}}
        onSave={handleAddOutlet}
        loading={loading}
      />
    </Container>
  );
}
