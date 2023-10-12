import React, {useCallback} from 'react';
import {FlatList, View} from 'react-native';
import Text from 'components/Text';
import Avatar from 'components/Avatar';
import useMe from 'hooks/useMe';
('@react-navigation/native');
function _keyExtractor(item: any, index: number) {
  return `${item.title}-${index}`;
}
const renderRole = ({role, isMine}: {role: string; isMine: boolean}) => {
  if (isMine) return 'You';
  return (
    [
      {role: 'MEMBER', name: 'Staff'},
      {role: 'ADMIN', name: 'Admin'},
      {role: 'OWNER', name: 'Admin'},
    ].find((item: any) => item.role === role)?.name || ''
  );
};

function MemberItem({item, isMine}: {item: any; isMine: boolean}) {
  return (
    <View className="flex-row items-center mt-4">
      <Avatar size={40} name={item?.fullName} url={item?.avatar?.url} />
      <View className="ml-4">
        <Text>{item?.fullName}</Text>
        <Text className="text-14 text-gray-600">
          {renderRole({
            role: item?.role,
            isMine: isMine,
          })}
        </Text>
      </View>
    </View>
  );
}

export default function MemberList({members}: any) {
  const {user} = useMe();
  const {me} = user || {};

  const EmptyComponent = useCallback(() => {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="font-bold mt-4 text-center">No team member</Text>
      </View>
    );
  }, []);

  const _renderItem = useCallback(
    ({item}: {item?: any}) => {
      return <MemberItem item={item} isMine={item?.id === me?.id} />;
    },
    [me],
  );

  return (
    <FlatList
      className="flex-1"
      keyExtractor={_keyExtractor}
      renderItem={_renderItem}
      data={members}
      extraData={members}
      ListEmptyComponent={EmptyComponent}
    />
  );
}
