import css from './App.module.css'
import SearchBar from '../SearchBar/SearchBar';
import { useState } from 'react'
import type { Movie } from "../../types/movie";
import toast from 'react-hot-toast';
import axios from 'axios';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';


export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const myKey = import.meta.env.VITE_TMDB_TOKEN;
  const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(false);
    setMovies([]);
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          query,
          include_adult: false,
          language: "en-US",
          page: 1,
        },
        headers: {
          Authorization: `Bearer ${myKey}`
        }
      });

      const results: Movie[] = response.data.results;

      if (results.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }

      setMovies(results);
    } catch {
      setError(true);
    } finally {
      setLoading(false)
    }
  };

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };
  

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSearch} />
      {loading && <Loader />}
      {error && <ErrorMessage />}
      {!loading && !error && <MovieGrid movies={movies} onSelect={handleSelect} />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
)}
    </div>
  );
}