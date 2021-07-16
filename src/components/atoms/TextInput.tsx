import React from 'react';
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  StyleProp,
  TextStyle,
  ColorValue,
} from 'react-native';

interface Props extends TextInputProps {
  placeholder?: string;
  style?: StyleProp<TextStyle>;
  placeholderTextColor?: ColorValue;
}

const TextInputComponent: React.FC<Props> = ({
  placeholder,
  placeholderTextColor,
  style,
  ...props
}) => {
  return (
    <TextInput
      placeholder={placeholder || 'Type here'}
      placeholderTextColor={placeholderTextColor || '#d2d2d2'}
      style={[styles.container, style]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#adadad',
    paddingHorizontal: 16,
  },
});

export default TextInputComponent;
