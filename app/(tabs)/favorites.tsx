import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Parse from '@/config/parseConfig';
import { useAuth } from '@/app/auth/AuthProvider';
import { getFilmsById } from '@/api';
import { Link } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        setLoading(true);
        if (!user) {
          setLoading(false);
          setFavorites([]);
          return;
        }

        const query = new Parse.Query('Favorites');
        query.equalTo('userId', user.id);

        try {
          const results = await query.find();
          const filmIds = results.map((favorite) => favorite.get('filmId'));
          const filmDetails = await Promise.all(filmIds.map(id => getFilmsById(id)));

          const favoritesWithStatus = filmDetails.map((film, index) => ({
            ...film,
            status: results[index].get('status'),
            rating: results[index].get('rating'),
          }));

          setFavorites(favoritesWithStatus);
        } catch (error) {
          console.error('Ошибка при загрузке избранного:', error);
          Alert.alert('Ошибка', 'Не удалось загрузить избранные фильмы.');
        } finally {
          setLoading(false);
        }
      };

      fetchFavorites();
    }, [user])
  );

  const updateRating = async (filmId: number, newRating: number) => {
    if (!user) return;

    const query = new Parse.Query('Favorites');
    query.equalTo('userId', user.id);
    query.equalTo('filmId', filmId);

    try {
      const results = await query.find();
      if (results.length === 0) {
        Alert.alert('Ошибка', 'Фильм не найден в избранном.');
        return;
      }

      results.forEach(result => {
        result.set('rating', newRating);
      });
      await Parse.Object.saveAll(results);
      setFavorites(prev => prev.map(film =>
        film.kinopoiskId === filmId ? { ...film, rating: newRating } : film
      ));
    } catch (error) {
      console.error('Ошибка при обновлении рейтинга:', error);
      Alert.alert('Ошибка', 'Не удалось обновить рейтинг фильма.');
    }
  };

  const removeFromFavorites = async (filmId: number) => {
    if (!user) return;

    const query = new Parse.Query('Favorites');
    query.equalTo('userId', user.id);
    query.equalTo('filmId', filmId);

    try {
      const results = await query.find();
      if (results.length === 0) {
        Alert.alert('Ошибка', 'Фильм не найден в избранном.');
        return;
      }

      await Parse.Object.destroyAll(results);
      setFavorites((prev) => prev.filter((film) => film.kinopoiskId !== filmId));
      Alert.alert('Успех', 'Фильм удален из избранного');
    } catch (error) {
      console.error('Ошибка при удалении из избранного:', error);
      Alert.alert('Ошибка', 'Не удалось удалить фильм из избранного.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="black" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {!user && (
          <View style={styles.clearFavorites}>
            <Text style={styles.emptyText}>Для начала войдите в аккаунт.</Text>
          </View>
        )}
        {user && favorites.length === 0 && (
          <Text style={styles.emptyText}>Ваш список избранного пуст.</Text>
        )}
        {user && favorites.map((film) => (
          <View key={film.kinopoiskId} style={styles.card}>
            <Image source={{ uri: film.posterUrl }} style={styles.image} />
            <View style={styles.details}>
              <Link
                href={{
                  pathname: '/films/[id]',
                  params: { id: film.kinopoiskId, title: film.nameRu }
                }}
                key={film.filmId}
                style={styles.link}
              >
                <Text style={styles.title}>{film.nameRu}</Text>
              </Link>
              <View style={styles.statusContainer}>
                <Text style={styles.status}>Статус: {film.status}</Text>
              </View>
              {film.status === 'Посмотрено' && (
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <TouchableOpacity key={star} onPress={() => updateRating(film.kinopoiskId, star)}>
                      <Text style={styles.star}>{star <= (film.rating || 0) ? '⭐' : '☆'}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            <TouchableOpacity onPress={() => removeFromFavorites(film.kinopoiskId)} style={styles.removeButton}>
              <Text style={styles.removeText}>Удалить</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    margin: 50,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'black',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
    height: 150,
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  details: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  statusContainer: {
    flex: 1,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  star: {
    fontSize: 24,
  },
  removeButton: {
    height: 50,
    alignSelf: 'center',
    padding: 25,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4444',
    borderRadius: 5,
    paddingVertical: 4,
  },
  removeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  link: {
    justifyContent: 'flex-start',
    textAlign: 'center',
    maxHeight: 50,
  },
  clearFavorites: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
