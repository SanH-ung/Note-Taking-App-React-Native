export type SyncStatus = 'pending' | 'synced' | 'failed';

export type Note = {
  id: string;
  title: string;
  content: string;
  isFavorite: boolean;
  updatedAt: string;
  syncStatus: SyncStatus;
};