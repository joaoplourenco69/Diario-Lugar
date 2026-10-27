import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen, { RootStackParamList } from '../screens/HomeScreen';
import NewPlaceScreen from '../screens/NewPlaceScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Diário de Lugares' }} />
      <Stack.Screen name="NewPlace" component={NewPlaceScreen} options={{ title: 'Novo lugar' }} />
    </Stack.Navigator>
  </NavigationContainer>;
}
