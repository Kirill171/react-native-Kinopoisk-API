const axios = require('axios').default;
import result, { ResponseById } from '@/interface/ApiResponseInterfaces'

const API_KEY = '31f21f04-bd0c-4829-bf4c-0902dae35cbb';

export default async function getFilms(keyword: string): Promise<result | null> {
  try {
    const response = await axios.get('https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword', {
      params: {
        keyword: keyword,
      },
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}


export async function getFilmsById(id: number): Promise<ResponseById | null> {
  try {
    const response = await axios.get(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}`, {
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}