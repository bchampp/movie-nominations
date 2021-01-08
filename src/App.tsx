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
import { getMovieById, searchMovies } from './api/movie';
import './styles/App.css';
import { generateNominationsString, generateQueryLink, getSavedNominations, getSavedQuery } from './util/state';

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
const useSearchMovies = (initialState: SearchRequest) => useDebouncedSearch(initialState, ((query: SearchRequest) => searchMovies(query)));

function App() {
  // Handle initial setup 
  const initialQuery = getSavedQuery();
  const initialNominationIds = getSavedNominations();
  const { query, setQuery, searchResult } = useSearchMovies(initialQuery);

  const [movies, setMovies] = useState<Movie[]>([]); 

  const [nominations, setNominations] = useState<Movie[]>([]);

  // Notification if 5 nominations reached.
  const [openNotification, setOpenNotification] = useState(false);

  useEffect(() => {
    async function getMovies(ids: string[], isNomination: boolean) {
      const fullMovies: Movie[] = [];
      for (const id of ids) {
        const fullMovie = await getMovieById(id, query.s);
        fullMovies.push(fullMovie);
      }
      if (isNomination) {
        setNominations(fullMovies);
      } else {
        setMovies(fullMovies);
      }
    }

    if (initialNominationIds.length > 0) {
      getMovies(initialNominationIds, true);
    }

    if (!searchResult.loading) {
      getMovies(searchResult.result, false);
    }
    
  }, [query, searchResult.loading, searchResult.result]); // Listen to if searchResults have loaded or initialNominationIds

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
    const curNominations = [...nominations, nomination];
    window.localStorage.setItem('nominations', generateNominationsString(curNominations))
    setNominations(curNominations);

    // Check if they've hit max nominations
    if (nominations.length === 5) {
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
      window.localStorage.setItem('nominations', generateNominationsString(curNominations))
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
          movies={movies}
          type={ListType.RESULTS}
          title={query.s === '' ? 'Results' : `Results for "${query.s}"`}
          onSelect={handleNomination}
        />
        <div className="horizontal-spacer"></div>
        <List
          movies={nominations}
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
