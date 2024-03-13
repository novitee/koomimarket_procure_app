import React, {
  ForwardedRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useClickOutSide} from 'components/ClickOutside';
const {height: SCREEN_HEIGHT} = Dimensions.get('window');

type BottomSheetProps = {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  contentHeight?: number;
  ref?: any;
};

function BottomSheet(
  {children, isOpen, onClose, contentHeight = 500}: BottomSheetProps,
  ref: ForwardedRef<any>,
) {
  const translateY = useSharedValue(0);
  const [openModal, setOpenModal] = useState(isOpen);
  const viewRef = useClickOutSide(() => {
    onClose?.();
  });

  useImperativeHandle(ref, () => ({
    close() {
      setOpenModal(false);
    },
    open() {
      setOpenModal(true);
    },
  }));

  useEffect(() => {
    if (isOpen && isOpen !== openModal) {
      setTimeout(() => {
        setOpenModal(true);
      }, 100);
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
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <Animated.View
          collapsable={false}
          style={[
            styles.bottomSheetContainer,
            {height: contentHeight},
            rBottomSheetStyle,
          ]}
          ref={viewRef}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

export default React.forwardRef(BottomSheet);

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
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
});
