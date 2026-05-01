import React, { useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import NoteCard from '../components/NoteCard';
import {
  deleteNote,
  getFavoriteNotes,
  toggleFavorite,
} from '../storage/noteStorage';
import { Note } from '../types/Note';

function FavoritesScreen({ navigation }: any) {
  const [notes, setNotes] = useState<Note[]>([]);

  const loadFavorites = async () => {
    const data = await getFavoriteNotes();
    setNotes(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  return (
    <View>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ margin: 12 }}>No favorite notes yet.</Text>
        }
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onDelete={() => deleteNote(item.id).then(loadFavorites)}
            onEdit={() => navigation.navigate('EditNote', { note: item })}
            onToggleFavorite={() => toggleFavorite(item.id).then(loadFavorites)}
          />
        )}
      />
    </View>
  );
}

export default FavoritesScreen;
