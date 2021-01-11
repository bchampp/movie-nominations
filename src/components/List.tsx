/**
 * List Component - used to contain a list of MovieCards.
 */
import { useState } from 'react';
import { MovieCard, ExpandedMovieCard } from './MovieCard'
import { Movie } from '../models/movie';
import { ListType } from '../constants/button';
import ShoppyConstants from '../constants/constants';
import '../styles/App.css';
import { Flipper } from 'react-flip-toolkit';

export default function List({ movies, onSelect, type, query } 
    : {movies: Movie[], onSelect: any, type: ListType, query: string}) {

    const [openCard, setOpenCard] = useState<string>('');

    const onClick = (id: string) => {
        if (openCard === id) {
            setOpenCard(''); // Close the card
        } else {
            setOpenCard(id);
        }
    }

    if (movies && movies.length > 0) {
        return (
            <Flipper
                flipKey={openCard}
                className="staggered-list-content"
                spring="gentle"
                staggerConfig={{
                    card: {
                        reverse: openCard !== ''
                    }
                }}
                decisionData={openCard}
            >
                <ul className="list">
                    { movies.map(movie => {
                        return (
                            // TODO: with Key
                            <li key={movie.id}>
                                { openCard === movie.id ? (
                                    <ExpandedMovieCard
                                        movie={movie} 
                                        type={type} 
                                        onSelect={onSelect} 
                                        onClick={onClick} 
                                    />
                                ) : (
                                    <MovieCard 
                                        movie={movie} 
                                        type={type} 
                                        onSelect={onSelect} 
                                        onClick={onClick} 
                                    />
                                )
                                }
                            </li>
                            );
                        })
                    }
                </ul>
            </Flipper>
        )
    } else {
        if (type === ListType.RESULTS) {
            if (query === "") {
                return (
                    <div>{ShoppyConstants.NO_SEARCH_PROVIDED}</div>
                )
            } else {
                return (
                    <div>{ShoppyConstants.RESULTS_EMPTY_MESSAGE}</div>
                )
            }
        } else {
            return (
                <div>{ShoppyConstants.NOMINATIONS_EMPTY_MESSAGE}</div>
            )
        }
    }
}