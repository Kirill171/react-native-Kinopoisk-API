import { useAuth } from '@/app/auth/AuthProvider';
import { TouchableOpacity, Text } from 'react-native';


export default function HeaderRight() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (user) {
      await logout();
    } else {
      console.error('Пользователь не авторизован');
    }
  };


  return (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
      <Text style={{ color: '#007BFF', fontSize: 16 }}>Logout</Text>
    </TouchableOpacity>
  );
};