import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";

export default function useAutocomplete(input, setLoading) {
  const [predictions, setPredictions] = useState([]);

  const autocomplete = useRef();

  if (!autocomplete.current) {
    autocomplete.current =
      new window.google.maps.places.AutocompleteService();
  }

  function getPlacePredictions(input) {
    input && setLoading(true);
    input && autocomplete.current.getPlacePredictions(
      { input, types: ['establishment'] },
      predictions => {
        setLoading(false);
        predictions && setPredictions(predictions);  
      }
    );
  }

  const debouncedGetPlacePredictions = useCallback(
      debounce(getPlacePredictions, 350),
      []
  );

  useEffect(() => {
    debouncedGetPlacePredictions(input);
  }, [input]);

  return predictions;
}
