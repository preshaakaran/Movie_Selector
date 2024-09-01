import React, { useState, useRef } from 'react';
import { UseKey } from './UseKey';
import useMovie from './useMovie';

const Header = ({ query, setQuery }) => {
    const inputEl = useRef(null);
    const { movies, loading, error, count } = useMovie(query);

    function searchMovies() {
        if (document.activeElement === inputEl.current) {
            return;
        }
        inputEl.current.focus();
        setQuery(inputEl.current.value);
    }

    UseKey("Enter", searchMovies);

    return (
        <div className='nav-bar'>
            <div className="logo">
                <span role="img" aria-label="popcorn">🍿</span>
                <h1>Movie Selector</h1>
            </div>

            <div className="nav-right">
                <input
                    className="search"
                    type="text"
                    value={query}
                    placeholder="Search movies..."
                    onChange={(e) => setQuery(e.target.value)}
                    ref={inputEl}
                />
            </div>

            {query?<div className="found">
                <p>Found <strong>{count}</strong> {count === 1 ? 'result' : 'results'}</p>
            </div>:<div className="found">
                <p>Found <strong>0</strong> result</p>
            </div>}

        </div>
    );
};

export default Header;
