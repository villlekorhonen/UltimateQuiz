import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, TextInput, Alert, Keyboard, Image, Animated, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { quizData } from './IlvesQuizData';
import * as SQLite from 'expo-sqlite';
import { LinearGradient } from 'expo-linear-gradient';

const db = SQLite.openDatabase('IlvesQuizDB.db');

export default function IlvesQuiz() {
    const navigation = useNavigation();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [name, setName] = useState('');
    const [highScores, setHighScores] = useState([]);
    const [questionCount, setQuestionCount] = useState(0);
    const [usedQuestions, setUsedQuestions] = useState([]);
    const [timer, setTimer] = useState(90);
    const [userAnswer, setUserAnswer] = useState('');
    const progress = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('create table if not exists highScoreIlves (id integer primary key autoincrement, name text, score integer);');
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
                    toValue: newTimer / 90,
                    duration: 1000,
                    useNativeDriver: false,
                }).start();
                return newTimer;
            });
        }, 1000);

        return () => clearInterval(interval);
    };

    const resetTimer = () => {
        setTimer(90);
        progress.setValue(1);
    };

    const handleTimeUp = () => {
        resetTimer();
        if (questionCount < 4) {
            setQuestionCount(prevCount => prevCount + 1);
            generateNextQuestion();
        } else {
            setShowScore(true);
        }
    };

    const handleAnswer = () => {
        const correctAnswer = quizData[currentQuestion]?.answer.trim();
        if (userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
            const points = Math.max(2000 - Math.floor((90 - timer) * (2000 / 90)), 0);
            setScore(prevscore => prevscore + points);
            console.log(points);
        }

        resetTimer();
        setQuestionCount(prevCount => prevCount + 1);
        setUserAnswer('');

        if (questionCount < 4) {
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
        navigation.navigate('Home of Ilves');
    };

    const giveUp = () => {
        setShowScore(false);
        backToHome();
    };

    const saveScore = () => {
        console.log('Save score:', name, score);
        db.transaction(tx => {
            tx.executeSql('insert into highScoreIlves (name, score) values (?, ?);', [name, score], (_, result) => {
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
            tx.executeSql('select * from highScoreIlves order by score desc;', [], (_, { rows }) => {
                console.log('Select result:', rows._array);
                const sortedScores = rows._array.sort((a, b) => b.score - a.score);
                setHighScores(sortedScores);
            });
        });
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <LinearGradient
                colors={['rgba(0,0,0,0.9)', 'transparent']}
                style={styles.background}
            />
            <Image style={styles.image} source={require('./images/ilves.png')} />
            <Text style={styles.guide}>Emojit viittaavat jääkiekkoa Ilveksessä pelanneiden pelaajien sukunimiin. Syötä koko nimi vastauskenttään!</Text>


            {showScore ? (
                <View>
                    <TouchableOpacity onPress={giveUp} style={styles.goHome}>
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
                    <TouchableOpacity onPress={giveUp} style={styles.giveUp}>
                        <Text style={styles.giveUpText}>Give up</Text>
                    </TouchableOpacity>
                    <View style={styles.timerBarContainer}>
                        <Animated.View style={[styles.timerBar, { transform: [{ scaleX: progress }] }]} />
                    </View>
                    <Text style={styles.question}>{quizData[currentQuestion]?.question}</Text>
                    <TextInput
                        placeholder="Write your answer here"
                        onChangeText={(text) => setUserAnswer(text)}
                        value={userAnswer}
                        style={styles.answerInput}
                        onSubmitEditing={handleAnswer}
                    />
                    <TouchableOpacity style={styles.answerButton} title="Answer" onPress={handleAnswer}>
                        <Text style={styles.answerButtonText}>Answer</Text>
                    </TouchableOpacity>

                </View>
            )}
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#015442',
        alignItems: 'center',
        justifyContent: 'center',
    },
    guide: {
        fontSize: 20,
        color: 'white',
        
        
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
    answerInput: {
        width: '100%',
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
    answerButton: {
        width: 200,
        height: 50,
        borderWidth: 2.5,
        borderColor: 'white',
        marginTop: 10,
        marginLeft: 50,
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
        marginLeft: 65,
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
        marginTop: -20,
        marginBottom: 20,
        width: 130,
        height: 130
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
    answerButtonText: {
        fontSize: 25,
        marginLeft: 55,
        marginTop: 5,
        fontWeight: '800',
    },
});
