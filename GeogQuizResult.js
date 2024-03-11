import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const db = SQLite.openDatabase('GeographyQuizDB.db');

export default function GeogQuizResult() {

    const navigation = useNavigation();

    const [highScores, setHighScores] = useState([]);

    useEffect(() => {
        db.transaction(tx => {
            tx.executeSql('create table if not exists highScoreGeo (id integer primary key autoincrement, name text, score integer);');
        }, null, updateList);
    }, []);

    const updateList = () => {
        db.transaction(tx => {
            tx.executeSql('select * from highScoreGeo order by score desc;', [], (_, { rows }) => {
                console.log('Select result:', rows._array);
                const sortedScores = rows._array.sort((a, b) => b.score - a.score);
                setHighScores(sortedScores);
                console.log('sorted score', sortedScores);
            });
        });
    }

    const deleteAllItems = () => {
        Alert.alert(
            '⚠️ Alert ⚠️',
            'Are you sure you want to delete whole scoreboard?',
            [
                {
                    text: 'NO',
                    style: 'cancel',
                },
                {
                    text: 'YES',
                    onPress: () => {
                        db.transaction(
                            tx => {
                                tx.executeSql(`delete from highScoreGeo;`, [], updateList);
                            },
                            null,
                            updateList
                        );
                    },
                },
            ],
            { cancelable: false }
        );
    };


    return (
        <View style={styles.container}>
            <LinearGradient

                colors={['rgba(0,0,0,0.9)', 'transparent']}
                style={styles.background}
            />

            <Image style={styles.image} source={require('./images/highscore.png')} />

            <TouchableOpacity onPress={deleteAllItems} style={styles.deleteButton}>
                <Text style={styles.deleteText}>Delete All</Text>
            </TouchableOpacity>
            <FlatList
                style={{ marginLeft: 0, backgroundColor: 'transparent' }}
                keyExtractor={(item, index) => index.toString()}
                data={highScores}
                renderItem={({ item, index }) => (
                    <View style={styles.scoreContainer}>
                        <Text style={styles.leader}>{index + 1}.      {item.name}       {item.score}</Text>
                    </View>

                )}
            />
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#015442',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white'
    },
    scoreContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',

    },
    leader: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 7,
        color: 'white'
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 450,
    },
    deleteButton: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#CE032E',
        backgroundColor: '#CE032E',
        width: 150,
        height: 40,
        borderRadius: 5,
    },
    deleteText: {
        color: 'white',
        fontSize: 20,
        marginLeft: 30,
        marginTop: 5
    },
    image: {

    }
});


