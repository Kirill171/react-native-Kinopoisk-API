import { useLocalSearchParams, useNavigation } from 'expo-router';
import { ScrollView, View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
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

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: title || 'Фильм',
      headerRight: () => (<View style={styles.titleIcons}>
        <TitleFavorite filmId={parseId} />
        <TitleLogout />
      </View>)

    });

    const fetchFilmDetails = async () => {
      if (id) {
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
    <ScrollView>
      <Image source={{ uri: film.posterUrl }} style={styles.imageFilm} />
      <Text style={styles.title}>О фильме {film.nameRu}</Text>
      <Text style={styles.text}><Text style={styles.boldText}>Описание фильма:</Text> {film.description}</Text>
      <Text style={styles.text}><Text style={styles.boldText}>Год производства:</Text> {film.year}</Text>
      <Text style={styles.text}><Text style={styles.boldText}>Страна:</Text> {film.countries.map((item) => item.country).join(', ')}</Text>
      <Text style={styles.text}><Text style={styles.boldText}>Жанр:</Text> {film.genres.map((item) => item.genre).join(', ')}</Text>
      <Text style={styles.text}><Text style={styles.boldText}>Слоган:</Text> "{film.slogan}"</Text>
      <Text style={styles.text}><Text style={styles.boldText}>Время:</Text> {film.filmLength} минут</Text>
      <Text style={styles.text}><Text style={styles.boldText}>Рейтинг MPAA:</Text> {film.ratingMpaa.toUpperCase()}</Text>
    </ScrollView>
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
    resizeMode: "stretch",
    width: '100%',
    height: 500,
  },
  title: {
    fontWeight: 'bold',
    margin: 15,
    fontSize: 24,
    textAlign: 'center',
    color: '#333',
  },
  titleIcons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
