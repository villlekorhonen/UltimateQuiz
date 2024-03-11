import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, Keyboard, Image, Animated } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { quizData } from './MoviesQuizData';
import * as SQLite from 'expo-sqlite';
import { LinearGradient } from 'expo-linear-gradient';

const db = SQLite.openDatabase('MovieQuizDB.db');

export default function MoviesQuiz() {
    const navigation = useNavigation();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [name, setName] = useState('');
    const [highScores, setHighScores] = useState([]);
    const [questionCount, setQuestionCount] = useState(0);
    const [usedQuestions, setUsedQuestions] = useState([]);
    const [timer, setTimer] = useState(10);
    const progress = useRef(new Animated.Value(1)).current; 

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('create table if not exists highScoreMovies (id integer primary key autoincrement, name text, score integer);');
        }, null, updateList);
        generateNextQuestion();
        startTimer();
    }, []);

    useEffect(() => {
        if (timer === 0) {
            handleTimeUp();
        }
    }, [timer]);

    const startTimer = () => {
        const interval = setInterval(() => {
            setTimer(prevTimer => {
                const newTimer = prevTimer - 1;
                Animated.timing(progress, {
                    toValue: newTimer / 10,
                    duration: 1000,
                    useNativeDriver: false,
                }).start();
                return newTimer;
            });
        }, 1000);

        return () => clearInterval(interval);
    };

    const resetTimer = () => {
        setTimer(10);
        progress.setValue(1);
    };

    const handleTimeUp = () => {
        resetTimer();
        if (questionCount < 14) { 
            setQuestionCount(prevCount => prevCount + 1);
            generateNextQuestion();
        } else {
            setShowScore(true);
        }
    };

    const handleAnswer = (selectedAnswer) => {
        const answer = quizData[currentQuestion]?.answer;
        if (answer === selectedAnswer) {
            const points = Math.max(1000 - (10 - timer) * 100, 0);
            setScore(prevscore => prevscore + points);
            console.log(points);
        }

        resetTimer();
        setQuestionCount(prevCount => prevCount + 1);

        if (questionCount < 14) {
            generateNextQuestion();
        } else {
            setShowScore(true);
        }
    };

    const generateNextQuestion = () => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * quizData.length);
        } while (usedQuestions.includes(randomIndex));
        setCurrentQuestion(randomIndex);
        setUsedQuestions([...usedQuestions, randomIndex]);
    };

    const backToHome = () => {
        navigation.navigate('Home of Movies');
    };

    const giveUp = () => {
        setShowScore(false);
        backToHome();
    };

    const saveScore = () => {
        console.log('Save score:', name, score);
        db.transaction(tx => {
            tx.executeSql('insert into highScoreMovies (name, score) values (?, ?);', [name, score], (_, result) => {
                console.log('insert result:', result);
                Keyboard.dismiss();
                Alert.alert("Your score has saved!")
                setShowScore(false);
                backToHome();
            });
        }, null, updateList);
    };

    const updateList = () => {
        db.transaction(tx => {
            tx.executeSql('select * from highScoreMovies order by score desc;', [], (_, { rows }) => {
                console.log('Select result:', rows._array);
                const sortedScores = rows._array.sort((a, b) => b.score - a.score);
                setHighScores(sortedScores);
            });
        });
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['rgba(0,0,0,0.9)', 'transparent']}
                style={styles.background}
            />
            <Image style={styles.image} source={require('./images/movies.png')} />
            

            {showScore ? (
                <View>
                    <TouchableOpacity  onPress={giveUp} style={styles.goHome}>
                            <Text style={styles.goHomeText}>Home</Text>
                        </TouchableOpacity>
                    <Text style={styles.result}>Your</Text>
                    <Text style={styles.result1}>Score:</Text>
                    <Text style={styles.result2}>{score}</Text>
                    <TextInput
                        placeholder="Name"
                        onChangeText={(text) => setName(text)}
                        value={name}
                        style={styles.nameInput}
                        onSubmitEditing={saveScore}
                    />
                    <TouchableOpacity style={styles.scoreButton} title="Tallenna tulos" onPress={saveScore}>
                        <Text style={styles.saveButton}> Save score </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                
                <View style={styles.questionContainer}>
                    <TouchableOpacity  onPress={giveUp} style={styles.giveUp}>
                            <Text style={styles.giveUpText}>Give up</Text>
                        </TouchableOpacity>
                    <Text style={styles.question}>{quizData[currentQuestion]?.question}</Text>
                    {quizData[currentQuestion]?.options.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => handleAnswer(item)} style={styles.optionContainer}>
                            <Text style={styles.optionStyle}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                    <View style={styles.timerBarContainer}>
                        <Animated.View style={[styles.timerBar, { transform: [{ scaleX: progress }] }]} />
                    </View>
                    

                </View>
            )}
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
    questionContainer: {
        backgroundColor: 'transparent',
        padding: 30,
        margin: 10,
        borderRadius: 5,
        fontSize: 28,
        width: '100%',
    },
    question: {
        fontSize: 25,
        color: 'white',
        fontWeight: '800',
    },
    optionStyle: {
        color: 'white',
        padding: 8,
        alignItems: 'center',
        fontSize: 18,
        fontWeight: '500',
    },
    optionContainer: {
        borderColor: 'white',
        borderWidth: 2,
        marginTop: 15,
    },
    nameInput: {
        width: 200,
        height: 50,
        borderWidth: 0.5,
        borderColor: 'white',
        fontSize: 24,
        marginBottom: 10,
        color: 'white',
        marginTop: 10,
        backgroundColor: 'lightgrey',
    },
    scoreButton: {
        width: 200,
        height: 50,
        borderWidth: 2.5,
        borderColor: 'white',
        marginTop: 10,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    saveButton: {
        fontSize: 25,
        marginLeft: 30,
        marginTop: 5,
        fontWeight: '500',
    },
    result: {
        fontSize: 35,
        marginTop: 40,
        marginLeft: 65,
        color: 'white',
    },
    result1: {
        fontSize: 35,
        marginBottom: 10,
        marginLeft: 55,
        color: 'white',
    },
    result2: {
        fontSize: 40,
        fontWeight: 'bold',
        marginLeft: 67,
        color: 'white',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 450,
    },
    image: {
        marginTop: 0,
        marginBottom: 0,
        width: 150,
        height: 150
    },
    timerBarContainer: {
        width: '100%',
        height: 20,
        backgroundColor: 'white',
        marginTop: 10,
    },
    timerBar: {
        height: '100%',
        backgroundColor: 'green',
    },
    giveUp: {
        width: 50,
        height: 50,
        borderColor: 'white',
        borderWidth: 2,
        marginTop: 5,
        borderRadius: 200,
        marginTop: -20,
        backgroundColor: 'salmon',
        marginBottom: 20,
        marginLeft: 120
    },
    giveUpText: {
        fontSize: 14,
        marginLeft: 9,
        marginTop: 3,
        fontWeight: '500',
        color: 'white',
    },
    goHome: {
        width: 52,
        height: 52,
        borderColor: 'white',
        borderWidth: 2,
        marginTop: 5,
        borderRadius: 200,
        backgroundColor: 'salmon',
        marginLeft: 80
        
    },
    goHomeText: {
        fontSize: 16,
        marginLeft: 2,
        marginTop: 11,
        fontWeight: '500',
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
});
