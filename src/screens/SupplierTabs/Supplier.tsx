import React, {useCallback, useLayoutEffect, useEffect, useRef} from 'react';
import {useIsFocused, useFocusEffect} from '@react-navigation/native';
import Container from 'components/Container';
import Text from 'components/Text';
import ShippingIcon from 'assets/images/shipping.svg';
import IllustrationIcon from 'assets/images/Illustration.svg';
import {
  Animated,
  FlatList,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import useQuery from 'libs/swr/useQuery';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import SearchBar from 'components/SearchBar';
import EditIcon from 'assets/images/edit.svg';

import {LogBox} from 'react-native';
import {setGlobal, useGlobalStore} from 'stores/global';
import Avatar from 'components/Avatar';
import dayjs from 'dayjs';
import colors from 'configs/colors';
import useSearch from 'hooks/useSearch';
import {BackButton} from 'navigations/common';
import Loading from 'components/Loading';
import clsx from 'libs/clsx';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useChatStore} from 'stores/chat';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function SupplierItem({
  item,
  onPress,
  onPressEdit,
}: {
  item?: any;
  onPress?: TouchableOpacityProps['onPress'];
  onPressEdit?: TouchableOpacityProps['onPress'];
}) {
  const {createdAt, lastMessage, supplier, lastOrderAt} = item || {};
  const swipeableRef = useRef<any>();
  const imageUrl = supplier?.photo?.url;
  const {type, text} = lastMessage || {};
  const isPendingSetup =
    type === 'group_notification' && text === 'Pending Setup';

  const handlePressEdit = useCallback(
    (event: GestureResponderEvent) => {
      onPressEdit?.(event);
      if (swipeableRef.current) {
        swipeableRef.current.close();
      }
    },
    [onPressEdit, swipeableRef],
  );

  const renderRightActions = useCallback(
    (progress: any) => {
      const trans = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [64, 0],
      });
      return (
        <View className="h-full  bg-primary">
          <Animated.View
            className={
              'flex-1 w-[100px] items-center bg-primary justify-center h-full'
            }
            style={{transform: [{translateX: trans}]}}>
            <TouchableOpacity
              className="w-10 h-10 rounded-full bg-white items-center justify-center"
              onPress={handlePressEdit}>
              <EditIcon color={colors.primary.DEFAULT} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    },
    [handlePressEdit],
  );

  const Wrapper = isPendingSetup ? View : Swipeable;

  return (
    <GestureHandlerRootView>
      <Wrapper
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        friction={2}
        rightThreshold={40}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          disabled={isPendingSetup}
          className={clsx({
            'flex-row items-center rounded-lg p-5': true,
            'bg-slate-50': isPendingSetup,
            'bg-white': !isPendingSetup,
          })}>
          <Avatar url={imageUrl} size={64} name={supplier?.name} />
          <View className="flex-1 justify-center ml-4">
            <Text className="font-bold text-18">{supplier?.name}</Text>
            {!isPendingSetup && (
              <Text className="font-light text-xs mt-2">
                {lastOrderAt
                  ? `Last Ordered: ${dayjs(lastOrderAt).format('MM/DD/YYYY')}`
                  : `Added at ${dayjs(createdAt).format('MM/DD/YYYY')}`}
              </Text>
            )}
            {isPendingSetup && (
              <Text className="font-light  text-xs mt-2">
                Pending Setup by Koomi Team
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </Wrapper>
    </GestureHandlerRootView>
  );
}

function _keyExtractor(item: any, index: number) {
  return `${item.name}-${index}`;
}

const _renderItemSeparator = () => (
  <View className="w-full h-[1px] bg-gray-D1D5DB" />
);

export default function SupplierScreen({
  navigation,
  route,
}: NativeStackScreenProps<any>) {
  const {searchString, handleSearch} = useSearch();
  const currentOutlet = useGlobalStore(state => state.currentOutlet);
  const {params} = route || {};
  const isFocused = useIsFocused();
  const {resetLocalMessages} = useChatStore();

  useEffect(() => {
    if (params?.searchString) {
      handleSearch(params?.searchString);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.searchString]);

  const {
    data,
    isLoading,
    mutate: refreshChannels,
  } = useQuery([
    '/channels',
    {
      first: 100,
      skip: 0,
      orderby: {
        updatedAt: 'desc',
      },
      filter: {
        status_nin: ['INACTIVE'],
      },
      searchString: searchString,
      include: 'channelMembers(id,userId,,user,role),supplier(name,photo)',
    },
  ]);

  const {records} = data || {};

  useFocusEffect(
    React.useCallback(() => {
      if (isFocused) {
        if (!searchString) {
          refreshChannels();
        } else {
          handleSearch('');
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]),
  );

  useLayoutEffect(() => {
    if (currentOutlet) {
      navigation.setOptions({
        // eslint-disable-next-line react/no-unstable-nested-components
        headerLeft: () => (
          <BackButton
            canGoBack
            goBack={() =>
              navigation.reset({
                index: 0,
                routes: [{name: 'MyOutlets'}],
              })
            }
          />
        ),
        headerTitle: currentOutlet?.name,
      });
    }
  }, [currentOutlet, navigation]);

  // const toAddSupplier = useCallback(() => {
  //   navigation.navigate('AddSupplierName');
  // }, [navigation]);

  // const toSupplierProfile = useCallback(() => {
  //   navigation.navigate('AddSupplierProfile');
  // }, [navigation]);

  const handleSelectSupplier = useCallback(
    ({item}: {item?: any}) => {
      setGlobal({currentChannel: item});
      resetLocalMessages();
      navigation.navigate('Chat');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [navigation],
  );

  const handleEditSupplier = useCallback(
    (item: any) => {
      navigation.navigate('SupplierDetail', {channelId: item.id});
    },
    [navigation],
  );

  const EmptyComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center px-5">
        <ShippingIcon />
        <Text className="font-bold mt-4 text-center">Welcome to Koomi!</Text>
        <Text className="font-light mt-4 text-center">
          Start by adding your suppliers.
        </Text>

        {/* <Button className="mt-4" onPress={toSupplierProfile}>
          + Add Supplier
        </Button> */}
      </View>
    );
  }, []);

  const EmptySearchComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center px-5">
        <IllustrationIcon />
        <Text className="font-bold mt-4 text-center">Supplier not found</Text>
        {/* <Text className="font-light mt-4 text-center">
          Submit a form and our team will create it for you.
        </Text>

        <Button className="mt-4" onPress={toAddSupplier}>
          + Add Supplier Manually
        </Button> */}
      </View>
    );
  }, []);

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return (
        <SupplierItem
          item={item}
          onPress={() => handleSelectSupplier({item})}
          onPressEdit={() => handleEditSupplier(item)}
        />
      );
    },
    [handleEditSupplier, handleSelectSupplier],
  );

  return (
    <Container className="pt-4 px-0 pb-2">
      <SearchBar
        className="px-5"
        onSearch={handleSearch}
        defaultValue={searchString}
      />

      {!!records && records.length > 0 && (
        <Text className="px-3 mt-5 font-semibold">
          Select any supplier to start order
        </Text>
      )}
      <FlatList
        keyExtractor={_keyExtractor}
        className="flex-1"
        contentContainerStyle={
          !!records && records.length > 0
            ? styles.flatListContentStyle
            : styles.flatListEmptyStyle
        }
        renderItem={_renderItem}
        data={records || []}
        extraData={records}
        ListEmptyComponent={
          isLoading
            ? null
            : searchString
            ? EmptySearchComponent
            : EmptyComponent
        }
        ItemSeparatorComponent={_renderItemSeparator}
      />
      {/* {!!records && records.length > 0 && (
        <View className="flex-row justify-end px-5">
          <Button
            fullWidth={false}
            className="px-4"
            size="md"
            onPress={toSupplierProfile}
            variant="outline">
            + Add Supplier
          </Button>
        </View>
      )} */}
      {isLoading && <Loading />}
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
