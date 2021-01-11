/**
 * Functions that are involved with integration of the OMBD API.
 */

import ShoppyConstants from "../constants/constants";
import { Movie } from "../models/movie";

export interface SearchRequest {
  s: string;
  type: string;
  year: string;
  page: number;
  query: string; 
}

// TODO: Chain the .then() for these functions

/**
 * Search function for OMDB API. Consumed by custom debounce hook.
 * @param request. The Query Request object.
 * @returns an array of the found movie IDs.
 */
export const searchMovies = async (request: SearchRequest): Promise<string[]> => {
  const url = ShoppyConstants.OMBD_API_PREFIX + request.query + `&apikey=${ShoppyConstants.OMBD_API_KEY}`;
  const res: any = await fetch(url)
    .catch(err => console.log(err));
  const data = await res.json();
  // Ensure valid response from the API
  if (data.Response === "True") {
    const ids: string[] = [];
    for(const movie of data.Search) {
      ids.push(movie.imdbID);
    }
    return ids;
  } else {
    return [];
  }
}

/**
 * 
 * @param id The ID of the movie to be searched.
 * @return A full movie object.
 */
export const getMovieById = async (id: string, query: string): Promise<Movie> => {
  const res: any = await fetch(`${ShoppyConstants.OMBD_API_PREFIX}i=${id}&apikey=${ShoppyConstants.OMBD_API_KEY}`)
    .catch(err => console.log(err));
  const movie = await res.json();
  return {
    id,
    query,
    disabled: false,
    actors: movie.Actors,
    boxOffice: movie.BoxOffice,
    country: movie.Country,
    director: movie.Director,
    genre: movie.Genre,
    language: movie.Language,
    metaScore: movie.Metascore,
    plot: movie.Plot,
    poster: movie.Poster,
    production: movie.Production,
    rated: movie.Rated,
    ratings: movie.Ratings,
    release: movie.Released,
    runtime: movie.Runtime,
    title: movie.Title,
    imdbRating: movie.imdbRating,
    imdbVotes: movie.imdbVotes,
    year: movie.Year
  }
}
