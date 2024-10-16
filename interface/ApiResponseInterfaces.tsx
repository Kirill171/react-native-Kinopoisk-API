export default interface Response {
  films: Film[];
  keyword: string;
  searchFilmsCountResult: number;
}

interface Film {
  countries: Countries[],
  genres: Genres[],
  filmId: number,
  description: string,
  filmLength: string,
  nameEn: string,
  nameRu: string,
  posterUrl: string,
  posterUrlPreview: string,
  rating: string,
  ratingVoteCount: number,
  type: string,
  year: string,
}

interface Countries {
  country: string,
}

interface Genres {
  genre: string,
}

export interface ResponseById {
  countries: Countries[],
  genres: Genres[],
  filmId: number,
  nameOriginal: string,
  nameEn: string,
  nameRu: string,
  slogan: string,
  description: string,
  shortDescription: string,
  filmLength: number,
  posterUrl: string,
  posterUrlPreview: string,
  coverUrl: string,
  type: string,
  year: string,
  startYear: string,
  endYear: string,
  completed: boolean,
  has3D: boolean,
  hasImax: boolean,
  reviewsCount: number,
  serial: boolean,
  shortFilm: boolean,
  webUrl: string,
  ratingMpaa: string,
  ratingFilmCritics: number,
  ratingFilmCriticsVoteCount: number,
  ratingImdb: number,
  ratingImdbVoteCount: number,
  ratingKinopoisk: number,
  ratingKinopoiskVoteCount: number,
}