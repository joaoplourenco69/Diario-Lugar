export type Place = {
  id: string;
  title: string;
  comment: string;
  photoUri: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
};

export type NewPlace = Omit<Place, 'id' | 'createdAt'>;
