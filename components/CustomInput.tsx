import React from 'react';
import { TextInput } from 'react-native';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
};

function CustomInput({
  value,
  onChangeText,
  placeholder = 'Enter text...',
  multiline = false,
}: Props) {
  return (
    <TextInput
      style={{
        borderWidth: 1,
        borderColor: '#cfd8dc',
        marginHorizontal: 12,
        marginVertical: 8,
        padding: 10,
        borderRadius: 8,
        minHeight: multiline ? 110 : 44,
        textAlignVertical: multiline ? 'top' : 'center',
      }}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      multiline={multiline}
    />
  );
}

export default CustomInput;