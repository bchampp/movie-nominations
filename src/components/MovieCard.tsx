/**
 * Movie Card Component - renders movie information and nominate/remove button.
 */

import { Flipped } from 'react-flip-toolkit';
import { ListType } from '../constants/button';
import { Movie } from '../models/movie';
import '../styles/Card.css';

const createCardFlipId = (index: string) => `listItem-${index}`;

const shouldFlip = (index: any) => (prev: any, current: any) =>
  index === prev || index === current;

export function MovieCard({movie, type, onSelect, onClick}
    : {movie: Movie, type: ListType, onSelect: any, onClick: any}) {
    
    return (
      <Flipped
      flipId={createCardFlipId(movie.id)}
      stagger="card"
      shouldInvert={shouldFlip(movie.id)}
    >
      <div className="listItem" onClick={() => onClick(movie.id)}>
        <Flipped inverseFlipId={createCardFlipId(movie.id)}>
          <div className="listItemContent">
            <Flipped
              flipId={`avatar-${movie.id}`}
              stagger="card-content"
              shouldFlip={shouldFlip(movie.id)}
              delayUntil={createCardFlipId(movie.id)}
            >
              <div className="avatar" />
            </Flipped>
            <div className="description">
            <Flipped
                  flipId={`title-${movie.id}`}
                  stagger="card-content"
                  shouldFlip={shouldFlip(movie.id)}
                  delayUntil={createCardFlipId(movie.id)}
                >
              <h4>{movie.title}</h4>
              </Flipped>
              <Flipped
                  flipId={`genre-${movie.id}`}
                  stagger="card-content"
                  shouldFlip={shouldFlip(movie.id)}
                  delayUntil={createCardFlipId(movie.id)}
                >
              <h4>{movie.genre}</h4>
              </Flipped>
              <Flipped
                  flipId={`actors-${movie.id}`}
                  stagger="card-content"
                  shouldFlip={shouldFlip(movie.id)}
                  delayUntil={createCardFlipId(movie.id)}
                >
              <h4>{movie.actors}</h4>
              </Flipped>
            </div>
          </div>
        </Flipped>
      </div>
    </Flipped>
    )
}

export function ExpandedMovieCard({movie, type, onSelect, onClick}
  : {movie: Movie, type: ListType, onSelect: any, onClick: any}) {
  return (
    <Flipped
      flipId={createCardFlipId(movie.id)}
      stagger="card"
      onStart={el => {
        setTimeout(() => {
          el.classList.add("animated-in");
        }, 400);
      }}
    >
      <div className="expandedListItem" onClick={() => onClick(movie.id)}>
        <Flipped inverseFlipId={createCardFlipId(movie.id)}>
          <div className="expandedListItemContent">
            <Flipped
              flipId={`avatar-${movie.id}`}
              stagger="card-content"
              delayUntil={createCardFlipId(movie.id)}
            >
              <div className="avatar avatarExpanded" />
            </Flipped>
            <div className="description">{movie.title}
            </div>
            <div className="additional-content">{movie.genre}
            </div>
          </div>
        </Flipped>
      </div>
    </Flipped>
  )
}