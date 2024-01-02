import { useEffect } from "react";

export function useKey(onKeydown, code) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function callback(e) {
    if (e.code === code) onKeydown();
  }
  useEffect(
    function () {
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [callback]
  );
}
