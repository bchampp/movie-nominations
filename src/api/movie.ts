/**
 * Functions that are involved with integration of the OMBD API.
 */

import ShoppyConstants from "../constants/constants";
import { Movie } from "../models/movie";

/**
 * Main search function for OMBD API. Consumed by custom debounce hook. 
 * @param text Users text input.
 */
export const searchMoviesAsync = async (text: string): Promise<Movie[]> => {
    // Make api request (url is https://ombdapi.com/?s=<search-term>&apiKey=<api-key>)
    const res: any = await fetch(`${ShoppyConstants.OMBD_API_PREFIX}?s=${text}&apikey=${ShoppyConstants.OMBD_API_KEY}`)
      .catch(err => console.log(err));
    const data = await res.json();
    // Ensure valid response from the API
    if (data.Response === "True") {
      return getFilteredMovies(data.Search, text);
    } else {
      return [];
    }
}

/**
 * Utility function to filter search results.
 * @param movies Unfiltered movies list.
 */
export const getFilteredMovies = (movies: Array<any>, query: string) => {
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
