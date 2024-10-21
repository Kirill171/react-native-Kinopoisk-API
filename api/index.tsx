import Result, { ResponseById } from '@/interface/ApiResponseInterfaces';
import { API_KEY } from '@/config';
const axios = require('axios').default;



export default async function getFilms(keyword: string): Promise<Result | null> {
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
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}