import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => any | void;
  disabled?: boolean;
  useDisabledStyle?: boolean;
}

const ButtonComponent: React.FC<Props> = ({
  style,
  textStyle,
  leftIcon,
  rightIcon,
  label,
  onPress,
  disabled,
  useDisabledStyle = true,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        style,
        useDisabledStyle && disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}>
      {leftIcon}
      <Text style={[styles.label, textStyle]}>{label}</Text>
      {rightIcon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#2e5dea',
    borderRadius: 8,
  },
  disabled: {
    backgroundColor: '#adadad',
  },
  label: {
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
});

export default ButtonComponent;
