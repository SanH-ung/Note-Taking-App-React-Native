import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { updateNote } from '../storage/noteStorage';
import { Note } from '../types/Note';

function EditNoteScreen({ route, navigation }: any) {
  const { note } = route.params as { note: Note };
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Validation', 'Title and content cannot be empty.');
      return;
    }

    if (title.trim().length > 80) {
      Alert.alert('Validation', 'Title must be 80 characters or fewer.');
      return;
    }

    await updateNote(note.id, title, content);
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
      <CustomButton title="Update" onPress={handleUpdate} />
    </View>
  );
}

export default EditNoteScreen;