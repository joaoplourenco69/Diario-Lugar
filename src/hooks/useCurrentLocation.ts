import { useState } from 'react';
import * as Location from 'expo-location';

type LocationStatus = 'idle' | 'loading' | 'ready' | 'error';
const TIME_LIMIT = 20000;

export function useCurrentLocation() {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(null);
  const [error, setError] = useState('');

  async function getLocation() {
    setStatus('loading');
    setError('');

    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') throw new Error('Permissão de localização negada.');

      const location = await Promise.race([
        Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('A localização demorou demais.')), TIME_LIMIT)),
      ]);

      setCoords(location.coords);
      setStatus('ready');
    } catch (locationError) {
      setError(locationError instanceof Error ? locationError.message : 'Erro ao obter localização.');
      setStatus('error');
    }
  }

  return { status, coords, error, getLocation };
}
