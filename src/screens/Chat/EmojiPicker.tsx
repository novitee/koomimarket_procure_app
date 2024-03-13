import {View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import SmileyIcon from 'assets/images/smiley.svg';
import BottomSheet from 'components/BottomSheet';
import {emojiCodePoints} from 'configs/data';
import Text from 'components/Text';
import CloseCircle from 'assets/images/close-circle.svg';
export default function EmojiPicker({
  handleSelect,
}: {
  handleSelect: (emoji: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function onSelect(emoji: string) {
    setIsOpen(false);
    handleSelect(emoji);
  }

  return (
    <>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)} hitSlop={10}>
        <SmileyIcon className="w-6 h-6" />
      </TouchableOpacity>
      <BottomSheet
        isOpen={isOpen}
        contentHeight={500}
        onClose={() => setIsOpen(false)}>
        <View className="pb-10 pt-3 flex-1">
          <View className="flex-row justify-end pr-3">
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <CloseCircle width={24} height={24} />
            </TouchableOpacity>
          </View>
          <View
            className={
              'flex-row flex-wrap justify-between w-full bg-white rounded py-3 px-5'
            }>
            {emojiCodePoints.map((emoji, index) => {
              return (
                <TouchableOpacity
                  className="p-1 rounded-sm "
                  key={index}
                  hitSlop={3}
                  onPress={() => onSelect(String.fromCodePoint(emoji))}>
                  <Text className="text-3xl">
                    {String.fromCodePoint(emoji)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </BottomSheet>
    </>
  );
}
