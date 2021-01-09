import { SearchRequest } from "../api/movie";
import { Movie } from "../models/movie";

// Fetch saved query from local storage
export const getSavedQuery = (): SearchRequest => {
  return parseQueryString(window.localStorage.getItem('query') || '');
}

// Get saved nomination IDs from local storage
export const getSavedNominations = (): string[] => {
  const nominations = window.localStorage.getItem('nominations') || '';
  return JSON.parse(nominations);
}

export const getSavedNominationIds = (): string[] => {
  const noms = getSavedNominations();
  const ids: string[] = [];

  noms.forEach((n: any) => {
    ids.push(n.id);
  });

  return ids;
}

/**
 * Utiity function to parse a raw query string into a SearchRequest object.
 * @param query the raw query string
 */
export const parseQueryString = (query: string): SearchRequest => {
  const x = query.split('&');
  const s = x[0].split('=')[1] || '';
  const type = x[1].split('=')[1] || '';
  const year = x[2].split('=')[1] || '';
  const page = Number(x[3].split('=')[1]) || 1;
  return {
    s, type, year, page, query
  }
}

/**
* Utility to generate a search query URL from a SearchRequest object.
* @param query The search request object.
*/
export const generateQueryUrl = (req: SearchRequest): string => {
  return `s=${req.s}&type=${req.type}&y=${req.year}&page=${req.page}`;
}

/**
 * Utility to generate a string of nomination ID's.
 * @param nominations An array of nominated movies.
 */
export const generateNominationsString = (nominations: Movie[] ): string => {
  let savedNominations = [];
  if (nominations.length > 0) {
    for (const nomination of nominations) {
      savedNominations.push({id: nomination.id, query: nomination.query})
    }
  }
  return JSON.stringify(savedNominations);
}
