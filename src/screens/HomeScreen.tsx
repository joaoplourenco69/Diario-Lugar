import { useCallback, useState } from 'react';
import { Button, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PlaceList from '../components/PlaceList';
import { placeRepository } from '../models/PlaceRepository';
import { Place } from '../types';

export type RootStackParamList = { Home: undefined; NewPlace: undefined };
type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPlaces = useCallback(async () => {
    setLoading(true);
    setPlaces(await placeRepository.list());
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => { loadPlaces(); }, [loadPlaces]));

  async function deletePlace(id: string) {
    await placeRepository.remove(id);
    loadPlaces();
  }

  return <View style={styles.screen}>
    <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={loadPlaces} />} contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>Seus lugares ficam salvos no celular.</Text>
      <Button title="Novo registro" onPress={() => navigation.navigate('NewPlace')} />
      <Text style={styles.heading}>Registros</Text>
      <PlaceList places={places} onDelete={deletePlace} />
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#f3f3f3', flex: 1 }, content: { padding: 16 },
  subtitle: { color: '#555', marginBottom: 16 }, heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, marginTop: 24 },
});
