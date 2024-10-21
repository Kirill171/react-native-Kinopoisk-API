import { Link } from 'expo-router';
import { View, StyleSheet } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      {/* <Stack.Screen options={{ title: "Уупс! Эта страница не найдена." }} />
       ------------------------------ Это имба ебанная -------------------------
       */}
      <View style={styles.container}>
        <Link href="/">Страница не найдена</Link>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
