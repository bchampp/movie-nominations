/**
 * Functions that are involved with integration of the OMBD API.
 */

import ShoppyConstants from "../constants/constants";
import { Movie } from "../models/movie";

// enum plotType {
//   short = 'short',
//   full = 'full'
// };

// enum resultType {
//   movie = 'movie',
//   series = 'series',
//   episode = 'episode'
// };

export interface idRequest {
  id: string;
  type: string;
  plot: string;
  year: string;
  query: string;
}

export interface SearchRequest {
  s: string;
  type: string;
  year: string;
  page: number;
  query: string; 
}

/* Search Functionality */

/**
 * Main search function for OMBD API. Consumed by custom debounce hook. 
 * @param text Users text input.
 */
export const searchMoviesAsync = async (request: SearchRequest): Promise<Movie[]> => {

  const url = ShoppyConstants.OMBD_API_PREFIX + request.query + `&apikey=${ShoppyConstants.OMBD_API_KEY}`;
  const res: any = await fetch(url)
    .catch(err => console.log(err));
  const data = await res.json();
  // Ensure valid response from the API
  if (data.Response === "True") {
    return getFilteredMovies(data.Search, request.s);
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
    // Attach the query to these objects to cache what the search term was!
    filteredMovies.push(
      {
        title: movie.Title || null,
        year: movie.Year || null,
        poster: movie.Poster || null,
        query, id: movie.imdbID, disabled: false
      }); // custom fields 
  }
  return filteredMovies
}

/* Get Functionality */

export const getMovieAsync = async (request: idRequest): Promise<Movie> => {
  const res: any = await fetch(`${ShoppyConstants.OMBD_API_PREFIX}` + request.query + `&apikey=${ShoppyConstants.OMBD_API_KEY}`)
    .catch(err => console.log(err));
  const data = await res.json();
  console.log(data);
  let movie: any;
  return {
        title: movie.Title || null,
        year: movie.Year || null,
        poster: movie.Poster || null,
        query: '', id: movie.imdbID || null, disabled: false
  } // custom fields
}
