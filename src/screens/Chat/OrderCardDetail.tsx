import dayjs from 'dayjs';
import clsx from 'libs/clsx';

import React from 'react';
import {toCurrency} from 'utils/format';
import {navigationRef} from 'navigations/index';

import {View, TouchableOpacity} from 'react-native';

import Text from 'components/Text';
import CircleCheckIcon from 'assets/images/circle-check.svg';
import TruckIcon from 'assets/images/truck-2.svg';
import CartIcon from 'assets/images/cart.svg';
import DollarIcon from 'assets/images/dollar.svg';
import InformationCircleIcon from 'assets/images/information-circle.svg';

interface OrderCardDetailProps {
  order: any;
  isRead?: boolean;
}

const colorByStatus: Record<string, string> = {
  '': '',
  SUBMITTED: 'blue-500',
  ACKNOWLEDGED: 'orange-400',
  PACKED: 'orange-400',
  CANCELED: 'gray-500',
  COMPLETED: 'green-700',
  RESOLVING: 'purple-700',
};

function getColorByStatus(status: string, attribute: any) {
  return {[`${attribute}-${colorByStatus[status]}`]: true};
}

function OrderCardDetail({order}: OrderCardDetailProps) {
  const {
    itemNumbers = 0,
    orderedAt,
    status,
    deliveryDate,
    total,
    orderId,
    orderNo,
    remarks,
  } = order;

  const renderStatus = (status: any) => {
    switch (status) {
      case 'SUBMITTED':
        return 'SENT';
      case 'ACKNOWLEDGED':
        return 'CONFIRMED';
      case 'PACKED':
        return 'PACKED';
      case 'CANCELED':
        return 'CANCELED';
      case 'COMPLETED':
        return 'DELIVERED';
      case 'RESOLVING':
        return 'RESOLVING';
      default:
        return 'SENT';
    }
  };

  const handleViewDetails = () => {
    setTimeout(() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate({
          name: 'OrderDetail',
          params: {
            orderNo,
          },
        } as never);
      }
    }, 100);
  };
  return (
    <View
      className={clsx({
        'w-[260px] rounded-xl border overflow-hidden bg-white mb-1': true,
        // border-blue-500: status === 'SUBMITTED',
        // border-orange-400: status === 'ACKNOWLEDGED',
        // border-gray-500: status === 'CANCELED',
        // border-green-700: status === 'COMPLETED',
        // border-purple-700: status === 'RESOLVING',
        // 'border-orange-400': status === 'PACKED',
        ...getColorByStatus(status, 'border'),
      })}>
      <View className="flex-col px-4 py-3 border-b border-gray-300 ">
        <Text className="text-xl font-semibold text-gray-900">Order</Text>
        <Text className="text-gray-500 font-bold text-xs">
          {dayjs(orderedAt).format('DD MMM YYYY')}
          {' - '}
          {orderNo}
        </Text>
      </View>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-300 ">
        <Text className="text-gray-500 font-medium text-xs mr-2 ">
          Order Status
        </Text>
        <View className="flex-row text-gray-500 font-bold text-xs border border-gray-300 p-2 rounded-lg flex items-center justify-center">
          <View
            className={clsx({
              'rounded-full w-4 h-4 mr-2': true,
              // bg-blue-500: status === 'SUBMITTED',
              // bg-orange-400: status === 'ACKNOWLEDGED',
              // bg-gray-500: status === 'CANCELED',
              // bg-green-700: status === 'COMPLETED',
              // bg-purple-700: status === 'RESOLVING',
              // 'bg-orange-400': status === 'PACKED',
              ...getColorByStatus(status, 'bg'),
            })}></View>
          <View
            className={clsx({
              'uppercase text-lg font-semibold': true,
              // text-blue-500: status === 'SUBMITTED',
              // text-orange-400: status === 'ACKNOWLEDGED',
              // text-gray-500: status === 'CANCELED',
              // text-green-700: status === 'COMPLETED',
              // text-purple-700: status === 'RESOLVING',
              // 'text-orange-400': status === 'PACKED',
              ...getColorByStatus(status, 'text'),
            })}>
            <Text>{renderStatus(status)}</Text>
          </View>
        </View>
      </View>
      <View className="px-4 py-3 border-b border-gray-300">
        <View className="flex-row items-center justify-between py-2">
          <View className="flex-row items-center">
            <Text className="text-gray-500 font-medium text-xs">
              Delivery date
            </Text>
          </View>
          <Text className="text-gray-500 font-bold text-xs">
            {dayjs(deliveryDate).format('ddd, DD MMM YYYY')}
          </Text>
        </View>
      </View>
      <View className="px-4 py-3 border-b border-gray-300">
        <View className="flex-row items-center justify-between py-2">
          <View className="flex-row items-center">
            <Text className="text-gray-500 font-medium text-xs">
              Products ordered
            </Text>
          </View>
          <Text className="text-gray-500 font-bold text-xs">
            {itemNumbers > 1 ? `${itemNumbers} SKUs` : `${itemNumbers} SKU`}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-300">
        <View className="flex-row items-center">
          <Text className="text-gray-500 font-medium text-xs">
            Cost of goods
          </Text>
        </View>
        <Text className="text-gray-500 font-bold text-xs">
          {toCurrency(total, 'SGD')?.replace('SGD', 'S$')}
        </Text>
      </View>
      <View
        className={clsx({
          'flex-row px-4 py-3 border-b border-gray-300': true,
          'flex-col': !!remarks,
          'flex-row justify-between items-center': !remarks,
        })}>
        <View className="flex-row items-center">
          <Text className="text-gray-500 font-medium text-xs">Remark</Text>
        </View>
        <Text className="text-gray-500 font-bold text-xs mt-2">
          {remarks || '_'}
        </Text>
      </View>

      <TouchableOpacity
        className={clsx({
          'py-2 flex-row items-center justify-center cursor-pointer': true,
          // bg-blue-500: status === 'SUBMITTED',
          // bg-orange-400: status === 'ACKNOWLEDGED',
          // bg-gray-500: status === 'CANCELED',
          // bg-green-700: status === 'COMPLETED',
          // bg-purple-700: status === 'RESOLVING',
          // 'bg-orange-400': status === 'PACKED',
          ...getColorByStatus(status, 'bg'),
        })}
        onPress={handleViewDetails}>
        <Text className="text-white text-lg font-bold">View Details</Text>
      </TouchableOpacity>
    </View>
  );
}

export default OrderCardDetail;
