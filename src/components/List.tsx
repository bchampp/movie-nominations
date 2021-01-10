/**
 * List Component - used to contain a list of MovieCards.
 */
import { useState } from 'react';
import MovieCard from './MovieCard'
import { Movie } from '../models/movie';
import { ListType } from '../constants/button';
import ShoppyConstants from '../constants/constants';
import '../styles/App.css';
import { Flipper } from 'react-flip-toolkit';

export default function List({ items, onSelect, title, type } 
    : {items: Movie[], onSelect: any, title: string, type: ListType}) {
        const [openCard, setOpenCard] = useState<string>('');

        const onClick = (id: string) => {
            if (openCard === id) {
                setOpenCard(''); // Close the card
            } else {
                setOpenCard(id);
            }
        }

        if (items && items.length > 0) {
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
                        { items.map((movie, i) => {
                            return (
                                // TODO: with Key
                                <li key={i}>
                                    { openCard === i ? (
                                        <ExpandedMovieCard
                                            movie={movie}
                                            onClick={onClick}
                                        />
                                    )

                                    }
                                    <MovieCard movie={movie} type={type} onSelect={onSelect} />
                                </li>
                                );
                            })
                        }
                    </ul>
                </Flipper>
            )
        } else {
            return (
                <div>{ShoppyConstants.RESULTS_EMPTY_MESSAGE}</div>
            )
        }
    )
}