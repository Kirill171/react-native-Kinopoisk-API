import { Stack } from "expo-router";
import { AuthProvider } from '@/app/auth/AuthProvider';
import HeaderRight from '@/components/Header'

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: 'Фильмы',
            headerLeft: () => <></>,
            headerRight: () => <HeaderRight />,
          }}
        />
        <Stack.Screen
          name="+not-found"
          options={{
            title: "Уупс! Это страница не найдена.",
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
