import { Button, Image, StyleSheet, Text, View } from 'react-native';
import { Place } from '../types';

type Props = { places: Place[]; onDelete: (id: string) => void };

export default function PlaceList({ places, onDelete }: Props) {
  if (places.length === 0) return <Text style={styles.empty}>Nenhum lugar salvo ainda.</Text>;

  return <View>
    {places.map((place) => <View key={place.id} style={styles.card}>
      {place.photoUri ? <Image source={{ uri: place.photoUri }} style={styles.photo} /> : null}
      <View style={styles.info}>
        <Text style={styles.title}>{place.title}</Text>
        <Text style={styles.comment}>{place.comment}</Text>
        {place.latitude !== null && place.longitude !== null
          ? <Text style={styles.coords}>{place.latitude.toFixed(5)}, {place.longitude.toFixed(5)}</Text>
          : <Text style={styles.coords}>Sem localização</Text>}
        <Button title="Apagar" onPress={() => onDelete(place.id)} color="#b33a3a" />
      </View>
    </View>)}
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 8, elevation: 2, flexDirection: 'row', marginBottom: 12, padding: 10 },
  photo: { borderRadius: 6, height: 100, marginRight: 12, width: 100 },
  info: { flex: 1 }, title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  comment: { color: '#444', marginBottom: 6 }, coords: { color: '#666', fontSize: 12, marginBottom: 6 },
  empty: { color: '#666', textAlign: 'center' },
});
