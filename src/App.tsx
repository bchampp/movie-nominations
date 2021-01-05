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
import { searchMoviesAsync } from './api/movie';

import './styles/App.css';

// TODO: Add LocalStorage to preserve nominations
// TODO: Update Card UI for posters
// TODO: Add unit tests

// Consume custom debounce hook
const useSearchMovies = () => useDebouncedSearch((text: string) => searchMoviesAsync(text));

function App() {
  const { query, setQuery, searchResults } = useSearchMovies();
  const [queryUpdated, setQueryUpdated] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [nominations, setNominations] = useState<Movie[]>([]);
  const [openNotification, setOpenNotification] = useState(false);
  
  useEffect(() => {
    if (!searchResults.loading && queryUpdated === true) { // wait for debounce to resolve
      setMovies(searchResults.result);
    }
  }, [searchResults, queryUpdated]); // Listen to search results and re-render

  /**
   * Handle user search input.
   * @param e the search event. 
   */
  const handleQuery = async (e: any) => {
    setQueryUpdated(true);
    setQuery(e.target.value);
  }

  /**
   * Handle when user selects a movie for nomination.
   * @param nomination The nominated movie.
   */
  const handleNomination = async (nomination: Movie) => {
    setQueryUpdated(false);
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
    setQueryUpdated(false);
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
    if (query !== '') {
      if (movie.query === query) {
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
      disabledMovies.push({...movie, disabled});
    }
    setMovies(disabledMovies)
  }

  return (
    <div className="App">
      <h2 className="title">The Shoppies</h2>
      <SearchBar query={query} handleQuery={handleQuery} />
      <div className="vertical-spacer" />
      <div className="lists">
        <List 
          items={movies} 
          type={ListType.RESULTS}
          title={query === '' ? ShoppyConstants.RESULTS_EMPTY_TITLE : `Results for "${query}"`} 
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
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        open={openNotification}
        message={ShoppyConstants.NOTIFICATION_TEXT}
        key={'bottom-right'}
      />
    </div>
  );
}

export default App;
