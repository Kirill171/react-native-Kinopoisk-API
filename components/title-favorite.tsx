import { useAuth } from '@/app/auth/AuthProvider';
import { TouchableOpacity, Image, Alert, ActivityIndicator, Modal, View, Text, StyleSheet } from 'react-native';
import { ImageSourcePropType } from 'react-native';
import Parse from '@/config/parseConfig';
import { useEffect, useState, useCallback } from 'react';

const favoriteIcon: ImageSourcePropType = require('@/assets/images/favorite.png');
const favoriteActiveIcon: ImageSourcePropType = require('@/assets/images/favorite-active.png');

interface TitleFavoriteProps {
  filmId: number;
}

export default function TitleFavorite({ filmId }: TitleFavoriteProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const checkIfFavorite = useCallback(async () => {
    if (!user) return;

    const query = new Parse.Query("Favorites");
    query.equalTo("userId", user.id);
    query.equalTo("filmId", filmId);

    try {
      const results = await query.find();
      setIsFavorite(results.length > 0);
    } catch (error) {
      console.error('Ошибка при проверке избранного:', error);
    }
  }, [user, filmId]);

  useEffect(() => {
    if (user) {
      checkIfFavorite();
    }
  }, [user, checkIfFavorite]);

  const toggleFavorite = async (isAdding: boolean, selectedStatus: string | null) => {
    if (!user) {
      return;
    }

    setLoading(true);
    const Favorite = new Parse.Object("Favorites");

    if (isAdding) {
      Favorite.set("userId", user.id);
      Favorite.set("filmId", filmId);
      Favorite.set("status", selectedStatus);

      try {
        const existingQuery = new Parse.Query("Favorites");
        existingQuery.equalTo("userId", user.id);
        existingQuery.equalTo("filmId", filmId);
        const existingResults = await existingQuery.find();

        if (existingResults.length === 0) {
          await Favorite.save();
          setIsFavorite(true);
        }
      } catch (error) {
        console.error('Ошибка при добавлении в избранное:', error);
      }
    } else {
      const query = new Parse.Query("Favorites");
      query.equalTo("userId", user.id);
      query.equalTo("filmId", filmId);

      try {
        const results = await query.find();

        if (results.length > 0) {
          await Parse.Object.destroyAll(results);
          setIsFavorite(false);
        }
      } catch (error) {
        console.error('Ошибка при удалении из избранного:', error);
      }
    }

    setLoading(false);
  };

  const handleFavoriteToggle = () => {
    if (loading) return;

    if (isFavorite) {
      toggleFavorite(false, null);
    } else {
      setModalVisible(true);
    }
  };

  const handleStatusSelect = (selectedStatus: string) => {
    setModalVisible(false);
    toggleFavorite(true, selectedStatus);
  };

  return (
    <TouchableOpacity onPress={handleFavoriteToggle} style={{ marginRight: 15 }}>
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <Image
          style={{ marginRight: 10, width: 24, height: 24 }}
          source={isFavorite ? favoriteActiveIcon : favoriteIcon}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Выберите статус</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleStatusSelect('Посмотрено')}>
              <Text style={styles.buttonText}>Посмотрено</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleStatusSelect('Смотрю')}>
              <Text style={styles.buttonText}>Смотрю</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleStatusSelect('Посмотрю')}>
              <Text style={styles.buttonText}>Посмотрю</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#dc3545',
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
