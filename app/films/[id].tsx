import { useLocalSearchParams, Stack } from 'expo-router';
import { ScrollView, View, Image, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { useEffect, useState } from 'react';

import { getFilmsById } from '@/api'
import { ResponseById } from '@/interface/ApiResponseInterfaces';
import TitleFavorite from '@/components/title-favorite';
import TitleLogout from '@/components/title-logout';

export default function FilmsScreen() {
  const [film, setFilm] = useState<ResponseById | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
  const parseId = Number(id);

  useEffect(() => {
    const fetchFilmDetails = async () => {
      if (parseId) {
        setLoading(true);
        try {
          const filmDetails = await getFilmsById(parseId);
          setFilm(filmDetails);
        } catch (error) {
          console.error('Error fetching film details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFilmDetails();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="black" style={styles.ActivityIndicator} />;
  }

  if (!film) {
    return <Text>Подробности о фильме отсутствуют.</Text>;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={{ width: 200 }}>
              <Text style={{ textAlign: 'left' }}>{title || 'Фильм'}</Text>
            </View>
          ),
          headerRight: () => (
            <View style={styles.titleIcons}>
              <TitleFavorite filmId={parseId} />
              <TitleLogout />
            </View>
          ),
        }}
      />
      <ScrollView>
        <Image source={{ uri: film.posterUrl }} style={styles.imageFilm} />
        <Text style={styles.title}>О фильме {film.nameRu}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Описание фильма:</Text> {film.description}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Год производства:</Text> {film.year}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Страна:</Text> {film.countries.map((item) => item.country).join(', ')}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Жанр:</Text> {film.genres.map((item) => item.genre).join(', ')}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Слоган:</Text> "{film.slogan}"</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Время:</Text> {Math.floor(film.filmLength / 60)} ч {film.filmLength % 60} мин</Text>
        {film.ratingMpaa && <Text style={styles.text}><Text style={styles.boldText}>Рейтинг MPAA:</Text> {film.ratingMpaa.toUpperCase()}</Text>}
        <Text style={styles.text}><Text style={styles.boldText}>Рейтинг кинокритиков:</Text> {film.ratingFilmCritics}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Оценок кинокритиков:</Text> {film.ratingFilmCriticsVoteCount}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Рейтинг IMDb:</Text> {film.ratingImdb}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>IMDb:</Text> {film.ratingImdbVoteCount} оценок</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Рейтинг фильма:</Text> {film.ratingKinopoisk}</Text>
        <Text style={styles.text}><Text style={styles.boldText}>Оценивших фильм:</Text> {film.ratingKinopoiskVoteCount}</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
  },
  ActivityIndicator: {
    margin: 50,
  },
  imageFilm: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: 250,
    height: 350,
  },
  title: {
    fontWeight: 'bold',
    margin: 15,
    fontSize: 24,
    textAlign: 'center',
    color: '#333',
  },
  titleIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 0,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  text: {
    marginHorizontal: 20,
    marginBottom: 20,
    alignSelf: 'flex-start',
    fontSize: 16,
    color: 'black',
  },
});
