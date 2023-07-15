import { useEffect, useState } from "react";

import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import NumResult from "./components/NumResult";
import Main from "./components/Main";
import Box from "./components/Box";
import MovieDetails from "./components/MovieDetails";
import MovieSummary from "./components/MovieSummary";
import WatchedMOvieList from "./components/WatchedMOvieList";
import MovieList from "./components/MovieList";

const key = process.env.REACT_APP_API_KEY;

export default function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [watched, setWatched] = useState(function () {
    const storedMovie = localStorage.getItem("watched");
    return JSON.parse(storedMovie);
  });
  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }
  function handleCloseMovie(id) {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?i=tt3896198&apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok) {
            throw new Error("Error in fetching movies");
          }
          const data = await res.json();
          //  console.log(data);
          if (data.Response === "False") {
            //  console.log("error going to be thrown");
            throw new Error("Movies Not Found");
          }
          //  console.log(data.Search);
          setMovies(data.Search);
          setError("");
        } catch (err) {
          // console.log(err);
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length <= 3) {
        setError("");
        setMovies([]);
      }
      handleCloseMovie();
      fetchMovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <MovieSummary watched={watched} />
              <WatchedMOvieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
