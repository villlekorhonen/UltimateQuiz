import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

export default function SportQuizHome() {


  const navigation = useNavigation();

  const QuizPress = () => {
    navigation.navigate('SportQuiz');
  }

  const ResultsPress = () => {
    navigation.navigate('SportResults');
  }


  return (
    <View style={styles.container}>
      <LinearGradient

        colors={['rgba(0,0,0,0.9)', 'transparent']}
        style={styles.background}
      />

      <Image style={styles.image} source={require('./images/Sport.png')} />

      <TouchableOpacity onPress={QuizPress} style={styles.button1}>
        <Text style={styles.buttonText1}> Play the Game </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={ResultsPress} style={styles.button2}>
        <Text style={styles.buttonText2}> Leaderboard </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#015442',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button1: {
    height: '6%',
    width: '50%',
    borderColor: 'white',
    borderWidth: 2,
    marginBottom: 15,
    marginRight: 70,
  },
  button2: {
    height: '6%',
    width: '50%',
    borderColor: 'white',
    borderWidth: 2,
    marginTop: 15,
    marginLeft: 70,
  },
  buttonText1: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    marginLeft: 15,
    marginTop: 3,
  },
  buttonText2: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    marginLeft: 20,
    marginTop: 3,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 450,
  },
  image: {
    marginTop: -200,
    marginBottom: 100,
    width: 250,
    height: 200
  },
});
