import { SearchRequest } from "../api/movie";
import { Movie } from "../models/movie";

export const getSavedQuery = () => {
  return parseQueryString(window.localStorage.getItem('query') || '');
}

export const getSavedNominations = () => {
  const nominations = window.localStorage.getItem('nominations') || '';
  const ids = nominations.split('&');
  return ids;
}

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
  
export const generateQueryLink = (query: SearchRequest): string => {
    return `s=${query.s}&type=${query.type}&y=${query.year}&page=${query.page}`;
  }
  
export const generateNominationsString = (nominations: Movie[]): string => {
    let str = '';
    if (nominations.length > 0) {
      for (const n of nominations) {
        if (str === '') {
          str = n.id
        } else {
          str = str.concat('&', n.id)
        }
      }
    }
    return str;
  }
