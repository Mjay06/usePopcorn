import { useState, useEffect, useRef } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const API_KEY = "5e4d92f0";
export default function App() {
  const [watched, setWatched] = useLocalStorageState([],'watched')
  const [query, setQuery] = useState("");
  const [selectedId, setselectedId] = useState("");
  const { movies, isLoading, error } = useMovies(query);
  function addToWatched(newItem) {
    setWatched((oldWatched) => [...oldWatched, newItem]);
  }
  function handleId(id) {
    setselectedId((selectedID) => (selectedID === id ? null : id));
  }
  function closeId() {
    setselectedId(null);
  }
  function deletemovie(id) {
    setWatched((oldmov) => oldmov.filter((mov) => id !== mov.imdbID));
  }



  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList onClick={handleId} movies={movies} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId && (
            <MovieDetails
              watched={watched}
              onAddToList={addToWatched}
              closeID={closeId}
              selectedID={selectedId}
            />
          )}
          {!selectedId && (
            <>
              {" "}
              <WatchedSummary watched={watched} />{" "}
              <WatchedList onDelete={deletemovie} watched={watched} />{" "}
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
function Loader() {
  return <p className="loader">Loading...</p>;
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {message}
    </p>
  );
}
function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}
function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  const inputEl = useRef(null);

function onEnter(){
  if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
}

useKey(onEnter,'Enter')
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
function MovieList({ movies, onClick }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie onClick={onClick} movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}
function MovieDetails({ selectedID, closeID, onAddToList, watched }) {
  const [rating, setRating] = useState(null);
  const [moviedetails, setmoviedetails] = useState([]);
  const [isloading, setIsloading] = useState(null);
  const isWatched = watched.some((movie) => movie.imdbID === selectedID);
  const userRating =
    isWatched &&
    watched
      .map((watch) => watch.imdbID === selectedID && watch)
      .filter((data) => data !== undefined && data.imdbID === selectedID)[0]
      .userRating;

  const currentcount = useRef(0);
  let newItem;
  function handleAdd() {
    newItem = {
      imdbID: moviedetails.imdbID,
      imdbRating: moviedetails.imdbRating,
      Runtime: Number(moviedetails.Runtime.split(" ")[0]),
      Poster: moviedetails.Poster,
      userRating: +rating,
      Title: moviedetails.Title,
      CurrentCount: currentcount.current,
    };
    onAddToList(newItem);
    closeID();
  }
  useKey(closeID, 'Escape')
  useEffect(
    function () {
      async function fetchDetails() {
        setIsloading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?i=${selectedID}&apikey=${API_KEY}`
        );
        const data = await res.json();
        setmoviedetails(data);
        setIsloading(false);
      }
      if (!moviedetails) return;
      fetchDetails();
    },
    [selectedID]
  );
  useEffect(
    function () {
      document.title = `Movie | ${moviedetails.Title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [moviedetails.Title]
  );
  useEffect(
    function () {
      if (rating) currentcount.current++;
    },
    [rating]
  );

  return (
    <div className="details">
      {isloading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button onClick={closeID} className="btn-back">
              {" "}
              &larr;
            </button>
            <img
              src={moviedetails.Poster}
              alt={`poster of ${moviedetails.Title} movie `}
            />
            <div className="details-overview">
              <h2>{moviedetails.Title}</h2>
              <p>
                {moviedetails.Released} &bull; {moviedetails.Runtime}{" "}
              </p>
              <p>{moviedetails.Genre}</p>
              <p>
                <span>⭐</span>
                {moviedetails.imdbRating}
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  {" "}
                  <StarRating
                    maxRating={10}
                    size="24"
                    onSetRating={setRating}
                  />
                  {rating > 0 && (
                    <button onClick={handleAdd} className="btn-add">
                      {" "}
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    defaultRating={userRating}
                    onSetRating={setRating}
                    size="24"
                  />
                </>
              )}
            </div>
            <p>
              <em>{moviedetails.Plot}</em>
            </p>
            <p>{moviedetails.Actors}</p>
            <p>Directed by {moviedetails.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}
function Movie({ movie, onClick }) {
  return (
    <li onClick={() => onClick(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
/*
function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);

  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedList watched={watched} />
        </>
      )}
    </div>
  );
}
*/
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.Runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <Watch onDelete={onDelete} movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}
function Watch({ movie, onDelete }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.Runtime} min</span>
        </p>
        <button onClick={() => onDelete(movie.imdbID)} className="btn-delete">
          x
        </button>
      </div>
    </li>
  );
}

/* 
CHALLENGE SECTION 12
import { useEffect, useState } from "react";
// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

export default function App() {
  const [value, setValue] = useState("")
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')
  const [output, setOutput] = useState(null)

  useEffect(function(){
   async function fetchAnswer(){
     if (value){
     const res = await fetch(`https://api.frankfurter.app/latest?amount=${+value}&from=${from}&to=${to}`)
     const data = await res.json()
     console.log(data)
     if(data.message){
      setOutput(value);
       return
     } 
     setOutput(data.rates[to])
    }
   }
   fetchAnswer()
  }, [value,from, to])
  return (
    <div>
      <input onChange={(e)=> setValue(e.target.value)} value={value} type="text" />
      <select onChange={(e)=> setFrom(e.target.value)} value={from}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select onChange={(e)=> setTo(e.target.value)} value={to}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>{output}</p>
    </div>
  );
}

//CHALLENGE SECTION 13 

import { useState } from "react";

function useGeolocation(ermessage) {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({});
  const [error, setError] = useState(null);

  const { lat, lng } = position;

  function getPosition() {
    

    if (!navigator.geolocation)
      return setError(ermessage);

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return{lat, lng,isLoading, getPosition, error}
}

export default function App() {
  const [countClicks, setCountClicks] = useState(0);
  ;
const {lat, lng,isLoading, getPosition, error} = useGeolocation("Your browser does not support geolocation")

  return (
    <div>
      <button onClick={()=> {getPosition(); setCountClicks((count) => count + 1)}} disabled={isLoading}>
        Get my position
      </button>

      {isLoading && <p>Loading position...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && lat && lng && (
        <p>
          Your GPS position:{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://www.openstreetmap.org/#map=16/${lat}/${lng}`}
          >
            {lat}, {lng}
          </a>
        </p>
      )}

      <p>You requested position {countClicks} times</p>
    </div>
  );
}

*/
