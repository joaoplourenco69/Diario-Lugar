import { AsyncStorageRepository } from '../storage/AsyncStorageRepository';
import { NewPlace, Place } from '../types';

const storage = new AsyncStorageRepository<Place>('diario-de-lugares:places');

export class PlaceRepository {
  async list(): Promise<Place[]> {
    const places = await storage.getAll();
    return places.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async create(data: NewPlace): Promise<Place> {
    if (!data.title.trim()) throw new Error('Informe um título.');
    if (!data.comment.trim()) throw new Error('Escreva um comentário.');

    const hasPhoto = data.photoUri !== null;
    const hasLocation = data.latitude !== null && data.longitude !== null;
    if (!hasPhoto && !hasLocation) {
      throw new Error('Tire uma foto ou obtenha a localização antes de salvar.');
    }

    const place: Place = {
      ...data,
      id: `${Date.now()}-${Math.random()}`,
      createdAt: new Date().toISOString(),
    };
    await storage.saveAll([place, ...(await storage.getAll())]);
    return place;
  }

  async remove(id: string): Promise<void> {
    const places = await storage.getAll();
    await storage.saveAll(places.filter((place) => place.id !== id));
  }
}

export const placeRepository = new PlaceRepository();
