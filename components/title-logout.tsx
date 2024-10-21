import { useAuth } from '@/app/auth/AuthProvider';
import { TouchableOpacity, Image } from 'react-native';
import { ImageSourcePropType } from 'react-native';


export default function TitleLogout() {
  const { user, logout } = useAuth();

  const exitIcon: ImageSourcePropType = require('@/assets/images/exit.png');

  const handleLogout = async () => {
    if (user) {
      await logout();
    } else {
      console.error('Пользователь не авторизован');
    }
  };


  return (
    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
      <Image style={{ width: 24, height: 24, }} source={exitIcon} />
    </TouchableOpacity>
  );
};