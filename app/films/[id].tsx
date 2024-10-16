import { useLocalSearchParams, useNavigation } from 'expo-router';
import { ScrollView, View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { getFilmsById } from '@/api'
import { ResponseById } from '@/interface/ApiResponseInterfaces';

type Props = {
  id: string;
  title: string;
}

export default function FilmsScreen() {
  const [film, setFilm] = useState<ResponseById | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id, title }: Props = useLocalSearchParams();
  const parseId = Number(id);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: title || 'Фильм' });

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
      <Text style={styles.title}> О фильме {film.nameRu} </Text>
      <View style={styles.row}>
        <Text style={styles.label}>Описание фильма:</Text>
        <Text style={styles.value}>{film.description}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Год производства:</Text>
        <Text style={styles.value}>{film.year}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Страна:</Text>
        <Text style={styles.value}>{film.countries.map((item, index) => (
          <Text key={index}>
            {item.country}{index < film.countries.length - 1 ? ', ' : ''}
          </Text>
        ))}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Жанр:</Text>
        <Text style={styles.value}>{film.genres.map((item, index) => (
          <Text key={index}>
            {item.genre}{index < film.genres.length - 1 ? ', ' : ''}
          </Text>
        ))}
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Слоган:</Text>
        <Text style={styles.value}>{film.slogan}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Время:</Text>
        <Text style={styles.value}>{film.filmLength} минут</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Рейтинг MPAA:</Text>
        <Text style={styles.value}>{film.ratingMpaa.toUpperCase()}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  },
  text: {
    marginHorizontal: 20,
    alignSelf: 'flex-start',
    fontSize: 16,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  label: {
    flex: 0.3,
    fontWeight: 'bold',
    fontSize: 16,
  },
  value: {
    marginLeft: 10,
    flex: 0.7,
    fontSize: 16,
  },
});
