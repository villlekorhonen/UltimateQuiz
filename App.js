import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import SportQuizHome from './SportQuizHome';
import SportQuizResult from './SportQuizResult';
import SportQuiz from './SportQuiz'
import MoviesQuiz from './MoviesQuiz';
import MoviesQuizHome from './MoviesQuizHome';
import MoviesQuizResult from './MoviesQuizResult';
import GeogQuiz from './GeogQuiz';
import GeogQuizHome from './GeogQuizHome';
import GeogQuizResult from './GeogQuizResult';
import IlvesQuiz from './IlvesQuiz';
import IlvesQuizHome from './IlvesQuizHome';
import IlvesQuizResult from './IlvesQuizResult';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor: 'white',

      }} >

        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Home of Sport" component={SportQuizHome} />
        <Stack.Screen name="SportQuiz" component={SportQuiz} />
        <Stack.Screen name="SportResults" component={SportQuizResult} />
        <Stack.Screen name="Home of Movies" component={MoviesQuizHome} />
        <Stack.Screen name="MoviesResults" component={MoviesQuizResult} />
        <Stack.Screen name="MoviesQuiz" component={MoviesQuiz} />
        <Stack.Screen name="GeographyQuiz" component={GeogQuiz} />
        <Stack.Screen name="GeographyResults" component={GeogQuizResult} />
        <Stack.Screen name="Home of Geography" component={GeogQuizHome} />
        <Stack.Screen name="IlvesQuiz" component={IlvesQuiz} />
        <Stack.Screen name="IlvesResults" component={IlvesQuizResult} />
        <Stack.Screen name="Home of Ilves" component={IlvesQuizHome} />

        

      </Stack.Navigator>
      <StatusBar style="light" backgroundColor="black" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
