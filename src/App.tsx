/**
*        Main App Component
* - Consumes custom debounce hook
* - Manages user input, movie and nomination states
* - Handles fetching data saved in local storage
*/
import { useEffect, useState } from 'react';
import List from './components/List';
import SearchBar from './components/SearchBar';
import Snackbar from '@material-ui/core/Snackbar';
import ShoppyConstants from './constants/constants';
import { ListType } from './constants/button';
import { useDebouncedSearch } from './hooks/debounce';
import { SearchRequest, getMovieById, searchMovies } from './api/movie';
import { Movie } from './models/movie';
import {
    generateNominationsString,
    generateQueryUrl,
    getSavedNominations,
    getSavedQuery,
    getSavedNominationIds
} from './util/state';

import './styles/App.css';
import './styles/Loader.css';

// Consume the debounce hook
const useSearchMovies = (initialState: SearchRequest) => useDebouncedSearch(initialState, ((query: SearchRequest) => searchMovies(query)));

export default function App() {
    // Fetch initial state from local storage (if it exists)
    const initialQuery = getSavedQuery();
    
    // don't need setInitialNominations but it needs to be a state variable
    // eslint-disable-next-line
    const [initialNominations, setInitialNominations] = useState(getSavedNominations());

    // Initialize state variables
    const { query, setQuery, searchResult } = useSearchMovies(initialQuery);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [nominations, setNominations] = useState<Movie[]>([]);
    const [moviesLoading, setMoviesLoading] = useState(true); // Render loaders while data is being fetched
    const [nominationsLoading, setNominationsLoading] = useState(true); // Render loaders while data is being fetched
    const [openNotification, setOpenNotification] = useState(false);

    /**
     * Component lifecycle hook to run at component mounting, unmounting and when dependencies update.
     * 
     * @listens to initial nominiations, user query and search results from the debounce search hook.
     */
    useEffect(() => {
        /**
         * Fetch all information about movies given an array of movie ID's and set movie & nomination state.
         * 
         * @param ids Array of imdb IDs for the movies to be fetched.
         * @param isNomination Boolean if the movie to be fetched is a nomination (for loading saved nominations).
         */
        async function fetchMovies(ids: string[], queries: string[]) {
            const fullMovies: Movie[] = [];
            const nominatedIds = getSavedNominationIds(); // Can't use initialNominations since they may have updated.

            for (var i = 0; i < ids.length; i++) { // Loop over the ID's
                const id = ids[i];
                if (!nominatedIds.includes(id) || queries.length > 0) {
                    const s = queries.length > 0 ? queries[i] : query.s; // If loading nominations, each has/had its own query. Otherwise its the search term.
                    const fullMovie = await getMovieById(id, s); // Associate search term to movie.
                    if (nominatedIds.length === 5 && queries.length === 0) {
                        fullMovie.disabled = true;
                        setOpenNotification(true);
                    }
                    fullMovies.push(fullMovie);
                }
            }

            if (queries.length > 0) {
                setNominations(fullMovies);
                setNominationsLoading(false);
            } else {
                setMovies(fullMovies);
                setMoviesLoading(false);
            }
        }

        // Set initial nominations
        if (initialNominations.length > 0) {
            setNominationsLoading(true);
            const ids: string[] = []; const queries: string[] = [];
            initialNominations.forEach((n: any) => {
                ids.push(n.id); queries.push(n.query);
            })
            fetchMovies(ids, queries);
        } else {
            setNominationsLoading(false);
        }

        // Set movies from search result
        if (!searchResult.loading) {
            if (query.s !== '') {
                setNominationsLoading(false);
                fetchMovies(searchResult.result, []);
            } else {
                setMovies([]);
                setMoviesLoading(false);
            }
        }

        if (query.s === '') {
            setMovies([]);
        }
    },
        [initialNominations,
            searchResult.loading,
            searchResult.result,
            query.s
        ]);

    /**
     * Handle user search input.
     * @param e the search event. 
     */
    const handleQuery = async (e: any) => {
        setMoviesLoading(true);
        const newQuery = { ...query, s: e.target.value };
        const url = generateQueryUrl(newQuery);
        window.localStorage.setItem('query', url);
        setQuery({ ...newQuery, query: url });
    }

    /**
     * Handle when user selects a movie for nomination.
     * @param nomination The nominated movie.
     */
    const handleNomination = (nomination: Movie) => {
        // Remove movie from movie list and set disabled if needed.
        const curMovies = [...movies];
        if (nominations.length === 4) {
            setOpenNotification(true);
            curMovies.forEach(n => {
                n.disabled = true;
            })
        }
        const idx = curMovies.indexOf(nomination);
        if (idx > -1) {
            curMovies.splice(idx, 1);
            setMovies(curMovies);
        }

        // Set nominations
        const curNominations = [...nominations, nomination];
        curNominations.forEach(n => {
            n.disabled = false;
        });
        window.localStorage.setItem('nominations', generateNominationsString(curNominations))
        setNominations(curNominations);
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
                curMovies.forEach(n => {
                    n.disabled = false;
                })
                setMovies(curMovies);
            }
        }

        // Edge case for when they removed the fifth element
        if (isFull) {
            setOpenNotification(false);
            const curMovies = [...movies];
            curMovies.forEach(n => {
                n.disabled = false;
            })
            setMovies(curMovies);
        }
    }

    return (
        <div className="App">
            <h2 className="title">The Shoppies</h2>
            <SearchBar query={query.s} handleQuery={handleQuery} />
            <div className="vertical-spacer" />
            <div className="lists">
                {/* Movie List */}
                <div className="list-container">
                    <h3 className="subtitle">{query.s === '' ? 'Results' : `Results for "${query.s}"`}</h3>
                    { moviesLoading === false ? (
                        <List
                            query={query.s}
                            movies={movies}
                            type={ListType.RESULTS}
                            onSelect={handleNomination}
                        />
                    ) : (
                        <div className='loader-container'>
                            <div className='loader'/>
                        </div>
                    )}
                </div>

                <div className="horizontal-spacer"></div>

                {/* Nominations List */}
                <div className="list-container">
                    <h3 className="subtitle">{ShoppyConstants.NOMINATIONS_LIST_TITLE}</h3>
                    { nominationsLoading === false ? (
                        <List
                            query={query.s}
                            movies={nominations}
                            type={ListType.NOMINATIONS}
                            onSelect={handleRemoveNomination}
                        />
                    ) : (
                        <div className='loader-container'>
                            <div className='loader'/>
                        </div>
                    )}
                </div>
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
