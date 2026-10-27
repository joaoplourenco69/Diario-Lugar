import { Alert, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import PlaceForm from '../components/PlaceForm';
import { placeRepository } from '../models/PlaceRepository';
import { NewPlace } from '../types';
import { RootStackParamList } from './HomeScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'NewPlace'>;

export default function NewPlaceScreen({ navigation }: Props) {
  async function savePlace(place: NewPlace) {
    try {
      await placeRepository.create(place);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Não foi possível salvar', error instanceof Error ? error.message : 'Tente novamente.');
    }
  }

  return <View style={styles.screen}><PlaceForm onSave={savePlace} /></View>;
}

const styles = StyleSheet.create({ screen: { backgroundColor: '#fff', flex: 1 } });
