import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const navigation = useNavigation();

  const SportQuizPress = () => {
    navigation.navigate('Home of Sport');
  }

  const MovieQuizPress = () => {
    navigation.navigate('Home of Movies');
  }

  const GeometriaQuizPress = () => {
    navigation.navigate('Home of Geography');
  }

  const IlvesQuizPress = () => {
    navigation.navigate('Home of Ilves');
  }
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(0,0,0,0.9)', 'transparent']}
        style={styles.background}
      />

      <Image style={styles.image} source={require('./images/ULTIMATE_LOGO.png')} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={SportQuizPress} style={styles.button}>
        <Image source={require('./images/Sport.png')} style={styles.imageButton} />
          <Text style={styles.buttonText}> Sport </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={MovieQuizPress} style={styles.button}>
        <Image source={require('./images/movies.png')} style={styles.imageButton} />
          <Text style={styles.buttonText}> Movies </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={GeometriaQuizPress} style={styles.button}>
          <Image source={require('./images/Geography.png')} style={styles.imageButton} />
          <Text style={styles.buttonText}> Geography </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={IlvesQuizPress} style={styles.button}>
        <Image source={require('./images/ilves.png')} style={styles.imageButton1} />
          <Text style={styles.buttonText}> Ilves </Text>
        </TouchableOpacity>
      </View>
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
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  button: {
    flex: 1,
    height: 110,
    marginHorizontal: 25,
    borderColor: 'white',
    borderWidth: 2,
    marginTop: 30,
    borderRadius: 10,
    position: 'relative', // Lisätty
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 3,
    position: 'absolute', // Lisätty
    bottom: -30, // Säädetty teksti napin alapuolelle
    left: 0,
    right: 0,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 450,
  },
  image: {
    marginTop: -120,
    marginBottom: 10,
  },
  imageButton: {
    height: '95%',
    width: '95%',
    position: 'absolute',
    marginTop: 3,
    marginLeft: 3,
  },
  imageButton1: {
    height: '100%',
    width: '85%',
    position: 'absolute',
    marginTop: 1,
    marginLeft: 11,
  },
  
});
