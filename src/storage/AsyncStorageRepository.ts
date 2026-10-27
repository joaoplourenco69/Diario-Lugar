import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageRepository<T extends { id: string }> {
  constructor(private readonly key: string) {}

  async getAll(): Promise<T[]> {
    const data = await AsyncStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  async saveAll(items: T[]): Promise<void> {
    await AsyncStorage.setItem(this.key, JSON.stringify(items));
  }
}
