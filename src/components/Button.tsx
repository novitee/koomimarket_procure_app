import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import clsx from 'libs/clsx';
import {styled} from 'nativewind';
import Text from './Text';

export interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode | string;
  loading?: boolean;
  variant?: 'primary' | 'outline' | 'secondary';
  fullWidth?: boolean;
  size?: 'md' | 'lg';
}

const configs: Record<string, any> = {
  primary: {
    StyledButton: styled(
      TouchableOpacity,
      'bg-primary h-[56px] rounded-full justify-center items-center flex-row  px-5',
    ),
    StyledText: styled(Text, 'text-white font-semibold'),
  },
  outline: {
    StyledButton: styled(
      TouchableOpacity,
      'bg-white border-2 border-primary h-[56px] rounded-full justify-center items-center flex-row  px-5',
    ),
    StyledText: styled(Text, 'text-primary font-semibold'),
  },
  secondary: {
    StyledButton: styled(
      TouchableOpacity,
      'bg-primary/10 h-[56px] rounded-full justify-center items-center flex-row  px-5',
    ),
    StyledText: styled(Text, 'text-primary font-semibold'),
  },
};

export default function Button({
  children,
  onPress,
  loading,
  activeOpacity = 0.8,
  className,
  disabled,
  variant = 'primary',
  fullWidth = true,
  size = 'lg',
  ...props
}: ButtonProps) {
  const {StyledButton, StyledText} = configs[variant];
  return (
    <StyledButton
      {...props}
      className={clsx(
        {
          'opacity-60': !!loading || !!disabled,
          'w-full': fullWidth,
          'h-11': size === 'md',
        },
        className,
      )}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}>
      {typeof children === 'string' ? (
        <StyledText
          className={clsx({
            'text-16 font-medium': size === 'md',
          })}>
          {children}
        </StyledText>
      ) : (
        children
      )}
      {loading && <ActivityIndicator className="ml-3" size={'small'} />}
    </StyledButton>
  );
}
