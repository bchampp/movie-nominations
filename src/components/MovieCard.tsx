/**
 * Movie Card Component - renders movie information and nominate/remove button.
 */

import { Button } from '@material-ui/core';
import { Flipped } from 'react-flip-toolkit';
import { ListType } from '../constants/button';
import { Movie } from '../models/movie';
import '../styles/Card.css';

const createCardFlipId = (index: string) => `listItem-${index}`;

const shouldFlip = (index: any) => (prev: any, current: any) =>
  index === prev || index === current;

export function MovieCard({ movie, type, onSelect, onClick }
  : { movie: Movie, type: ListType, onSelect: any, onClick: any }) {

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
              flipId={`poster-${movie.id}`}
              stagger="card-poster"
              shouldFlip={shouldFlip(movie.id)}
            >
              <img src={movie.poster} className="poster" alt="poster" />
            </Flipped>
            <div className="description">
              <Flipped
                flipId={`title-${movie.id}`}
                stagger="card-title"
                shouldFlip={shouldFlip(movie.id)}
                delayUntil={createCardFlipId(movie.id)}
              >
                <span className="movie-title">{movie.title}</span>
              </Flipped>
              <Flipped
                flipId={`genre-${movie.id}`}
                stagger="card-specs"
                shouldFlip={shouldFlip(movie.id)}
                delayUntil={createCardFlipId(movie.id)}
              >
                <span className="movie-info">{movie.rated} | {movie.runtime} | {movie.genre}</span>
              </Flipped>
              <Flipped
                flipId={`actors-${movie.id}`}
                stagger="card-content"
                shouldFlip={shouldFlip(movie.id)}
                delayUntil={createCardFlipId(movie.id)}
              >
                <span className="movie-info">{movie.actors}</span>
              </Flipped>
              <div style={{ width: '90%' }}>
                <Flipped
                  flipId={`rating-${movie.id}`}
                  stagger="card-rating"
                  shouldFlip={shouldFlip(movie.id)}
                  delayUntil={createCardFlipId(movie.id)}
                >
                  <span className="movie-rating" style={{ float: 'left' }}>Rating: {movie.imdbRating}</span>
                </Flipped>
                <Flipped
                  flipId={`rating-${movie.id}`}
                  stagger="card-button"
                  shouldFlip={shouldFlip(movie.id)}
                  delayUntil={createCardFlipId(movie.id)}
                >
                  <div className='button-container'>
                    <Button
                      variant="contained"
                      disabled={movie.disabled}
                      color={type === ListType.RESULTS ? "primary" : "secondary"}
                      onClick={(e: React.MouseEvent<HTMLElement>) => onSelect(e, movie)}
                    >
                      {type === ListType.RESULTS ? "Nominate" : "Remove"}
                    </Button>
                  </div>
                </Flipped>
              </div>
            </div>
          </div>
        </Flipped>
      </div>
    </Flipped>
  )
}

export function ExpandedMovieCard({ movie, type, onSelect, onClick }
  : { movie: Movie, type: ListType, onSelect: any, onClick: any }) {

  const additionalRatings = movie.ratings
    .filter((x: any) => (x.Source !== 'Internet Movie Database' && x.Source !== 'Metacritic'));

  const additionalRating: any = additionalRatings.length > 0 ? additionalRatings[0] : null;

  return (
    <Flipped
      flipId={createCardFlipId(movie.id)}
      stagger="card"
      // onStart={el => {
      //   setTimeout(() => {
      //     el.classList.add("animated-in");
      //   }, 400);
      // }}
    >
      <div className="expandedListItem" onClick={() => onClick(movie.id)}>
        <Flipped inverseFlipId={createCardFlipId(movie.id)}>
          <>
            <div className="expandedListItemContent">
              <Flipped
                flipId={`poster-${movie.id}`}
                stagger="card-poster"
                // delayUntil={createCardFlipId(movie.id)}
              >
                <img src={movie.poster} className="poster posterExpanded" alt="poster"/>
              </Flipped>
              <div className="expandedDescription">
                <Flipped
                  flipId={`title-${movie.id}`}
                  stagger="card-content"
                  shouldFlip={shouldFlip(movie.id)}
                  delayUntil={createCardFlipId(movie.id)}
                >
                  <span className="movie-title">{movie.title}</span>
                </Flipped>
                <Flipped
                  flipId={`genre-${movie.id}`}
                  stagger="card-content"
                  shouldFlip={shouldFlip(movie.id)}
                  // delayUntil={createCardFlipId(movie.id)}
                >
                  <span className="movie-info">{movie.rated} | {movie.runtime} | {movie.genre}</span>
                </Flipped>
                <span className="expanded-movie-info">Release Date: {movie.release}</span>
                <span className="expanded-movie-info">Box Office: {movie.boxOffice}</span>
                <span className="expanded-movie-info">Production: {movie.production}</span>
                <span className="expanded-movie-info">Director(s): {movie.director}</span>
                <Flipped
                  flipId={`actors-${movie.id}`}
                  stagger="card-content"
                  shouldFlip={shouldFlip(movie.id)}
                  delayUntil={createCardFlipId(movie.id)}
                >
                  <span className="movie-info">Stars: {movie.actors}</span>
                </Flipped>
              </div>
            </div>
            <p className="movie-plot">Summary: {movie.plot}</p>
            <div style={{ width: '95%', display: 'flex', flexWrap: 'wrap' }}>
              <div className="movie-scores">
                <Flipped
                  flipId={`rating-${movie.id}`}
                  stagger="card-content"
                  shouldFlip={shouldFlip(movie.id)}
                  delayUntil={createCardFlipId(movie.id)}
                >
                  <span className="movie-rating">Rating: {movie.imdbRating}</span>
                </Flipped>
                <span className="movie-rating">Votes: {movie.imdbVotes}</span>
                {
                  additionalRating &&
                  <span className="movie-rating">
                    {additionalRating.Source}: {additionalRating.Value}
                  </span>
                }
                <span className="movie-rating">Metascore: {movie.metaScore}</span>
              </div>

              <Flipped
                flipId={`rating-${movie.id}`}
                stagger="card-content"
                shouldFlip={shouldFlip(movie.id)}
                delayUntil={createCardFlipId(movie.id)}
              >
                <div className='button-container'>
                  <Button
                    variant="contained"
                    disabled={movie.disabled}
                    color={type === ListType.RESULTS ? "primary" : "secondary"}
                    onClick={(e: React.MouseEvent<HTMLElement>) => onSelect(e, movie)}
                  >
                    {type === ListType.RESULTS ? "Nominate" : "Remove"}
                  </Button>
                </div>
              </Flipped>
            </div>
          </>
        </Flipped>
      </div>
    </Flipped>
  )
}