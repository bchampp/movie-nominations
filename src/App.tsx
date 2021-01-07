/**
 * Main App Component
 * - Consumes custom debounce hook
 * - Manages user input, movie and nomination states
 */

import { useEffect, useState } from 'react';
import List from './components/List';
import SearchBar from './components/SearchBar';
import Snackbar from '@material-ui/core/Snackbar';
import { Movie } from './models/movie';
import { ListType } from './constants/button';
import ShoppyConstants from './constants/constants';
import { useDebouncedSearch } from './hooks/debounce';
import { getMovieAsync, searchMoviesAsync } from './api/movie';
import './styles/App.css';
import { generateNominationsString, generateQueryLink, getInitialNominations, parseQueryString } from './util/state';

interface SearchRequest {
  s: string;
  type: string;
  year: string;
  page: number;
  query: string;
}

// TODO: Add page numbers (batching functionality)
// TODO: Add LocalStorage to preserve nominations
// TODO: Update Card UI for posters
// TODO: Add unit tests

// Consume custom debounce hook
const useSearchMovies = (initialState: SearchRequest) => useDebouncedSearch(initialState, ((query: SearchRequest) => searchMoviesAsync(query)));

function App() {
  // Handle initial setup 
  const initialQuery = parseQueryString(window.localStorage.getItem('query') || '');
  const { query, setQuery, movieIds } = useSearchMovies(initialQuery);

  // Handle movie and nomination lists
  const [movies, setMovies] = useState<Movie[]>([]); 
  const initialNominationIds = getInitialNominations();
  const [nominationIds, setNominationIds] = useState(initialNominationIds);
  const [nominations, setNominations] = useState<Movie[]>([]);

  // Notification if 5 nominations reached.
  const [openNotification, setOpenNotification] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('nominations', generateNominationsString(nominations))
    
    if (nominationIds) {
      // const noms = getMovieAsync()
      console.log("Test");
    }

    if (!movieIds.loading) { // wait for debounce to resolve
      setMovies(movieIds.result);
    }

  }, [movieIds, nominationIds]); // Listen to search results and re-render

  /**
   * Handle user search input.
   * @param e the search event. 
   */
  const handleQuery = async (e: any) => {
    const newQuery = { ...query, s: e.target.value };
    const url = generateQueryLink(newQuery);
    window.localStorage.setItem('query', url);
    setQuery({ ...newQuery, query: url })
  }

  /**
   * Handle when user selects a movie for nomination.
   * @param nomination The nominated movie.
   */
  const handleNomination = async (nomination: Movie) => {
    // Remove movie from movie list
    const curMovies = [...movies];
    const idx = curMovies.indexOf(nomination);
    console.log(curMovies);
    console.log(idx);
    if (idx > -1) {
      curMovies.splice(idx, 1);
      setMovies(curMovies);
    }

    // Set nominations
    setNominations([...nominations, nomination]);

    // Check if they've hit max nominations
    if (nominations.length === 4) {
      setOpenNotification(true);
      toggleDisabled(true);
    }
  }

  /**
   * Handle when user removes a movie from their nominations.
   * @param nomination The nominated movie.
   */
  const handleRemoveNomination = async (movie: Movie) => {
    // Check if nominations is full before removing nomination
    const isFull = nominations.length === 5;

    // Remove nomination from nomination list
    const curNominations = [...nominations];
    const idx = nominations.indexOf(movie);
    if (idx > -1) {
      curNominations.splice(idx, 1);
      setNominations(curNominations);
    }

    // Prepend it to movies list IF query hasn't changed
    if (query.s !== '') {
      if (movie.query === query.s) {
        const curMovies = [...movies];
        curMovies.unshift(movie);
        setMovies(curMovies);
      }
    }

    // Edge case for when they removed the fifth element
    if (isFull) {
      toggleDisabled(false);
      setOpenNotification(false);
    }
  }

  /**
   * Utility to toggle if nominations are disabled or not.
   */
  const toggleDisabled = (disabled: boolean) => {
    const disabledMovies: Movie[] = [];
    for (const movie of movies) {
      disabledMovies.push({ ...movie, disabled });
    }
    setMovies(disabledMovies)
  }

  return (
    <div className="App">
      <h2 className="title">The Shoppies</h2>
      <SearchBar query={query.s} handleQuery={handleQuery} />
      <div className="vertical-spacer" />
      <div className="lists">
        <List
          items={movies}
          type={ListType.RESULTS}
          title={query.s === '' ? 'Results' : `Results for "${query.s}"`}
          onSelect={handleNomination}
        />
        <div className="horizontal-spacer"></div>
        <List
          items={nominations}
          type={ListType.NOMINATIONS}
          title={ShoppyConstants.NOMINATIONS_LIST_TITLE}
          onSelect={handleRemoveNomination}
        />
      </div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={openNotification}
        message={ShoppyConstants.NOTIFICATION_TEXT}
        key={'bottom-right'}
      />
    </div>
  );
}

export default App;
