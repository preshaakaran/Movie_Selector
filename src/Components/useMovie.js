import { useState, useEffect } from 'react';

const API_KEY = '9a2eb6824c1161a75e36d5a1eee940ce'; 
const API_URL = 'https://api.themoviedb.org/3/search/movie'; 

const useMovie = (query) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [count, setCount] = useState(0);


    useEffect(() => {
        const controller = new AbortController();
    

        async function fetchMovies() {
        
            setLoading(true);
            setError("");

            try {
                const url = `${API_URL}?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`;

                const response = await fetch(url, { signal: controller.signal });
                console.log(response);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if(data){
                    setCount(data.results.length);
                }

                console.log(data);
                console.log(count)

                const formattedMovies = data.results.map(movie => ({
                    imdbID: movie.id.toString(),
                    Title: movie.title,
                    Year: movie.release_date.split('-')[0],
                    Poster: `https://image.tmdb.org/t/p/w300${movie.poster_path}`,
                    Backdrop: `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`, 
                    Overview: movie.overview || "No overview available",
                    Genres: movie.genre_ids, 
                    OriginalLanguage: movie.original_language,
                    Popularity: movie.popularity,
                    VoteAverage: movie.vote_average || "N/A", 
                    VoteCount: movie.vote_count || 0, 
                    Runtime: "N/A", 
                    UserRating: "N/A", 
                }));

                setMovies(formattedMovies);

            } catch (error) {
                if (error.name !== "AbortError") {
                    console.log(error.message);
                    setError(error.message);
                }    
            } finally {
                setLoading(false);
            }
        }



        if(query){
            if ( query.length >= 1) { 
                fetchMovies();
            } else {
                setMovies([]);
                setCount(0)
                setError("");
            }
        }



        return () => {
            controller.abort();
        };
    }, [query]);




   

    return { movies, loading, error, count};
}

export default useMovie;
