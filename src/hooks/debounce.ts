/* 
  Custom React Hook to debounce API calls 
  - Initially implemented api call inside useEffect()
  - Noticed that it was kind of buggy, sometimes valid search terms
    weren't being entered at the time of the API call
  - This debounces by 300ms while user is typing. 
  - Inspired by: https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js
*/

import { useState } from 'react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import useConstant from 'use-constant';
import { useAsync } from 'react-async-hook';

export const useDebouncedSearch = (searchFunction: any) => {
    const [query, setQuery] = useState('');
  
    const debouncedSearchFunction = useConstant(() =>
      AwesomeDebouncePromise(searchFunction, 300)
    );
  
    // Callback run everytime text changes, but through debounce
    const searchResults = useAsync(
      async () => {
        if (query.length === 0) {
          return [];
        } else {
          return debouncedSearchFunction(query);
        }
      },
      [debouncedSearchFunction, query]
    );
  
    // Return everything needed for the hook consumer
    return {
      query,
      setQuery,
      searchResults,
    };
  };