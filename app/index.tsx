import { ScrollView, StyleSheet, Text, TextInput, View, Image } from "react-native";
import getFilms from '@/api'
import { useState } from "react";
import result from '@/interface/ApiResponseInterfaces';
import { Link } from 'expo-router';
import { useAuth } from '@/app/auth/AuthProvider';
import AuthScreen from '@/app/auth/AuthScreen';
import 'react-native-get-random-values';

export default function Index() {
  const { user } = useAuth();
  const [keyword, setKeyword] = useState<string>('');
  const [results, setResults] = useState<result | null>(null);

  const handleSearch = async () => {
    const fetchedResults = await getFilms(keyword);
    setResults(fetchedResults);
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Введите название фильма!"
        onChangeText={setKeyword}
        onSubmitEditing={handleSearch}
      />
      {results ?
        <ScrollView>
          {results.films.map(film =>
            <View key={film.filmId} style={styles.cards}>
              <Image source={{ uri: film.posterUrl }} style={styles.imageFilm} />
              <Link
                href={{
                  pathname: '/films/[id]',
                  params: { id: film.filmId, title: film.nameRu }
                }}
                key={film.filmId}
                style={[styles.title, styles.link]}
              >
                <Text>{film.nameRu}</Text>
              </Link>
              <Text style={styles.text}>Год выхода фильма: {film.year}</Text>
              <Text style={styles.text}>Продолжительность фильма: {film.filmLength}</Text>
              <Text style={styles.text}>Оценка фильма: {film.rating}</Text>
            </View>
          )}
        </ScrollView>
        :
        <></>
      }
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    backgroundColor: '#fff',
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  cards: {
    margin: 25,
    paddingVertical: 25,
    backgroundColor: '#fff',
    borderRadius: 10,
    // Для iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Для Android
    elevation: 6,
  },
  imageFilm: {
    alignSelf: 'center',
    width: 200,
    height: 300
  },
  title: {
    margin: 15,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    marginHorizontal: 20,
    alignSelf: 'flex-start',
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});