/**
 * List Component - used to contain a list of MovieCards.
 */

import MovieCard from './MovieCard'
import { Movie } from '../models/movie';
import { ListType } from '../constants/button';
import ShoppyConstants from '../constants/constants';
import '../styles/App.css';

export default function List({ movies, onSelect, title, type } 
    : {movies: Movie[], onSelect: any, title: string, type: ListType}) {
    return (
        <div className="list-container">
            <h3 className="list-title">{title}</h3>
            { movies && movies.length > 0 ?
                <ul className="list">
                    { movies.map(movie => {
                        return (
                            <MovieCard movie={movie} type={type} onSelect={onSelect} />
                            );
                        })
                    }
                </ul>
                :
                <div>
                    {
                        type === ListType.RESULTS ? 
                        ShoppyConstants.RESULTS_EMPTY_MESSAGE
                        : 
                        ShoppyConstants.NOMINATIONS_EMPTY_MESSAGE
                    }
                </div>
            }
        </div>
    )
}