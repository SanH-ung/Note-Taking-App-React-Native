import React, { useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';
import NoteCard from '../components/NoteCard';
import { getNotes, deleteNote, toggleFavorite } from '../storage/noteStorage';
import { Note } from '../types/Note';

function HomeScreen({ navigation }: any) {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    loadNotes();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadNotes();
    }, [])
  );

  const loadNotes = async () => {
    const data = await getNotes();
    setNotes(data);
  };

  return (
    <View>
      <CustomButton
        title="Add Note"
        onPress={() => navigation.navigate('AddNote')}
      />

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ margin: 12 }}>No notes found.</Text>}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onDelete={() => deleteNote(item.id).then(loadNotes)}
            onEdit={() => navigation.navigate('EditNote', { note: item })}
            onToggleFavorite={() => toggleFavorite(item.id).then(loadNotes)}
          />
        )}
      />
    </View>
  );
}

export default HomeScreen;