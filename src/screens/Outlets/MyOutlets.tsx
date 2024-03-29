import React, {useCallback} from 'react';
import Container from 'components/Container';
import Text, {Title} from 'components/Text';
import IllustrationIcon from 'assets/images/Illustration.svg';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  Image,
  LogBox,
} from 'react-native';
import Button from 'components/Button';
import useQuery from 'libs/swr/useQuery';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import {setGlobal} from 'stores/global';
import useMutation from 'libs/swr/useMutation';
import {saveAuthData} from 'utils/auth';
import Loading from 'components/Loading';
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function OutletItem({
  item,
  onPress,
}: {
  item?: any;
  onPress?: TouchableOpacityProps['onPress'];
}) {
  const {photo, name, deliveryAddress} = item || {};
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row rounded-lg bg-gray-E0E0E4/20 p-5 mb-4">
      {photo?.url ? (
        <Image
          className="w-[72px] h-[72px] bg-gray-400 rounded-lg overflow-hidden"
          source={{uri: photo?.url}}
        />
      ) : (
        <View className="items-center justify-center bg-gray-D4D4D8 overflow-hidden w-[72px] h-[72px] rounded-lg">
          <Text className="font-bold" style={{fontSize: Math.max(12, 72 / 2)}}>
            {(name || '').charAt(0)}
          </Text>
        </View>
      )}

      <View className="flex-1 ml-4">
        <Text className="font-bold text-18">{name}</Text>
        <Text className="font-light mt-2">{deliveryAddress}</Text>
      </View>
    </TouchableOpacity>
  );
}

function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}

function useQueryOutlets() {
  const url = 'me/outlets';
  const params = {
    include: 'photos(url,width,height,filename,contentType,signedKey)',
  };
  return useQuery([url, params]);
}

export default function MyOutletsScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const {data, isLoading, mutate} = useQueryOutlets();
  // useIsFocused();

  const isFocused = useIsFocused();
  useFocusEffect(
    React.useCallback(() => {
      if (isFocused) {
        mutate();
      }
    }, [isFocused]),
  );

  const [{loading}, setOutlet] = useMutation({
    method: 'PATCH',
    url: 'me/switchOutlet',
  });

  const toAddOutlet = useCallback(() => {
    navigation.navigate('AddOutlet');
  }, [mutate, navigation]);

  const handleSelectOutlet = useCallback(
    async ({item}: {item?: any}) => {
      setGlobal({currentOutlet: item});
      const {data: dataResp, success} = await setOutlet({outletId: item.id});
      if (success) {
        const {token, refreshToken} = dataResp;
        saveAuthData({token, refreshToken});
        navigation.navigate('SupplierTabs');
      }
    },
    [navigation, setOutlet],
  );

  const EmptyComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center">
        <IllustrationIcon />
        <Text className="font-bold mt-4 text-center">No Outlets Yet...</Text>
        <Text className="font-light mt-4 text-center">
          Tell us about your outlets!
        </Text>
      </View>
    );
  }, []);

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <OutletItem item={item} onPress={() => handleSelectOutlet({item})} />
      );
    },
    [handleSelectOutlet],
  );

  const {records} = data || {};

  return (
    <Container>
      <Title>My Outlets</Title>
      <FlatList
        keyExtractor={_keyExtractor}
        className="mt-6"
        contentContainerStyle={
          !!records && records.length > 0
            ? styles.flatListContentStyle
            : styles.flatListEmptyStyle
        }
        renderItem={_renderItem}
        data={records || []}
        extraData={records}
        ListEmptyComponent={EmptyComponent}
      />
      <Button className="mt-4" onPress={toAddOutlet}>
        + Create Outlet
      </Button>
      {(isLoading || loading) && <Loading />}
    </Container>
  );
}

const styles = StyleSheet.create({
  flatListContentStyle: {
    paddingBottom: 20,
  },
  flatListEmptyStyle: {
    flex: 1,
  },
});
