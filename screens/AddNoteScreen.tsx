import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { saveNote } from '../storage/noteStorage';

function AddNoteScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Validation', 'Title and content cannot be empty.');
      return;
    }

    if (title.trim().length > 80) {
      Alert.alert('Validation', 'Title must be 80 characters or fewer.');
      return;
    }

    await saveNote(title, content);
    navigation.goBack();
  };

  return (
    <View>
      <CustomInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
      />
      <CustomInput
        value={content}
        onChangeText={setContent}
        placeholder="Content"
        multiline
      />
      <CustomButton title="Save" onPress={handleSave} />
    </View>
  );
}

export default AddNoteScreen;