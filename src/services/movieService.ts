import axios from 'axios';
import type { Movie } from '../types/movie';

interface MovieApiResponse {
  results: Movie[];
}

export default async function fetchMovies(query: string, token: string): Promise<Movie[]> {
  const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

  const response = await axios.get<MovieApiResponse>(BASE_URL, {
    params: {
      query,
      include_adult: false,
      language: "en-US",
      page: 1,
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data.results;
}