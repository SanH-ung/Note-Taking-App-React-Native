import React from 'react';
import { View, Text } from 'react-native';
import CustomButton from '../components/CustomButton';
import { Note } from '../types/Note';

type Props = {
  note: Note;
  onDelete: () => void;
  onEdit: () => void;
  onToggleFavorite: () => void;
};

function NoteCard({ note, onDelete, onEdit, onToggleFavorite }: Props) {
  return (
    <View
      style={{
        marginHorizontal: 12,
        marginVertical: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 10,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: '700' }}>{note.title}</Text>
      <Text style={{ marginTop: 6 }}>{note.content}</Text>
      <Text style={{ marginTop: 8, color: '#666' }}>
        Sync: {note.syncStatus} | Favorite: {note.isFavorite ? 'Yes' : 'No'}
      </Text>
      <CustomButton title="Edit" onPress={onEdit} />
      <CustomButton
        title={note.isFavorite ? 'Unfavorite' : 'Favorite'}
        onPress={onToggleFavorite}
      />
      <CustomButton title="Delete" onPress={onDelete} />
    </View>
  );
}

export default NoteCard;