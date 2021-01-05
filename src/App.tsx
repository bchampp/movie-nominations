import React, { useEffect, useState } from 'react';
import List from './components/List';
import SearchBar from './components/SearchBar';
import Snackbar from '@material-ui/core/Snackbar';
import { Movie } from './models/movie';
import { ListType } from './constants/button';
import ShoppyConstants from './constants/constants';
import './styles/App.css';

// TODO: Add LocalStorage to preserve nominations
// TODO: Update Card UI for posters
// TODO: Add unit tests

function App() {
  const [query, setQuery] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [nominations, setNominations] = useState<Movie[]>([]);
  const [openNotification, setOpenNotification] = useState(false);
  
  /**
   * Component hook for mounting component & when query state updates.
   */
  useEffect(() => {
    /**
     * Utility function to filter search results.
     * @param movies Unfiltered movies list.
     */
    const getFilteredMovies = (movies: Array<any>) => {
      const filteredMovies: Movie[] = [];
      for (const movie of movies) {
        if (movie.Type === 'movie') {
          // Attach the query to these objects to cache what the search term was!
          filteredMovies.push(
            { title: movie.Title || '', 
              year: movie.Year || '', 
              poster: movie.Poster || '',
              query, disabled: false }); // custom fields 
        }
      }
      return filteredMovies
    }

    /**
     * Utility function to fetch api data. 
     */
    const fetchData = async () => {
      // Make api request (url is https://ombdapi.com/?s=<search-term>&apiKey=<api-key>)
      return await fetch(`${ShoppyConstants.OMBD_API_PREFIX}?s=${query}&apikey=${ShoppyConstants.OMBD_API_KEY}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          // Ensure valid response from the API
          if (data.Response === "True") {
            setMovies(getFilteredMovies(data.Search));
          } else if (query === '') {
            setMovies([]);
          } else {
            // Don't do anything - want to persist data if possible
          }
        })
        .catch(err => console.log(err));
    }

    fetchData()
  }, [query]); // Listen to user input and re-render

  /**
   * Handle user search input.
   * @param e the search event. 
   */
  const handleQuery = async (e: any) => {
    setQuery(e.target.value);
  }

  /**
   * Handle when user selects a movie for nomination.
   * @param nomination The nominated movie.
   */
  const handleNomination = async (nomination: Movie) => {
    // Remove movie from movie list
    const curMovies = [...movies];
    const idx = curMovies.indexOf(nomination);
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
