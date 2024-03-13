import dayjs from 'dayjs';
import clsx from 'libs/clsx';

import React from 'react';
import {toCurrency} from 'utils/format';

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

  return (
    <View
      className={clsx({
        'w-70 rounded-xl border overflow-hidden bg-white mb-1': true,
        // border-blue-500: status === 'SUBMITTED',
        // border-orange-400: status === 'ACKNOWLEDGED',
        // border-gray-500: status === 'CANCELED',
        // border-green-700: status === 'COMPLETED',
        // border-purple-700: status === 'RESOLVING',
        ...getColorByStatus(status, 'border'),
      })}>
      <View className="flex-row items-center justify-between px-4 py-5 border-b border-gray-300 ">
        <Text className="text-xl font-semibold text-gray-900">Order</Text>
        <Text
          className={clsx({
            'uppercase text-lg font-semibold': true,
            // text-blue-500: status === 'SUBMITTED',
            // text-orange-400: status === 'ACKNOWLEDGED',
            // text-gray-500: status === 'CANCELED',
            // text-green-700: status === 'COMPLETED',
            // text-purple-700: status === 'RESOLVING',
            ...getColorByStatus(status, 'text'),
          })}>
          {renderStatus(status)}
        </Text>
      </View>
      <View className="px-4 py-5 border-b border-gray-300">
        <View className="flex-row items-center justify-between py-2">
          <View className="flex-row items-center">
            <CircleCheckIcon width={20} height={20} />
            <Text className="text-gray-500 font-medium text-xs ml-2">
              Ordered
            </Text>
          </View>
          <Text className="text-gray-500 font-bold text-xs">
            {dayjs(orderedAt).format('ddd HH:mm, DD MMM YYYY')}
          </Text>
        </View>
        <View className="flex-row items-center justify-between py-2">
          <View className="flex-row items-center">
            <TruckIcon width={20} height={16} />
            <Text className="text-gray-500 font-medium text-xs ml-2">
              Delivery
            </Text>
          </View>
          <Text className="text-gray-500 font-bold text-xs">
            {dayjs(deliveryDate).format('ddd, DD MMM YYYY')}
          </Text>
        </View>
        <View className="flex-row items-center justify-between py-2">
          <View className="flex-row items-center">
            <CartIcon width={20} height={20} />
            <Text className="text-gray-500 font-medium text-xs ml-2">
              Items
            </Text>
          </View>
          <Text className="text-gray-500 font-bold text-xs">
            {itemNumbers > 1 ? `${itemNumbers} SKUs` : `${itemNumbers} SKU`}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between px-4 py-5 border-b border-gray-300">
        <View className="flex-row items-center">
          <DollarIcon width={20} height={20} />
          <Text className="text-gray-500 font-medium text-xs ml-2">Cost</Text>
        </View>
        <Text className="text-gray-500 font-bold text-xs">
          {toCurrency(total, 'SGD')?.replace('SGD', 'S$')}
        </Text>
      </View>
      <View
        className={clsx({
          'flex-row px-4 py-5 border-b border-gray-300': true,
          'flex-col': !!remarks,
          'flex-row justify-between items-center': !remarks,
        })}>
        <View className="flex-row items-center">
          <InformationCircleIcon width={20} height={20} />
          <Text className="text-gray-500 font-medium text-xs ml-2">Remark</Text>
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
          ...getColorByStatus(status, 'bg'),
        })}>
        <Text className="text-white text-lg font-bold">View Details</Text>
      </TouchableOpacity>
    </View>
  );
}

export default OrderCardDetail;
