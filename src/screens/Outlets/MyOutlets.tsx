import React, {useCallback} from 'react';
import Container from 'components/Container';
import Text, {Title} from 'components/Text';
import IllustrationIcon from 'assets/images/Illustration.svg';
import {FlatList, StyleSheet, View} from 'react-native';
import Button from 'components/Button';
import useQuery from 'libs/swr/useQuery';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useIsFocused} from '@react-navigation/native';
import {mutate} from 'swr';

import {LogBox} from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function MyOutletsScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const {data} = useQuery(
    'me/outlets?include=photos(url,width,height,filename,contentType,signedKey)',
  );

  useIsFocused();

  const toAddOutlet = useCallback(() => {
    navigation.navigate('AddOutlet', {
      refreshOutlet: mutate,
    });
  }, [navigation]);

  const EmptyComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center">
        <IllustrationIcon />
        <Text className="font-bold mt-4 text-center">No Outlets Yet...</Text>
        <Text className="font-light mt-4 text-center">
          Tell us about your outlets!
        </Text>
        <Button className="mt-4" onPress={toAddOutlet}>
          + Create Outlet
        </Button>
      </View>
    );
  }, [toAddOutlet]);

  function _renderItem({item}: {item: any}) {
    return <View />;
  }

  return (
    <Container>
      <Title>My Outlets</Title>
      <FlatList
        contentContainerStyle={styles.flatListContentStyle}
        renderItem={_renderItem}
        data={data || []}
        ListEmptyComponent={EmptyComponent}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  flatListContentStyle: {
    flex: 1,
  },
});
