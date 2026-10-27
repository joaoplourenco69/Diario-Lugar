import { useRef, useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { NewPlace } from '../types';

type Props = { onSave: (place: NewPlace) => Promise<void> };

export default function PlaceForm({ onSave }: Props) {
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const location = useCurrentLocation();

  async function takePhoto() {
    if (!cameraRef.current || !cameraReady) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
    if (photo?.uri) setPhotoUri(photo.uri);
  }

  async function save() {
    setSaving(true);
    try {
      await onSave({
        title, comment, photoUri,
        latitude: location.coords?.latitude ?? null,
        longitude: location.coords?.longitude ?? null,
      });
    } finally { setSaving(false); }
  }

  return <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.label}>Título</Text>
    <TextInput value={title} onChangeText={setTitle} placeholder="Ex.: Praça da Liberdade" style={styles.input} />
    <Text style={styles.label}>Comentário</Text>
    <TextInput value={comment} onChangeText={setComment} placeholder="O que você achou deste lugar?" multiline style={[styles.input, styles.commentInput]} />

    <Text style={styles.label}>Foto</Text>
    {!permission ? <Text style={styles.text}>Verificando câmera...</Text> : !permission.granted ? <View style={styles.permission}>
      <Text style={styles.text}>A câmera registra uma foto do lugar.</Text>
      <Button title="Permitir câmera" onPress={requestPermission} />
    </View> : <>
      {photoUri
        ? <Image source={{ uri: photoUri }} style={styles.preview} />
        : <CameraView ref={cameraRef} style={styles.camera} onCameraReady={() => setCameraReady(true)} />}
      {photoUri
        ? <Button title="Tirar outra foto" onPress={() => { setPhotoUri(null); setCameraReady(false); }} />
        : <Button title="Tirar foto" onPress={takePhoto} disabled={!cameraReady} />}
    </>}

    <View style={styles.locationBox}>
      <Text style={styles.label}>Localização</Text>
      {location.coords
        ? <Text>{location.coords.latitude.toFixed(5)}, {location.coords.longitude.toFixed(5)}</Text>
        : <Text style={styles.text}>Nenhuma localização obtida.</Text>}
      <Button title={location.status === 'loading' ? 'Obtendo...' : 'Obter localização'} onPress={location.getLocation} disabled={location.status === 'loading'} />
      {location.error ? <Text style={styles.error}>{location.error}</Text> : null}
    </View>
    <Button title={saving ? 'Salvando...' : 'Salvar lugar'} onPress={save} disabled={saving} />
  </ScrollView>;
}

const styles = StyleSheet.create({
  container: { padding: 16 }, permission: { alignItems: 'center', padding: 24 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, marginTop: 10 },
  input: { borderColor: '#bbb', borderRadius: 6, borderWidth: 1, padding: 10 }, commentInput: { minHeight: 80, textAlignVertical: 'top' },
  camera: { backgroundColor: '#ddd', height: 230, marginBottom: 8 }, preview: { height: 230, marginBottom: 8, width: '100%' },
  locationBox: { borderTopColor: '#ddd', borderTopWidth: 1, marginTop: 18, paddingTop: 8 }, text: { color: '#555', marginBottom: 10, textAlign: 'center' }, error: { color: '#b33a3a', marginTop: 8 },
});
