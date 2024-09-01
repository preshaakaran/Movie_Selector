import React, { useState, useEffect, useRef } from 'react';
import './Body.css';
import useMovie from './useMovie';
import StarRating from './StarRating';
import { UseKey } from './UseKey';
import useLocalStorage from './useLocalStorage';

const Body = ({ query }) => {
  const [watched, setWatched] = useLocalStorage('watched', []);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { movies, loading, error } = useMovie(query);
  const calculateAverageRating = (movies) => {
    const ratings = movies.map((movie) => movie.userRating).filter((rating) => !isNaN(rating) && rating > 0);
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, rating) => acc + Number(rating), 0);
    return (sum / ratings.length).toFixed(1); 
  };

  const avgUserRating = calculateAverageRating(watched);

  function handleMovieClick(movie) {
    setSelectedMovie(movie);
  }

  function onCloseMovie() {
    setSelectedMovie(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  

  return (
    <div className='body'>
      <div className='left hide-scrollbar'>
        <Main
          movies={query ? movies : []}
          loading={loading}
          error={error}
          onMovieClick={handleMovieClick}
        />
      </div>

      <div className='right hide-scrollbar'>
        {selectedMovie ? (
          <div className='selected-movie'>
            <button className='btn-back' onClick={onCloseMovie}>
              <img src='arrow.gif' alt='back' style={{ height: '30px', width: '30px' }} />
            </button>
            <div className='selected-movies'>
              <div className='flex'>
                <img className='posters' src={selectedMovie.Poster} alt={selectedMovie.Title} />
                <MovieDetails
                  selectedMovie={selectedMovie}
                  onCloseMovie={onCloseMovie}
                  onAddWatched={handleAddWatched}
                  watched={watched}
                  loading={loading}
                />
              </div>
              <div className="details-overview">
                <h3>{selectedMovie.Title}</h3>
                <p>Year: {selectedMovie.Year}</p>
                <p>IMDB ID: {selectedMovie.imdbID}</p>
                
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className='summary'>
              <div className='shead'>Movies you watched</div>
              <div>
                <p>
                  <span>#️⃣</span>
                  <span>{watched.length} movies</span>
                </p>
                <p>
                  <span>🌟</span>
                  <span>{avgUserRating}</span>
                </p>
              </div>
            </div>

            <div className='watched-lists hide-scrollbar'>
              {watched.map((movie) => (
                <WatchedList key={movie.imdbID} movie={movie} selectedMovie={selectedMovie} handleDeleteWatched={handleDeleteWatched} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

function Main({ movies, loading, error, onMovieClick }) {
  if (loading) return <p className="loader">Loading...</p>;
  if (error) return <p className="error"><span>⛔️</span> {error}</p>;
  return (
    <div className='main'>
      <div className='movie-lists'>
        {movies.map((movie) => (
          <ListBox key={movie.imdbID} movie={movie} onClick={onMovieClick} />
        ))}
      </div>
    </div>
  );
}

function ListBox({ movie, onClick }) {
  return (
    <div className='list-box' onClick={() => onClick(movie)}>
      <div className='movie-list'>
        <img className='poster' src={movie.Poster} alt={movie.Title} />
        <div className='movie-info'>
          <h3>{movie.Title}</h3>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function WatchedList({ movie, selectedMovie, handleDeleteWatched }) {
  return (
    <div className='watched-list'>
      <div className='plist'>
      <img className='poster' src={movie.Poster} alt={movie.Title} />
      <div className='watch-info'>
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🌟</span>
            <span>{movie.userRating}</span>
          </p>
          
          
        </div>
      </div>
      </div>

      <button className='btn-delete' onClick={() => handleDeleteWatched(movie.imdbID)}>
            X
      </button>
    </div>
  );
}

function MovieDetails({ selectedMovie, onCloseMovie, onAddWatched, watched, loading }) {
  const [userRating, setUserRating] = useState("");
  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedMovie.imdbID);
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedMovie.imdbID)?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Overview: plot,
  } = selectedMovie;

  function handleAdd() {
    const newWatchedMovie = {
      ...selectedMovie,
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  UseKey("Escape", onCloseMovie);

  useEffect(() => {
    if (title) {
      document.title = `Movie | ${title}`;
      return () => {
        document.title = "movieselector";
      };
    }
  }, [title]);

  return (
    <section>
      <div className="rating">
        {!isWatched ? (
          <>
            <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
            {userRating > 0 && (
              <button className="btn-add" onClick={handleAdd}>
                + Add to list
              </button>
            )}
          </>
        ) : (
          <p>
            You rated this movie {watchedUserRating} <span>⭐️</span>
          </p>
        )}
      </div>
      <p>
        <em>{plot}</em>
      </p>
    </section>
  );
}

export default Body;
