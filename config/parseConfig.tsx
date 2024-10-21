import Parse from 'parse/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APPLICATION_ID, JAVASCRIPT_KEY, SERVER_URL } from '@/config';

Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(APPLICATION_ID, JAVASCRIPT_KEY);
Parse.serverURL = SERVER_URL;

export default Parse;