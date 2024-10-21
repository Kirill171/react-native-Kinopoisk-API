import { Stack } from "expo-router";
import { AuthProvider } from '@/app/auth/AuthProvider';
import HeaderRight from '@/components/title-logout'

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            title: 'Фильмы',
            headerShown: false,
            headerLeft: () => <></>,
            headerRight: () => <HeaderRight />,
          }}
        />
        <Stack.Screen
          name="+not-found"
          options={{
            title: "Уупс! Эта страница не найдена.",
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
