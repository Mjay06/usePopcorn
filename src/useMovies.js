import {useState, useEffect} from "react"

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setISLoading] = useState();
  const [error, setError] = useState("");
  const API_KEY = "5e4d92f0";
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchmovie() {
        try {
          setError("");
          setISLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?i=tt3896198&apikey=${API_KEY}&s=${query}`,
            { signal: controller.signal }
          );

          const data = await res.json();
          if (data.Response === "False")
            throw new Error("can't find the movie you searched for");

          setMovies(data.Search);
        } catch (error) {
          if (error.name !== "AbortError") setError(error.message);
        } finally {
          setISLoading(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchmovie();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return {movies,isLoading, error}
}
