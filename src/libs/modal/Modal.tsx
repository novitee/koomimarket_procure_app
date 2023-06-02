import React from 'react';
import {
  KeyboardAvoidingView,
  Modal as RNModal,
  ModalProps as RNModalProps,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

interface Props {
  children: React.ReactElement | React.ReactElement[] | any;
  contentStyle?: ViewStyle;
  avoidKeyboard?: boolean;
}

type ModalProps = Props & RNModalProps;

function Modal({
  children,
  visible,
  style,
  contentStyle,
  avoidKeyboard = true,
  ...props
}: ModalProps) {
  return (
    <RNModal
      animationType="fade"
      transparent={true}
      visible={visible}
      {...props}
      style={[styles.modal, style]}>
      {avoidKeyboard ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.centeredView, contentStyle]}>
          {children}
        </KeyboardAvoidingView>
      ) : (
        <View style={[styles.centeredView, contentStyle]}>{children}</View>
      )}
    </RNModal>
  );
}

export default Modal;

const styles = StyleSheet.create({
  modal: {},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
