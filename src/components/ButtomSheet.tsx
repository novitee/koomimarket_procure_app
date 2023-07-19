import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

type BottomSheetProps = {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  contentHeight?: number;
};

export default function BottomSheet({
  children,
  isOpen,
  onClose,
  contentHeight = 500,
}: BottomSheetProps) {
  const translateY = useSharedValue(0);
  const [openModal, setOpenModal] = useState(isOpen);

  useEffect(() => {
    if (isOpen && isOpen !== openModal) {
      setOpenModal(true);
    } else {
      setTimeout(() => {
        setOpenModal(false);
      }, 400);
    }
    const destination = isOpen ? contentHeight : 0;
    translateY.value = destination;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      borderRadius: 15,
      transform: [
        {
          translateY: withTiming(-translateY.value, {
            duration: 400,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
        },
      ],
    };
  });

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={openModal}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <TouchableHighlight>
          <Animated.View
            style={[
              styles.bottomSheetContainer,
              Platform.OS === 'ios' ? {height: contentHeight} : {},
              rBottomSheetStyle,
            ]}>
            {children}
          </Animated.View>
        </TouchableHighlight>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    width: '100%',
    backgroundColor: 'white',
    top: SCREEN_HEIGHT,
    borderRadius: 25,
    overflow: 'hidden',
    height: SCREEN_HEIGHT,
  },
  centeredView: {
    flex: 1,
    width: '100%',
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
