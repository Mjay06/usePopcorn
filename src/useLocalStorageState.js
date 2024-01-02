import {useState, useEffect} from "react"

export function useLocalStorageState(initialData, key){
    const [value, setValue] = useState(() => {
        const storedValue = JSON.parse(localStorage.getItem(key));
        return storedValue ? storedValue : initialData ;
      });
    useEffect(
        function () {
          localStorage.setItem(key, JSON.stringify(value));
        },
        [value, key]
      );
      return [value, setValue]
}